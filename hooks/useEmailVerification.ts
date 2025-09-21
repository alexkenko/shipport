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

      // Send OTP via email using our custom Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-otp-email', {
        body: {
          email: user.email,
          otpCode: otpCode,
          userName: user.user_metadata?.name || user.user_metadata?.full_name || 'User'
        }
      })

      if (emailError) {
        console.error('Email sending error:', emailError)
        throw new Error('Failed to send verification email. Please try again.')
      }

      setState(prev => ({ 
        ...prev, 
        isSendingOTP: false, 
        success: 'Verification code sent! Please check your email inbox.' 
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      // Check the OTP code against our stored value
      const { data: verification, error: fetchError } = await supabase
        .from('email_verifications')
        .select('otp_code, otp_expires_at')
        .eq('user_id', user.id)
        .eq('email', email)
        .single()

      if (fetchError) throw new Error('No verification code found. Please request a new one.')

      // Check if OTP has expired
      const now = new Date()
      const expiresAt = new Date(verification.otp_expires_at)
      if (now > expiresAt) {
        throw new Error('Verification code has expired. Please request a new one.')
      }

      // Check if OTP code matches
      if (verification.otp_code !== token) {
        throw new Error('Invalid verification code. Please try again.')
      }

      // Mark email as verified in our custom table
      const { error: verificationError } = await supabase
        .from('email_verifications')
        .upsert({
          user_id: user.id,
          email: email,
          is_verified: true,
          verified_at: new Date().toISOString(),
          otp_code: null, // Clear the OTP code after successful verification
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
        error: error.message || 'Invalid verification code' 
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
