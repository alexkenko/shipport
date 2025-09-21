'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if we have a confirmation_url parameter (from custom email template)
        const confirmationUrl = searchParams.get('confirmation_url')
        
        if (confirmationUrl) {
          // Parse the confirmation URL to get the token hash
          try {
            const url = new URL(confirmationUrl)
            const tokenHash = url.searchParams.get('token_hash')
            const type = url.searchParams.get('type')
            
            console.log('Parsed URL:', { tokenHash, type, fullUrl: confirmationUrl })
            
            if (!tokenHash) {
              setStatus('error')
              setMessage('Invalid verification link. Please try again.')
              return
            }
            
            // Use token hash verification method
            await performVerificationWithHash(tokenHash)
          } catch (error) {
            console.error('Error parsing confirmation URL:', error)
            setStatus('error')
            setMessage('Invalid verification link format. Please try again.')
            return
          }
        } else {
          // Fallback to direct token parameters
          const token = searchParams.get('token')
          const type = searchParams.get('type')
          const email = searchParams.get('email')

          if (!token || type !== 'email' || !email) {
            setStatus('error')
            setMessage('Invalid verification link. Please try again.')
            return
          }
          
          await performVerification(token, email)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    const performVerificationWithHash = async (tokenHash: string) => {
      try {
        console.log('Attempting verification with token hash:', tokenHash)
        
        // Verify the magic link token hash with Supabase
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'magiclink'
        })
        
        console.log('Verification result:', { verifyError })

        if (verifyError) {
          console.error('Verification error:', verifyError)
          
          // Check if it's an expired link error
          if (verifyError.message.includes('expired') || verifyError.message.includes('invalid')) {
            setStatus('error')
            setMessage('This verification link has expired. Please request a new one from your profile page.')
          } else {
            setStatus('error')
            setMessage(`Verification failed: ${verifyError.message}`)
          }
          return
        }

        // Get current user after verification
        const { data: { user: verifiedUser } } = await supabase.auth.getUser()
        if (!verifiedUser) {
          setStatus('error')
          setMessage('User not found. Please try logging in again.')
          return
        }

        // Mark email as verified in our custom table
        const { error: verificationError } = await supabase
          .from('email_verifications')
          .upsert({
            user_id: verifiedUser.id,
            email: verifiedUser.email,
            is_verified: true,
            verified_at: new Date().toISOString(),
            otp_code: null,
            otp_expires_at: null
          }, {
            onConflict: 'user_id,email'
          })

        if (verificationError) {
          console.error('Database update error:', verificationError)
          setStatus('error')
          setMessage('Email verified but failed to update database. Please contact support.')
          return
        }

        setStatus('success')
        setMessage('Email verified successfully! Redirecting to dashboard...')

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)

      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred during verification.')
      }
    }

    const performVerification = async (token: string, email: string) => {
      try {
        // For magic link verification, we need to get the user's email first
        const { data: { user } } = await supabase.auth.getUser()
        const userEmail = user?.email || email
        
        // Verify the magic link token with Supabase
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token,
          type: 'magiclink',
          email: userEmail
        })

        if (verifyError) {
          console.error('Verification error:', verifyError)
          
          // Check if it's an expired link error
          if (verifyError.message.includes('expired') || verifyError.message.includes('invalid')) {
            setStatus('error')
            setMessage('This verification link has expired. Please request a new one from your profile page.')
          } else {
            setStatus('error')
            setMessage(`Verification failed: ${verifyError.message}`)
          }
          return
        }

        // Get current user after verification
        const { data: { user: verifiedUser } } = await supabase.auth.getUser()
        if (!verifiedUser) {
          setStatus('error')
          setMessage('User not found. Please try logging in again.')
          return
        }

        // Mark email as verified in our custom table
        const { error: verificationError } = await supabase
          .from('email_verifications')
          .upsert({
            user_id: verifiedUser.id,
            email: userEmail,
            is_verified: true,
            verified_at: new Date().toISOString(),
            otp_code: null,
            otp_expires_at: null
          }, {
            onConflict: 'user_id,email'
          })

        if (verificationError) {
          console.error('Database update error:', verificationError)
          setStatus('error')
          setMessage('Email verified but failed to update database. Please contact support.')
          return
        }

        setStatus('success')
        setMessage('Email verified successfully! Redirecting to dashboard...')

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)

      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred during verification.')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return '⏳'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'verifying':
        return 'text-blue-600'
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-marine-950 to-dark-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
          <div className="text-6xl mb-6">{getStatusIcon()}</div>
          
          <h1 className="text-2xl font-bold text-white mb-4">
            {status === 'verifying' && 'Verifying Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
          
          <p className={`text-lg ${getStatusColor()}`}>
            {message}
          </p>

          {status === 'error' && (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Back to Login
              </button>
              <p className="text-sm text-gray-400 text-center mt-4">
                Need a new verification email? Go to your profile page and click "Verify (optional)"
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-sm text-gray-300 mt-2">Redirecting...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
