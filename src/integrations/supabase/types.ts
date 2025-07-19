export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_generator_access: {
        Row: {
          amount: number
          created_at: string
          email: string
          id: string
          paid: boolean
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          email: string
          id?: string
          paid?: boolean
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          email?: string
          id?: string
          paid?: boolean
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          category_id: string | null
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category_id?: string | null
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category_id?: string | null
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "community_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          community_joined_at: string | null
          created_at: string
          dietary_preferences: string[] | null
          email: string
          full_name: string | null
          id: string
          is_community_member: boolean | null
          location: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          community_joined_at?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          email: string
          full_name?: string | null
          id: string
          is_community_member?: boolean | null
          location?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          community_joined_at?: string | null
          created_at?: string
          dietary_preferences?: string[] | null
          email?: string
          full_name?: string | null
          id?: string
          is_community_member?: boolean | null
          location?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recipe_generation_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          current_category: string | null
          error_message: string | null
          generated_recipes: number | null
          id: string
          started_at: string
          status: string
          total_recipes: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_category?: string | null
          error_message?: string | null
          generated_recipes?: number | null
          id?: string
          started_at?: string
          status?: string
          total_recipes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_category?: string | null
          error_message?: string | null
          generated_recipes?: number | null
          id?: string
          started_at?: string
          status?: string
          total_recipes?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      recipe_likes: {
        Row: {
          created_at: string
          id: string
          recipe_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_likes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipes: {
        Row: {
          average_rating: number | null
          calories_per_serving: number | null
          carbs_g: number | null
          cholesterol_mg: number | null
          converted_recipe: string | null
          cook_time: number | null
          created_at: string
          cuisine_type: string | null
          dietary_labels: string[] | null
          difficulty_level: string | null
          fat_g: number | null
          fiber_g: number | null
          id: string
          image_url: string | null
          ingredients: Json | null
          instructions: string[] | null
          is_public: boolean | null
          likes_count: number | null
          original_recipe: string | null
          prep_time: number | null
          protein_g: number | null
          rating_count: number | null
          servings: number | null
          sodium_mg: number | null
          sugar_g: number | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          average_rating?: number | null
          calories_per_serving?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          converted_recipe?: string | null
          cook_time?: number | null
          created_at?: string
          cuisine_type?: string | null
          dietary_labels?: string[] | null
          difficulty_level?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          is_public?: boolean | null
          likes_count?: number | null
          original_recipe?: string | null
          prep_time?: number | null
          protein_g?: number | null
          rating_count?: number | null
          servings?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          average_rating?: number | null
          calories_per_serving?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          converted_recipe?: string | null
          cook_time?: number | null
          created_at?: string
          cuisine_type?: string | null
          dietary_labels?: string[] | null
          difficulty_level?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          is_public?: boolean | null
          likes_count?: number | null
          original_recipe?: string | null
          prep_time?: number | null
          protein_g?: number | null
          rating_count?: number | null
          servings?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          rating: number | null
          seller_id: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          rating?: number | null
          seller_id: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          rating?: number | null
          seller_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          features_locked: boolean
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          trial_used: boolean
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          features_locked?: boolean
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          trial_used?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          features_locked?: boolean
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          trial_used?: boolean
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          city: string
          country: string
          created_at: string
          id: string
          postal_code: string
          state_province: string
          street_address: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string
          id?: string
          postal_code: string
          state_province: string
          street_address: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          id?: string
          postal_code?: string
          state_province?: string
          street_address?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          allergen_warnings: string[] | null
          created_at: string
          dairy_status: string | null
          gluten_status: string | null
          id: string
          product_analysis: string | null
          product_category: string | null
          product_description: string | null
          product_image_url: string | null
          product_name: string | null
          product_scanned_at: string | null
          recipe_id: string | null
          safety_rating: string | null
          type: string
          updated_at: string
          user_id: string
          vegan_status: string | null
        }
        Insert: {
          allergen_warnings?: string[] | null
          created_at?: string
          dairy_status?: string | null
          gluten_status?: string | null
          id?: string
          product_analysis?: string | null
          product_category?: string | null
          product_description?: string | null
          product_image_url?: string | null
          product_name?: string | null
          product_scanned_at?: string | null
          recipe_id?: string | null
          safety_rating?: string | null
          type: string
          updated_at?: string
          user_id: string
          vegan_status?: string | null
        }
        Update: {
          allergen_warnings?: string[] | null
          created_at?: string
          dairy_status?: string | null
          gluten_status?: string | null
          id?: string
          product_analysis?: string | null
          product_category?: string | null
          product_description?: string | null
          product_image_url?: string | null
          product_name?: string | null
          product_scanned_at?: string | null
          recipe_id?: string | null
          safety_rating?: string | null
          type?: string
          updated_at?: string
          user_id?: string
          vegan_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "user_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_recipes: {
        Row: {
          average_rating: number | null
          calories_per_serving: number | null
          carbs_g: number | null
          cholesterol_mg: number | null
          converted_recipe: string | null
          cook_time: number | null
          created_at: string
          cuisine_type: string | null
          difficulty_level: string | null
          fat_g: number | null
          fiber_g: number | null
          id: string
          image_url: string | null
          ingredients: Json | null
          instructions: string[] | null
          is_public: boolean | null
          original_recipe: string | null
          prep_time: number | null
          protein_g: number | null
          rating_count: number | null
          servings: number | null
          sodium_mg: number | null
          sugar_g: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          calories_per_serving?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          converted_recipe?: string | null
          cook_time?: number | null
          created_at?: string
          cuisine_type?: string | null
          difficulty_level?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          is_public?: boolean | null
          original_recipe?: string | null
          prep_time?: number | null
          protein_g?: number | null
          rating_count?: number | null
          servings?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          average_rating?: number | null
          calories_per_serving?: number | null
          carbs_g?: number | null
          cholesterol_mg?: number | null
          converted_recipe?: string | null
          cook_time?: number | null
          created_at?: string
          cuisine_type?: string | null
          difficulty_level?: string | null
          fat_g?: number | null
          fiber_g?: number | null
          id?: string
          image_url?: string | null
          ingredients?: Json | null
          instructions?: string[] | null
          is_public?: boolean | null
          original_recipe?: string | null
          prep_time?: number | null
          protein_g?: number | null
          rating_count?: number | null
          servings?: number | null
          sodium_mg?: number | null
          sugar_g?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_update_trial_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_community_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      start_user_trial: {
        Args: { user_email: string; user_id_param: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
