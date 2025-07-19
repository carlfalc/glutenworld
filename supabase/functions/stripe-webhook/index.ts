
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

const sendEmail = async (to: string, subject: string, html: string, emailType: string, userId?: string) => {
  try {
    const emailResponse = await resend.emails.send({
      from: "Gluten World <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    // Log the email
    if (userId) {
      await supabaseClient.from("email_logs").insert({
        user_id: userId,
        email: to,
        email_type: emailType,
        subject,
        sent_at: new Date().toISOString(),
        resend_id: emailResponse.data?.id,
        status: 'sent'
      });
    }

    logStep("Email sent successfully", { to, subject, emailType });
    return emailResponse;
  } catch (error) {
    logStep("Email sending failed", { error: error.message, to, subject });
    throw error;
  }
};

const getEmailTemplate = (type: string, data: any) => {
  const baseStyle = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Gluten World</h1>
      </div>
  `;

  const endStyle = `
      <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center; margin-top: 30px;">
        <p style="color: #9CA3AF; font-size: 14px; margin: 0;">
          Questions? Just reply to this email - we're here to help! 💜
        </p>
        <p style="color: #9CA3AF; font-size: 14px; margin: 10px 0 0 0;">
          Best regards,<br>
          The Gluten World Team
        </p>
      </div>
    </div>
  `;

  switch (type) {
    case 'subscription_created':
      return baseStyle + `
        <div style="background: linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h2 style="color: #7C3AED; margin: 0 0 15px 0;">Welcome to Premium! 🎉</h2>
          <p style="color: #374151; line-height: 1.6; margin: 0;">
            Thank you for subscribing to Gluten World Premium! You now have access to all premium features including unlimited recipe conversions, priority support, and our exclusive recipe library.
          </p>
        </div>
        <div style="margin-bottom: 25px;">
          <h3 style="color: #1F2937; margin: 0 0 15px 0;">Your Premium Benefits:</h3>
          <ul style="color: #374151; line-height: 1.8; padding-left: 20px;">
            <li>Unlimited AI recipe conversions</li>
            <li>Access to premium recipe library</li>
            <li>Priority customer support</li>
            <li>Advanced meal planning tools</li>
            <li>Save unlimited favorite recipes</li>
          </ul>
        </div>
      ` + endStyle;

    case 'subscription_updated':
      return baseStyle + `
        <div style="background: linear-gradient(135deg, #F3E8FF 0%, #EDE9FE 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h2 style="color: #7C3AED; margin: 0 0 15px 0;">Subscription Updated 📝</h2>
          <p style="color: #374151; line-height: 1.6; margin: 0;">
            Your Gluten World subscription has been successfully updated. The changes will take effect immediately.
          </p>
        </div>
      ` + endStyle;

    case 'subscription_cancelled':
      return baseStyle + `
        <div style="background: linear-gradient(135deg, #FEF3E2 0%, #FEF9C3 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h2 style="color: #D97706; margin: 0 0 15px 0;">We're Sorry to See You Go 😢</h2>
          <p style="color: #374151; line-height: 1.6; margin: 0;">
            Your Gluten World subscription has been cancelled. You'll continue to have access to premium features until ${data.periodEnd || 'the end of your billing period'}.
          </p>
        </div>
        <div style="margin-bottom: 25px;">
          <p style="color: #374151; line-height: 1.6;">
            We'd love to have you back anytime! If you change your mind, you can easily reactivate your subscription from your account dashboard.
          </p>
        </div>
      ` + endStyle;

    case 'payment_succeeded':
      return baseStyle + `
        <div style="background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px;">
          <h2 style="color: #059669; margin: 0 0 15px 0;">Payment Received 💳</h2>
          <p style="color: #374151; line-height: 1.6; margin: 0;">
            Thank you! Your payment of $${(data.amount / 100).toFixed(2)} has been successfully processed.
          </p>
        </div>
        <div style="margin-bottom: 25px;">
          <p style="color: #374151; line-height: 1.6;">
            Your subscription is active and all premium features are available in your account.
          </p>
        </div>
      ` + endStyle;

    default:
      return baseStyle + `
        <p style="color: #374151; line-height: 1.6;">
          Thank you for being a valued member of Gluten World!
        </p>
      ` + endStyle;
  }
};

const handler = async (req: Request): Promise<Response> => {
  try {
    logStep("Webhook received");

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No signature provided");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );

    logStep("Event type", { type: event.type });

    let emailType = '';
    let emailSubject = '';
    let emailData: any = {};

    switch (event.type) {
      case 'customer.subscription.created':
        emailType = 'subscription_created';
        emailSubject = 'Welcome to Gluten World Premium! 🎉';
        break;

      case 'customer.subscription.updated':
        emailType = 'subscription_updated';
        emailSubject = 'Your Gluten World Subscription Updated';
        break;

      case 'customer.subscription.deleted':
        emailType = 'subscription_cancelled';
        emailSubject = 'Subscription Cancelled - We\'ll Miss You!';
        const subscription = event.data.object as Stripe.Subscription;
        emailData.periodEnd = new Date(subscription.current_period_end * 1000).toLocaleDateString();
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason === 'subscription_cycle') {
          emailType = 'payment_succeeded';
          emailSubject = 'Payment Received - Thank You!';
          emailData.amount = invoice.amount_paid;
        }
        break;

      default:
        logStep("Unhandled event type", { type: event.type });
        return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    if (emailType) {
      // Get customer email
      const stripeObject = event.data.object as any;
      let customerId = stripeObject.customer;
      
      if (typeof customerId === 'string') {
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer.email) {
          // Check email preferences
          const { data: preferences } = await supabaseClient
            .from('email_preferences')
            .select('*')
            .eq('email', customer.email)
            .maybeSingle();

          const shouldSend = !preferences || preferences[emailType.replace('_', '_')] !== false;

          if (shouldSend) {
            // Get user ID for logging
            const { data: subscriber } = await supabaseClient
              .from('subscribers')
              .select('user_id')
              .eq('email', customer.email)
              .maybeSingle();

            const emailHtml = getEmailTemplate(emailType, emailData);
            
            await sendEmail(
              customer.email,
              emailSubject,
              emailHtml,
              emailType,
              subscriber?.user_id
            );
          } else {
            logStep("Email sending skipped due to user preferences", { email: customer.email, type: emailType });
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    logStep("Webhook error", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
};

serve(handler);
