import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Currency and pricing configuration
const PRICING_CONFIG = {
  'US': { currency: 'usd', quarterly: 1299, annual: 2999 }, // $12.99, $29.99
  'CA': { currency: 'cad', quarterly: 1699, annual: 3999 }, // $16.99 CAD, $39.99 CAD
  'GB': { currency: 'gbp', quarterly: 999, annual: 2399 },  // £9.99, £23.99
  'AU': { currency: 'aud', quarterly: 1799, annual: 4299 }, // $17.99 AUD, $42.99 AUD
  'DE': { currency: 'eur', quarterly: 1199, annual: 2799 }, // €11.99, €27.99
  'FR': { currency: 'eur', quarterly: 1199, annual: 2799 }, // €11.99, €27.99
  'ES': { currency: 'eur', quarterly: 1199, annual: 2799 }, // €11.99, €27.99
  'IT': { currency: 'eur', quarterly: 1199, annual: 2799 }, // €11.99, €27.99
  'NL': { currency: 'eur', quarterly: 1199, annual: 2799 }, // €11.99, €27.99
  // Default fallback to USD
  'DEFAULT': { currency: 'usd', quarterly: 1299, annual: 2999 }
};

// Detect country from IP using CF-IPCountry header or IP geolocation
async function detectCountryFromIP(request: Request): Promise<string> {
  // First try Cloudflare's CF-IPCountry header (if available)
  const cfCountry = request.headers.get('CF-IPCountry');
  if (cfCountry && cfCountry !== 'XX') {
    return cfCountry;
  }
  
  // Try X-Forwarded-For or other headers for IP
  const forwardedFor = request.headers.get('X-Forwarded-For');
  const realIP = request.headers.get('X-Real-IP');
  const ip = forwardedFor?.split(',')[0] || realIP || '127.0.0.1';
  
  // Use ipapi.co for IP geolocation (free tier: 1000 requests/day)
  try {
    const response = await fetch(`https://ipapi.co/${ip}/country_code/`);
    if (response.ok) {
      const countryCode = await response.text();
      return countryCode.trim().toUpperCase();
    }
  } catch (error) {
    console.log('IP geolocation failed:', error);
  }
  
  return 'US'; // Default to US if detection fails
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { plan } = await req.json();
    if (!plan) throw new Error("Plan is required");
    logStep("Plan selected", { plan });

    // Detect user's country and get localized pricing
    const countryCode = await detectCountryFromIP(req);
    const pricing = PRICING_CONFIG[countryCode] || PRICING_CONFIG['DEFAULT'];
    logStep("Geo-location detected", { countryCode, currency: pricing.currency });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    } else {
      logStep("Creating new customer");
    }

    // Define pricing based on plan and user's location
    let priceData;
    const currencySymbols = { usd: '$', eur: '€', gbp: '£', cad: 'C$', aud: 'A$' };
    const symbol = currencySymbols[pricing.currency as keyof typeof currencySymbols] || '$';
    
    switch (plan) {
      case 'quarterly':
        priceData = {
          currency: pricing.currency,
          product_data: { name: `Quarterly Plan - Gluten World (${symbol}${(pricing.quarterly / 100).toFixed(2)})` },
          unit_amount: pricing.quarterly,
          recurring: { interval: "month", interval_count: 3 },
        };
        break;
      case 'annual':
        priceData = {
          currency: pricing.currency,
          product_data: { name: `Annual Plan - Gluten World (${symbol}${(pricing.annual / 100).toFixed(2)})` },
          unit_amount: pricing.annual,
          recurring: { interval: "year" },
        };
        break;
      case 'trial':
        priceData = {
          currency: pricing.currency,
          product_data: { name: "Free Trial - Gluten World" },
          unit_amount: 0, // Free
          recurring: { interval: "day", interval_count: 5 },
        };
        break;
      default:
        throw new Error("Invalid plan selected");
    }
    
    logStep("Pricing configured", { 
      plan, 
      currency: pricing.currency, 
      amount: priceData.unit_amount,
      country: countryCode 
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/dashboard?canceled=true`,
      metadata: {
        user_id: user.id,
        plan: plan,
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});