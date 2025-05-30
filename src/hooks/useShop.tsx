
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ShopItem {
  id: string;
  seller_id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  rating?: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useShopItems = () => {
  return useQuery({
    queryKey: ['shop-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shop_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });
};
