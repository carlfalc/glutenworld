import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Base USD pricing (will be converted to local currency)
const BASE_PRICING_USD = {
  quarterly: 1299, // $12.99
  annual: 2999     // $29.99
};

// Currency mapping by country
const COUNTRY_CURRENCY_MAP = {
  'US': 'usd', 'CA': 'cad', 'GB': 'gbp', 'AU': 'aud',
  'DE': 'eur', 'FR': 'eur', 'ES': 'eur', 'IT': 'eur', 'NL': 'eur',
  'AT': 'eur', 'BE': 'eur', 'FI': 'eur', 'IE': 'eur', 'PT': 'eur'
};

// Get current exchange rates from USD
async function getExchangeRate(toCurrency: string): Promise<number> {
  if (toCurrency === 'usd') return 1;
  
  try {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    const data = await response.json();
    return data.rates[toCurrency.toUpperCase()] || 1;
  } catch (error) {
    console.log('Exchange rate fetch failed:', error);
    return 1; // Fallback to 1:1 rate
  }
}

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

    // Detect user's country and currency
    const countryCode = await detectCountryFromIP(req);
    const currency = COUNTRY_CURRENCY_MAP[countryCode] || 'usd';
    logStep("Geo-location detected", { countryCode, currency });

    // Get exchange rate and convert USD prices to local currency
    const exchangeRate = await getExchangeRate(currency);
    const localPricing = {
      quarterly: Math.round(BASE_PRICING_USD.quarterly * exchangeRate),
      annual: Math.round(BASE_PRICING_USD.annual * exchangeRate)
    };
    logStep("Currency conversion", { exchangeRate, localPricing });

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

    // Define pricing based on plan and converted currency
    let priceData;
    const currencySymbols = { usd: '$', eur: '€', gbp: '£', cad: 'C$', aud: 'A$' };
    const symbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
    
    switch (plan) {
      case 'quarterly':
        priceData = {
          currency: currency,
          product_data: { name: `Quarterly Plan - Gluten World (${symbol}${(localPricing.quarterly / 100).toFixed(2)})` },
          unit_amount: localPricing.quarterly,
          recurring: { interval: "month", interval_count: 3 },
        };
        break;
      case 'annual':
        priceData = {
          currency: currency,
          product_data: { name: `Annual Plan - Gluten World (${symbol}${(localPricing.annual / 100).toFixed(2)})` },
          unit_amount: localPricing.annual,
          recurring: { interval: "year" },
        };
        break;
      case 'trial':
        priceData = {
          currency: currency,
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
      currency,
      amount: priceData.unit_amount,
      country: countryCode,
      usdAmount: plan === 'quarterly' ? BASE_PRICING_USD.quarterly : BASE_PRICING_USD.annual
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