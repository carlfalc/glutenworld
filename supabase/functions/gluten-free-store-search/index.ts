import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchRequest {
  query: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

    if (!GOOGLE_PLACES_API_KEY) {
      throw new Error('Google Places API key not configured');
    }

    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const { query, location, latitude, longitude, radius = 50000 }: SearchRequest = await req.json();

    console.log('Search request:', { query, location, latitude, longitude, radius });

    // Use AI to enhance the search query for gluten-free businesses
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating Google Places API search queries for gluten-free and allergen-friendly businesses. 
            Generate 3-5 specific search terms that would find relevant businesses based on the user's query.
            Focus on: gluten-free restaurants, celiac-friendly cafes, allergen-free bakeries, health food stores, etc.
            Return only a JSON array of search terms, no other text.`
          },
          {
            role: 'user',
            content: `Create search terms for: "${query}"`
          }
        ],
        temperature: 0.7,
        max_tokens: 200
      }),
    });

    const aiData = await aiResponse.json();
    let searchTerms: string[];
    
    try {
      searchTerms = JSON.parse(aiData.choices[0].message.content);
    } catch {
      // Fallback search terms if AI parsing fails
      searchTerms = [
        `gluten free ${query}`,
        `celiac friendly ${query}`,
        `allergen free ${query}`,
        `gluten free restaurant`,
        `health food store`
      ];
    }

    console.log('AI-generated search terms:', searchTerms);

    // Build location parameter for Google Places API
    let locationParam = '';
    if (latitude && longitude) {
      locationParam = `location=${latitude},${longitude}&radius=${radius}`;
    } else if (location) {
      locationParam = `query=${encodeURIComponent(location)}`;
    }

    const allResults: any[] = [];

    // Search with each AI-generated term
    for (const searchTerm of searchTerms) {
      try {
        const placesUrl = latitude && longitude 
          ? `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${locationParam}&keyword=${encodeURIComponent(searchTerm)}&type=restaurant|store|bakery&key=${GOOGLE_PLACES_API_KEY}`
          : `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchTerm + (location ? ` in ${location}` : ''))}&key=${GOOGLE_PLACES_API_KEY}`;

        console.log('Searching with URL:', placesUrl);

        const placesResponse = await fetch(placesUrl);
        const placesData = await placesResponse.json();

        if (placesData.status === 'OK' && placesData.results) {
          allResults.push(...placesData.results);
        }
      } catch (error) {
        console.error(`Error searching for "${searchTerm}":`, error);
      }
    }

    // Remove duplicates based on place_id
    const uniqueResults = allResults.filter((place, index, self) => 
      index === self.findIndex(p => p.place_id === place.place_id)
    );

    // Sort by rating and limit results
    const sortedResults = uniqueResults
      .filter(place => place.rating && place.rating >= 3.5) // Only show well-rated places
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 20);

    console.log(`Found ${sortedResults.length} unique places`);

    // Format results for frontend
    const formattedResults = sortedResults.map(place => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address || place.vicinity,
      rating: place.rating,
      priceLevel: place.price_level,
      types: place.types,
      photoReference: place.photos?.[0]?.photo_reference,
      geometry: place.geometry,
      openingHours: place.opening_hours,
      googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
    }));

    return new Response(JSON.stringify({
      results: formattedResults,
      searchTerms: searchTerms,
      total: formattedResults.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gluten-free-store-search:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [],
      total: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);