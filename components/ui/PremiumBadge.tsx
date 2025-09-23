import React from 'react'
import { isEligibleForPremiumBadge, getPremiumBadgeText } from '@/lib/premium'

interface PremiumBadgeProps {
  signupDate: string | Date
  role: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PremiumBadge({ signupDate, role, size = 'md', className = '' }: PremiumBadgeProps) {
  // Debug logging
  console.log('PremiumBadge Debug:', { signupDate, role, isEligible: isEligibleForPremiumBadge(signupDate, role) })
  
  // Only show badge for eligible superintendents
  if (!isEligibleForPremiumBadge(signupDate, role)) {
    return null
  }

  const badgeText = getPremiumBadgeText(signupDate)
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span 
      className={`
        inline-flex items-center font-medium rounded-full
        bg-gradient-to-r from-yellow-400 to-orange-500
        text-white shadow-lg
        ${sizeClasses[size]}
        ${className}
      `}
      title="Premium Marine Superintendent - Early Adopter"
    >
      <span className="mr-1">⭐</span>
      {badgeText}
    </span>
  )
}

export default PremiumBadge
