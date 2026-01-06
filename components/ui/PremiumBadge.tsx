import React from 'react'
import Image from 'next/image'
import { isEligibleForPremiumBadge, getPremiumBadgeText } from '@/lib/premium'

interface PremiumBadgeProps {
  signupDate: string | Date
  role: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PremiumBadge({ signupDate, role, size = 'md', className = '' }: PremiumBadgeProps) {
  // Only show badge for eligible superintendents
  if (!isEligibleForPremiumBadge(signupDate, role)) {
    return null
  }

  const badgeText = getPremiumBadgeText(signupDate)
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1.5',
    md: 'px-2.5 py-2',
    lg: 'px-3 py-2.5'
  }

  const iconSizes = {
    sm: 64,
    md: 80,
    lg: 96,
  }

  return (
    <span className={className} title={badgeText || 'Premium Marine Superintendent - Early Adopter'}>
      <Image
        src="/premium-badge.jpg"
        alt="Premium badge"
        width={iconSizes[size]}
        height={iconSizes[size]}
        className="inline-block"
      />
    </span>
  )
}

export default PremiumBadge
