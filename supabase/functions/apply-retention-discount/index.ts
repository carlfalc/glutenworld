import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[APPLY-RETENTION-DISCOUNT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Initialize Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find the customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      throw new Error("No active subscription found");
    }

    const subscription = subscriptions.data[0];
    logStep("Found active subscription", { subscriptionId: subscription.id });

    // Create a 50% discount coupon (one-time use)
    const coupon = await stripe.coupons.create({
      percent_off: 50,
      duration: "once",
      name: "Retention Discount - 50% Off",
      metadata: {
        user_email: user.email,
        applied_at: new Date().toISOString(),
        reason: "subscription_retention"
      }
    });
    logStep("Created retention coupon", { couponId: coupon.id });

    // Apply the coupon to the subscription
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      coupon: coupon.id,
      metadata: {
        ...subscription.metadata,
        retention_discount_applied: new Date().toISOString(),
        retention_coupon_id: coupon.id
      }
    });
    logStep("Applied coupon to subscription", { 
      subscriptionId: updatedSubscription.id,
      couponId: coupon.id 
    });

    // Log the retention action in our database
    await supabaseClient.from("subscribers").update({
      updated_at: new Date().toISOString(),
    }).eq("email", user.email);

    // Insert retention event log (if you want to track these events)
    await supabaseClient.from("subscription_events").insert({
      user_id: user.id,
      email: user.email,
      event_type: "retention_discount_applied",
      event_data: {
        coupon_id: coupon.id,
        subscription_id: subscription.id,
        discount_percent: 50
      },
      created_at: new Date().toISOString()
    }).then(() => {
      logStep("Logged retention event to database");
    }).catch((error) => {
      logStep("Failed to log retention event (non-critical)", { error: error.message });
    });

    logStep("Retention discount successfully applied");
    return new Response(JSON.stringify({
      success: true,
      coupon_id: coupon.id,
      subscription_id: subscription.id,
      discount_percent: 50,
      message: "50% discount applied to your next billing cycle"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in apply-retention-discount", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});