'use client'

import Image from 'next/image'
import { XCircleIcon } from '@heroicons/react/24/outline'

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
    sm: 16,
    md: 20,
    lg: 24
  }

  if (isVerified) {
    return (
      <div className={`inline-flex items-center gap-1 bg-green-50 text-green-800 rounded-full font-medium ${sizeClasses[size]}`}>
        <Image
          src="/MyLogo/verified badge.jfif"
          alt="Verified badge"
          width={iconSizes[size]}
          height={iconSizes[size]}
        />
        <span>Verified</span>
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center gap-1 bg-gray-100 text-gray-600 rounded-full font-medium ${sizeClasses[size]}`}>
      <XCircleIcon className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-gray-500" />
      <span>Unverified</span>
    </div>
  )
}
