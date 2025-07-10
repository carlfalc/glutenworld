import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export const useRecipeConsistencyFix = () => {
  const [isFixing, setIsFixing] = useState(false)
  const { toast } = useToast()

  const fixRecipeConsistency = async () => {
    console.log('=== Fix recipe consistency button clicked! ===')
    
    try {
      console.log('Setting isFixing to true...')
      setIsFixing(true)
      console.log('isFixing set to true successfully')
      
      console.log('About to invoke fix-recipe-consistency function...')
      
      // Test if the function exists first
      const { data, error } = await supabase.functions.invoke('fix-recipe-consistency', {
        body: JSON.stringify({ test: true }),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Function invocation completed')
      
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