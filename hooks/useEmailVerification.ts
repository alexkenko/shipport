import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface EmailVerificationState {
  isVerified: boolean
  isVerifying: boolean
  isSendingOTP: boolean
  error: string | null
  success: string | null
}

export const useEmailVerification = () => {
  const [state, setState] = useState<EmailVerificationState>({
    isVerified: false,
    isVerifying: false,
    isSendingOTP: false,
    error: null,
    success: null
  })

  const sendVerificationOTP = async () => {
    setState(prev => ({ ...prev, isSendingOTP: true, error: null, success: null }))
    
    try {
      // Get current user email
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        throw new Error('No user email found')
      }

      // Send OTP for email verification
      const { error } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) throw error

      setState(prev => ({ 
        ...prev, 
        isSendingOTP: false, 
        success: 'Verification email sent! Please check your inbox.' 
      }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isSendingOTP: false, 
        error: error.message || 'Failed to send verification email' 
      }))
    }
  }

  const verifyOTP = async (token: string, email: string) => {
    setState(prev => ({ ...prev, isVerifying: true, error: null, success: null }))
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        token,
        type: 'email',
        email
      })

      if (error) throw error

      setState(prev => ({ 
        ...prev, 
        isVerifying: false, 
        isVerified: true,
        success: 'Email verified successfully!' 
      }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isVerifying: false, 
        error: error.message || 'Invalid verification code' 
      }))
    }
  }

  const checkVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email_confirmed_at) {
        setState(prev => ({ ...prev, isVerified: true }))
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
    }
  }

  const clearMessages = () => {
    setState(prev => ({ ...prev, error: null, success: null }))
  }

  return {
    ...state,
    sendVerificationOTP,
    verifyOTP,
    checkVerificationStatus,
    clearMessages
  }
}
