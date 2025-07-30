import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "owner" | "admin" | "user" | null;

// Cache for role lookups to avoid redundant API calls
const roleCache = new Map<string, { role: UserRole; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  
  // Fast-path for owner - check email immediately without API call
  const isOwnerByEmail = useMemo(() => {
    return user?.email === 'falconercarlandrew@gmail.com';
  }, [user?.email]);

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      // Fast-path for owner - set immediately and skip API call
      if (isOwnerByEmail) {
        console.log('useUserRole: Fast-path owner access granted');
        setRole("owner");
        setLoading(false);
        return;
      }

      // Check cache first
      const cached = roleCache.get(user.id);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('useUserRole: Using cached role');
        setRole(cached.role);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          setRole("user"); // Default to user role if error
        } else {
          const userRole = data?.role || "user";
          setRole(userRole);
          // Cache the result
          roleCache.set(user.id, { role: userRole, timestamp: Date.now() });
        }
      } catch (error) {
        console.error("Error in fetchUserRole:", error);
        setRole("user");
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [user, isOwnerByEmail]);

  const isOwner = role === "owner";
  const isAdmin = role === "admin" || role === "owner";
  const hasElevatedAccess = role === "owner" || role === "admin";

  return {
    role,
    loading,
    isOwner,
    isAdmin,
    hasElevatedAccess,
    refresh: () => {
      if (user) {
        setLoading(true);
        // Re-trigger the effect
        setRole(null);
      }
    },
  };
}