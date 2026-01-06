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
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm',
    lg: 'px-2.5 py-1.5 text-base'
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  return (
    <span 
      className={`
        inline-flex items-center font-medium rounded-full
        bg-slate-900/80 text-white shadow-lg border border-yellow-400/60
        ${sizeClasses[size]}
        ${className}
      `}
      title="Premium Marine Superintendent - Early Adopter"
    >
      <Image
        src="/premium-badge.jpg"
        alt="Premium badge"
        width={iconSizes[size]}
        height={iconSizes[size]}
        className="rounded-full mr-1"
      />
      <span className="whitespace-nowrap">{badgeText}</span>
    </span>
  )
}

export default PremiumBadge
