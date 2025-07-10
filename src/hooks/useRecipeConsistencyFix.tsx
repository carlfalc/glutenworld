import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useRecipeConsistencyFix = () => {
  const [isFixing, setIsFixing] = useState(false)
  const { toast } = useToast()

  const fixRecipeConsistency = async () => {
    setIsFixing(true)
    
    try {
      const { data, error } = await supabase.functions.invoke('fix-recipe-consistency')
      
      if (error) {
        throw error
      }

      toast({
        title: "Recipe Consistency Fixed",
        description: `Successfully fixed ${data.updatesApplied} recipes with consistency issues.`,
      })

      return data
    } catch (error) {
      console.error('Error fixing recipe consistency:', error)
      toast({
        title: "Error",
        description: "Failed to fix recipe consistency. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsFixing(false)
    }
  }

  return {
    fixRecipeConsistency,
    isFixing
  }
}