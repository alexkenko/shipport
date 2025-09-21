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

      // Generate a 6-digit OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store the OTP in our email_verifications table with expiration
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
      
      const { error: storeError } = await supabase
        .from('email_verifications')
        .upsert({
          user_id: user.id,
          email: user.email,
          otp_code: otpCode,
          otp_expires_at: expiresAt.toISOString(),
          is_verified: false
        }, {
          onConflict: 'user_id,email'
        })

      if (storeError) throw storeError

      // Send magic link via email using Zoho SMTP
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (emailError) {
        console.error('Email sending error:', emailError)
        throw new Error(`Failed to send verification email: ${emailError.message}`)
      }

      console.log('Magic link sent successfully via Zoho SMTP')

      setState(prev => ({ 
        ...prev, 
        isSendingOTP: false, 
        success: 'Verification email sent! Please check your inbox and follow the instructions.' 
      }))
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isSendingOTP: false, 
        error: error.message || 'Failed to send verification code' 
      }))
    }
  }

  const verifyOTP = async (token: string, email: string) => {
    setState(prev => ({ ...prev, isVerifying: true, error: null, success: null }))
    
    try {
      // For magic link verification, we'll verify the token directly with Supabase
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token,
        type: 'email',
        email
      })

      if (verifyError) throw verifyError

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // Mark email as verified in our custom table
      const { error: verificationError } = await supabase
        .from('email_verifications')
        .upsert({
          user_id: user.id,
          email: email,
          is_verified: true,
          verified_at: new Date().toISOString(),
          otp_code: null,
          otp_expires_at: null
        }, {
          onConflict: 'user_id,email'
        })

      if (verificationError) throw verificationError

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
        error: error.message || 'Invalid verification link' 
      }))
    }
  }

  const checkVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) return

      // Check our custom email verification table
      const { data: verification, error } = await supabase
        .from('email_verifications')
        .select('is_verified')
        .eq('user_id', user.id)
        .eq('email', user.email)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Error checking verification status:', error)
        return
      }

      setState(prev => ({ 
        ...prev, 
        isVerified: verification?.is_verified || false 
      }))
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
