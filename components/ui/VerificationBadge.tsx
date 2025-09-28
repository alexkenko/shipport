'use client'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface VerificationBadgeProps {
  isVerified: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function VerificationBadge({ isVerified, size = 'sm' }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  if (isVerified) {
    return (
      <div className={`inline-flex items-center gap-1 bg-green-100 text-green-800 rounded-full font-medium ${sizeClasses[size]}`}>
        <CheckCircleIcon className={`${iconSizes[size]} text-green-600`} />
        <span>Verified</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1 bg-gray-100 text-gray-600 rounded-full font-medium ${sizeClasses[size]}`}>
      <XCircleIcon className={`${iconSizes[size]} text-gray-500`} />
      <span>Unverified</span>
    </div>
  )
}
