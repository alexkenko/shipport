import { isEligibleForPremiumBadge, getPremiumBadgeText, shouldShowPremiumBadge } from '../premium'

describe('Premium Badge Logic', () => {
  const beforeDeadline = '2025-06-15T10:00:00Z'
  const afterDeadline = '2026-01-15T10:00:00Z'
  const recentSignup = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
  const oldSignup = '2024-01-15T10:00:00Z'

  describe('isEligibleForPremiumBadge', () => {
    it('should return true for superintendents who signed up before deadline', () => {
      expect(isEligibleForPremiumBadge(beforeDeadline, 'superintendent')).toBe(true)
    })

    it('should return false for superintendents who signed up after deadline', () => {
      expect(isEligibleForPremiumBadge(afterDeadline, 'superintendent')).toBe(false)
    })

    it('should return false for managers regardless of signup date', () => {
      expect(isEligibleForPremiumBadge(beforeDeadline, 'manager')).toBe(false)
      expect(isEligibleForPremiumBadge(afterDeadline, 'manager')).toBe(false)
    })
  })

  describe('getPremiumBadgeText', () => {
    it('should return "New Premium" for recent signups', () => {
      expect(getPremiumBadgeText(recentSignup)).toBe('New Premium')
    })

    it('should return "Premium" for older signups', () => {
      expect(getPremiumBadgeText(oldSignup)).toBe('Premium')
    })
  })

  describe('shouldShowPremiumBadge', () => {
    it('should return true for eligible superintendents', () => {
      expect(shouldShowPremiumBadge({ created_at: beforeDeadline, role: 'superintendent' })).toBe(true)
    })

    it('should return false for ineligible users', () => {
      expect(shouldShowPremiumBadge({ created_at: beforeDeadline, role: 'manager' })).toBe(false)
      expect(shouldShowPremiumBadge({ created_at: afterDeadline, role: 'superintendent' })).toBe(false)
    })
  })
})
