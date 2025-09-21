'use client'

import { useState, useEffect } from 'react'
import { useEmailVerification } from '@/hooks/useEmailVerification'
import { Button } from './Button'
import { Input } from './Input'

interface EmailVerificationProps {
  userEmail: string
  onVerificationComplete?: () => void
}

export const EmailVerification = ({ userEmail, onVerificationComplete }: EmailVerificationProps) => {
  const {
    isVerified,
    isVerifying,
    isSendingOTP,
    error,
    success,
    sendVerificationOTP,
    verifyOTP,
    checkVerificationStatus,
    clearMessages
  } = useEmailVerification()

  const [otpCode, setOtpCode] = useState('')
  const [showOTPInput, setShowOTPInput] = useState(false)

  useEffect(() => {
    checkVerificationStatus()
  }, [checkVerificationStatus])

  useEffect(() => {
    if (success && isVerified) {
      onVerificationComplete?.()
    }
  }, [success, isVerified, onVerificationComplete])

  const handleSendOTP = async () => {
    await sendVerificationOTP()
    setShowOTPInput(true)
  }

  const handleVerifyOTP = async () => {
    if (otpCode.length === 6) {
      await verifyOTP(otpCode, userEmail)
    }
  }

  const handleCancelOTP = () => {
    setShowOTPInput(false)
    setOtpCode('')
    clearMessages()
  }

  if (isVerified) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 shadow-sm">
          <span className="text-green-600">⭐</span>
          Verified
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200 shadow-sm">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Unverified
        </span>
        {!showOTPInput && (
          <Button
            onClick={handleSendOTP}
            disabled={isSendingOTP}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-sm text-xs px-3 py-1.5"
          >
            {isSendingOTP ? (
              <>
                <span className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full mr-1.5"></span>
                Sending...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>
        )}
      </div>

    {showOTPInput && (
      <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">📧</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Verification Email Sent! ✨
            </h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              We've sent a verification link to <span className="font-semibold bg-blue-100 px-2 py-1 rounded text-blue-900">{userEmail}</span>
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Please check your inbox and click the link to verify your account. The link expires in 1 hour.
            </p>
            <div className="mt-3 p-3 bg-blue-100/50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Don't see the email? Check your spam folder
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleSendOTP}
            disabled={isSendingOTP}
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-sm"
          >
            {isSendingOTP ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Sending...
              </>
            ) : (
              'Resend Email'
            )}
          </Button>
          <Button
            onClick={handleCancelOTP}
            size="sm"
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Skip for now
          </Button>
        </div>
      </div>
    )}

      {error && (
        <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">✅</span>
            </div>
            <p className="text-sm text-green-700 font-medium">{success}</p>
          </div>
        </div>
      )}
    </div>
  )
}
