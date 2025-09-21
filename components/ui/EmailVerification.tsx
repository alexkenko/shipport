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
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          ⭐ Verified
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
          ⚪ Unverified
        </span>
        {!showOTPInput && (
          <Button
            onClick={handleSendOTP}
            disabled={isSendingOTP}
            size="sm"
            variant="ghost"
            className="text-xs text-gray-400 hover:text-gray-300"
          >
            {isSendingOTP ? 'Sending...' : 'Verify (optional)'}
          </Button>
        )}
      </div>

      {showOTPInput && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-lg">📧</div>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Verification email sent!
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Please check your email <strong>{userEmail}</strong> and follow the instructions in the email to verify your account.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                Verification is optional and doesn't affect your account usage
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSendOTP}
              disabled={isSendingOTP}
              size="sm"
              variant="ghost"
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              {isSendingOTP ? 'Resending...' : 'Resend Email'}
            </Button>
            <Button
              onClick={handleCancelOTP}
              size="sm"
              variant="ghost"
              className="text-xs text-gray-500"
            >
              Skip
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
    </div>
  )
}
