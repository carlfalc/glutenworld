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
      
      // Add timeout and better error handling
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Function timeout after 2 minutes')), 120000)
      )
      
      const functionPromise = supabase.functions.invoke('fix-recipe-consistency', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const result = await Promise.race([functionPromise, timeoutPromise])
      const { data, error } = result as any
      
      console.log('Function response received:', { data, error, hasData: !!data, hasError: !!error })
      
      if (error) {
        console.error('Function returned error:', error)
        throw new Error(`Function error: ${error.message || JSON.stringify(error)}`)
      }

      if (!data) {
        console.error('Function returned no data')
        throw new Error('Function completed but returned no data')
      }

      console.log('Function completed successfully:', data)
      toast({
        title: "Recipe Consistency Fixed",
        description: data.message || `Successfully fixed ${data?.updatesApplied || 0} recipes with consistency issues.`,
      })

      return data
    } catch (error: any) {
      console.error('Error fixing recipe consistency:', error)
      
      let errorMessage = "Failed to fix recipe consistency. Please try again."
      if (error.message?.includes('timeout')) {
        errorMessage = "The operation is taking longer than expected. It may still be running in the background."
      } else if (error.message?.includes('Function error:')) {
        errorMessage = error.message.replace('Function error: ', '')
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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