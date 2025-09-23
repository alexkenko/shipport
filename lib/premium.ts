/**
 * Premium Badge utility functions
 * Handles premium status for Marine Superintendents who signed up before December 31, 2025
 */

export const PREMIUM_DEADLINE = new Date('2025-12-31T23:59:59Z')

/**
 * Check if a user is eligible for premium badge
 * @param signupDate - The user's signup date (created_at from users table)
 * @param role - The user's role
 * @returns boolean indicating if user is eligible for premium badge
 */
export function isEligibleForPremiumBadge(signupDate: string | Date, role: string): boolean {
  // Only superintendents are eligible for premium badge
  if (role !== 'superintendent') {
    return false
  }

  const userSignupDate = new Date(signupDate)
  const deadline = PREMIUM_DEADLINE

  // User is eligible if they signed up before the deadline
  return userSignupDate <= deadline
}

/**
 * Get premium badge text based on signup date
 * @param signupDate - The user's signup date
 * @returns string with premium badge text
 */
export function getPremiumBadgeText(signupDate: string | Date): string {
  const userSignupDate = new Date(signupDate)
  const now = new Date()
  
  // If user signed up recently (within last 30 days), show "New Premium"
  const daysSinceSignup = Math.floor((now.getTime() - userSignupDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceSignup <= 30) {
    return 'New Premium'
  }
  
  return 'Premium'
}

/**
 * Check if premium badge should be displayed
 * @param user - User object with created_at and role
 * @returns boolean indicating if premium badge should be shown
 */
export function shouldShowPremiumBadge(user: { created_at: string; role: string }): boolean {
  return isEligibleForPremiumBadge(user.created_at, user.role)
}
