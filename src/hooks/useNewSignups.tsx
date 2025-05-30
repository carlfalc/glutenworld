
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewSignup {
  id: string;
  full_name: string;
  country: string;
  created_at: string;
}

export const useNewSignups = () => {
  return useQuery({
    queryKey: ['new-signups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, country, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // For demo purposes, if no country data exists, we'll add some sample countries
      const signupsWithCountries = (data || []).map(signup => ({
        ...signup,
        country: signup.country || ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan'][Math.floor(Math.random() * 7)]
      }));
      
      return signupsWithCountries;
    },
  });
};
