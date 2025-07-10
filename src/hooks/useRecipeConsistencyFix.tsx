import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useRecipeConsistencyFix = () => {
  const [isFixing, setIsFixing] = useState(false)
  const { toast } = useToast()

  const fixRecipeConsistency = async () => {
    console.log('=== AI Recipe consistency fix starting! ===')
    
    try {
      console.log('Setting isFixing to true...')
      setIsFixing(true)
      
      console.log('Invoking ai-recipe-fix function with AI...')
      
      const { data, error } = await supabase.functions.invoke('ai-recipe-fix', {
        body: JSON.stringify({}),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('AI function completed:', { data, error })
      
      console.log('Raw function response:', { data, error, status: 'received' })
      
      if (error) {
        console.error('Function returned error:', error)
        throw new Error(`Function error: ${JSON.stringify(error)}`)
      }

      console.log('Function completed successfully:', data)
      toast({
        title: "Recipe Consistency Fixed",
        description: data?.message || `Successfully processed recipes.`,
      })

      return data
    } catch (error: any) {
      console.error('Error fixing recipe consistency:', error)
      
      toast({
        title: "Error",
        description: `Failed to fix recipe consistency: ${error.message}`,
        variant: "destructive",
      })
      throw error
    } finally {
      console.log('Resetting isFixing state...')
      setIsFixing(false)
    }
  }

  return {
    fixRecipeConsistency,
    isFixing
  }
}