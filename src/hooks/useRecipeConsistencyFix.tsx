import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useRecipeConsistencyFix = () => {
  const [isFixing, setIsFixing] = useState(false)
  const { toast } = useToast()

  const fixRecipeConsistency = async () => {
    console.log('Fix recipe consistency button clicked!')
    setIsFixing(true)
    
    try {
      console.log('Invoking fix-recipe-consistency function...')
      const { data, error } = await supabase.functions.invoke('fix-recipe-consistency')
      
      console.log('Function response:', { data, error })
      
      if (error) {
        console.error('Function returned error:', error)
        throw error
      }

      console.log('Function completed successfully:', data)
      toast({
        title: "Recipe Consistency Fixed",
        description: `Successfully fixed ${data?.updatesApplied || 0} recipes with consistency issues.`,
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