
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  fullName: string;
  signInUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, signInUrl }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Gluten World <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Gluten World! 🌟",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Welcome to Gluten World! 🌟</h1>
            <p style="color: #6B7280; font-size: 16px; margin: 10px 0;">Your AI-Powered Recipe Conversion Journey Begins</p>
          </div>

          <div style="background: linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <h2 style="color: #7C3AED; margin: 0 0 15px 0;">Hi ${fullName || 'there'}! 👋</h2>
            <p style="color: #374151; line-height: 1.6; margin: 0;">
              We're thrilled to have you join our amazing community of gluten-free food enthusiasts! 
              You're now part of a supportive network where delicious, safe recipes are just a conversation away.
            </p>
          </div>

          <div style="margin-bottom: 25px;">
            <h3 style="color: #1F2937; margin: 0 0 15px 0;">What's waiting for you:</h3>
            <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
              <li><strong>AI Recipe Assistant:</strong> Convert any recipe to gluten-free in seconds</li>
              <li><strong>Community Support:</strong> Connect with fellow gluten-free enthusiasts</li>
              <li><strong>Recipe Library:</strong> Access thousands of tested gluten-free recipes</li>
              <li><strong>Smart Substitutions:</strong> Get intelligent ingredient recommendations</li>
              <li><strong>5-Day Free Trial:</strong> Explore all features at no cost</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${signInUrl}" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
              Start Your Gluten-Free Journey →
            </a>
          </div>

          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h4 style="color: #1F2937; margin: 0 0 10px 0;">💡 Pro Tip:</h4>
            <p style="color: #6B7280; margin: 0; line-height: 1.5;">
              Start by asking our AI to convert your favorite family recipe! Simply describe the dish, 
              and we'll provide a complete gluten-free version with ingredient substitutions and cooking tips.
            </p>
          </div>

          <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
            <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
              Questions? Just reply to this email - we're here to help! 💜
            </p>
            <p style="color: #9CA3AF; font-size: 14px; margin: 10px 0 0 0;">
              Happy cooking,<br>
              The Gluten World Team
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
