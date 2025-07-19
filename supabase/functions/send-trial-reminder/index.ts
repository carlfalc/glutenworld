
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TrialReminderRequest {
  email: string;
  fullName?: string;
  trialEndDate: string;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, trialEndDate, userId }: TrialReminderRequest = await req.json();

    // Check email preferences
    let shouldSend = true;
    if (userId) {
      const { data: preferences } = await supabaseClient
        .from('email_preferences')
        .select('trial_reminder')
        .eq('user_id', userId)
        .maybeSingle();

      shouldSend = !preferences || preferences.trial_reminder !== false;
    }

    if (!shouldSend) {
      console.log("Trial reminder email sending skipped due to user preferences");
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const trialEnd = new Date(trialEndDate);
    const timeLeft = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    const emailResponse = await resend.emails.send({
      from: "Gluten World <onboarding@resend.dev>",
      to: [email],
      subject: `Your Free Trial Ends in ${timeLeft} Day${timeLeft !== 1 ? 's' : ''}! 🕐`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Don't Miss Out!</h1>
            <p style="color: #6B7280; font-size: 16px; margin: 10px 0;">Your Gluten World Trial is Ending Soon</p>
          </div>

          <div style="background: linear-gradient(135deg, #FEF3E2 0%, #FEF9C3 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #D97706; margin: 0 0 15px 0;">Hi ${fullName || 'there'}! ⏰</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              Your free trial of Gluten World Premium ends in just ${timeLeft} day${timeLeft !== 1 ? 's' : ''}! 
              Don't lose access to all the amazing features you've been enjoying.
            </p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1F2937; margin: 0 0 15px 0;">What you'll miss without Premium:</h3>
            <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
              <li>Unlimited AI recipe conversions</li>
              <li>Access to our premium recipe library</li>
              <li>Priority customer support</li>
              <li>Advanced meal planning tools</li>
              <li>Unlimited saved favorites</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'supabase.co')}/subscription" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
              Continue with Premium →
            </a>
          </div>

          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h4 style="color: #1F2937; margin: 0 0 10px 0;">💝 Special Offer:</h4>
            <p style="color: #6B7280; margin: 0; line-height: 1.5;">
              Subscribe now and get your first month at a special discount! 
              Plus, you can cancel anytime if you're not completely satisfied.
            </p>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
              Questions about your subscription? Just reply to this email!
            </p>
            <p style="color: #9CA3AF; font-size: 14px; margin: 10px 0 0 0;">
              Thanks for being part of Gluten World,<br>
              The Gluten World Team
            </p>
          </div>
        </div>
      `,
    });

    // Log the email
    if (userId) {
      await supabaseClient.from("email_logs").insert({
        user_id: userId,
        email: email,
        email_type: 'trial_reminder',
        subject: `Your Free Trial Ends in ${timeLeft} Day${timeLeft !== 1 ? 's' : ''}! 🕐`,
        sent_at: new Date().toISOString(),
        resend_id: emailResponse.data?.id,
        status: 'sent'
      });
    }

    console.log("Trial reminder email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-trial-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
