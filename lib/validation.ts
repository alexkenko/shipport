// Input validation and sanitization utilities

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  sanitizedValue?: string
}

export class InputValidator {
  // Email validation
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = []
    
    if (!email || typeof email !== 'string') {
      errors.push('Email is required')
      return { isValid: false, errors }
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format')
    }

    // Length check
    if (email.length > 254) {
      errors.push('Email is too long')
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim()

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedEmail
    }
  }

  // Phone validation
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = []
    
    if (!phone || typeof phone !== 'string') {
      errors.push('Phone number is required')
      return { isValid: false, errors }
    }

    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '')
    
    // Check length (7-15 digits is reasonable for international numbers)
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      errors.push('Phone number must be between 7 and 15 digits')
    }

    // Sanitize phone (keep original format but trim)
    const sanitizedPhone = phone.trim()

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedPhone
    }
  }

  // Name validation
  static validateName(name: string, fieldName: string = 'Name'): ValidationResult {
    const errors: string[] = []
    
    if (!name || typeof name !== 'string') {
      errors.push(`${fieldName} is required`)
      return { isValid: false, errors }
    }

    const trimmedName = name.trim()

    // Length check
    if (trimmedName.length < 2) {
      errors.push(`${fieldName} must be at least 2 characters`)
    }
    if (trimmedName.length > 50) {
      errors.push(`${fieldName} must be less than 50 characters`)
    }

    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-']+$/
    if (!nameRegex.test(trimmedName)) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: trimmedName
    }
  }

  // Company validation
  static validateCompany(company: string): ValidationResult {
    const errors: string[] = []
    
    if (!company || typeof company !== 'string') {
      errors.push('Company name is required')
      return { isValid: false, errors }
    }

    const trimmedCompany = company.trim()

    // Length check
    if (trimmedCompany.length < 2) {
      errors.push('Company name must be at least 2 characters')
    }
    if (trimmedCompany.length > 100) {
      errors.push('Company name must be less than 100 characters')
    }

    // More permissive regex for company names (allows numbers, dots, etc.)
    const companyRegex = /^[a-zA-Z0-9\s\-'.,&()]+$/
    if (!companyRegex.test(trimmedCompany)) {
      errors.push('Company name contains invalid characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: trimmedCompany
    }
  }

  // Bio validation
  static validateBio(bio: string): ValidationResult {
    const errors: string[] = []
    
    if (!bio || typeof bio !== 'string') {
      errors.push('Bio is required')
      return { isValid: false, errors }
    }

    const trimmedBio = bio.trim()

    // Length check
    if (trimmedBio.length < 10) {
      errors.push('Bio must be at least 10 characters')
    }
    if (trimmedBio.length > 1000) {
      errors.push('Bio must be less than 1000 characters')
    }

    // Basic XSS prevention - remove script tags
    const sanitizedBio = trimmedBio.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedBio
    }
  }

  // Port name validation
  static validatePortName(port: string): ValidationResult {
    const errors: string[] = []
    
    if (!port || typeof port !== 'string') {
      errors.push('Port name is required')
      return { isValid: false, errors }
    }

    const trimmedPort = port.trim()

    // Length check
    if (trimmedPort.length < 2) {
      errors.push('Port name must be at least 2 characters')
    }
    if (trimmedPort.length > 100) {
      errors.push('Port name must be less than 100 characters')
    }

    // Allow letters, numbers, spaces, hyphens, commas, and parentheses
    const portRegex = /^[a-zA-Z0-9\s\-(),]+$/
    if (!portRegex.test(trimmedPort)) {
      errors.push('Port name contains invalid characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: trimmedPort
    }
  }

  // Price validation
  static validatePrice(price: string | number, fieldName: string = 'Price'): ValidationResult {
    const errors: string[] = []
    
    if (price === null || price === undefined || price === '') {
      return { isValid: true, errors: [], sanitizedValue: null }
    }

    const numPrice = typeof price === 'string' ? parseFloat(price) : price

    if (isNaN(numPrice)) {
      errors.push(`${fieldName} must be a valid number`)
      return { isValid: false, errors }
    }

    if (numPrice < 0) {
      errors.push(`${fieldName} cannot be negative`)
    }

    if (numPrice > 10000) {
      errors.push(`${fieldName} cannot exceed $10,000`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: numPrice
    }
  }

  // Job title validation
  static validateJobTitle(title: string): ValidationResult {
    const errors: string[] = []
    
    if (!title || typeof title !== 'string') {
      errors.push('Job title is required')
      return { isValid: false, errors }
    }

    const trimmedTitle = title.trim()

    // Length check
    if (trimmedTitle.length < 5) {
      errors.push('Job title must be at least 5 characters')
    }
    if (trimmedTitle.length > 100) {
      errors.push('Job title must be less than 100 characters')
    }

    // Allow letters, numbers, spaces, hyphens, parentheses, and common punctuation
    const titleRegex = /^[a-zA-Z0-9\s\-()&.,:]+$/
    if (!titleRegex.test(trimmedTitle)) {
      errors.push('Job title contains invalid characters')
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: trimmedTitle
    }
  }

  // Job description validation
  static validateJobDescription(description: string): ValidationResult {
    const errors: string[] = []
    
    if (!description || typeof description !== 'string') {
      errors.push('Job description is required')
      return { isValid: false, errors }
    }

    const trimmedDescription = description.trim()

    // Length check
    if (trimmedDescription.length < 20) {
      errors.push('Job description must be at least 20 characters')
    }
    if (trimmedDescription.length > 2000) {
      errors.push('Job description must be less than 2000 characters')
    }

    // Basic XSS prevention - remove script tags
    const sanitizedDescription = trimmedDescription.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedDescription
    }
  }

  // Sanitize HTML content
  static sanitizeHtml(html: string): string {
    if (!html || typeof html !== 'string') {
      return ''
    }

    // Remove script tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    
    // Remove dangerous attributes
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    
    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '')
    
    return sanitized.trim()
  }

  // Validate array of strings (for vessel types, services, etc.)
  static validateStringArray(array: string[], fieldName: string = 'Array', maxLength: number = 20): ValidationResult {
    const errors: string[] = []
    
    if (!Array.isArray(array)) {
      errors.push(`${fieldName} must be an array`)
      return { isValid: false, errors }
    }

    if (array.length > maxLength) {
      errors.push(`${fieldName} cannot have more than ${maxLength} items`)
    }

    const sanitizedArray: string[] = []
    
    for (const item of array) {
      if (typeof item !== 'string') {
        errors.push(`${fieldName} items must be strings`)
        continue
      }

      const trimmedItem = item.trim()
      if (trimmedItem.length === 0) {
        continue // Skip empty items
      }

      if (trimmedItem.length > 100) {
        errors.push(`${fieldName} items must be less than 100 characters`)
        continue
      }

      sanitizedArray.push(trimmedItem)
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedArray
    }
  }
}

// Rate limiting utility
export class RateLimiter {
  private static limits = new Map<string, { count: number; resetTime: number }>()

  static checkLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const limit = this.limits.get(key)

    if (!limit || now > limit.resetTime) {
      // First request or window expired
      this.limits.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (limit.count >= maxRequests) {
      return false // Rate limit exceeded
    }

    limit.count++
    return true
  }

  static getRemainingRequests(key: string, maxRequests: number, windowMs: number): number {
    const limit = this.limits.get(key)
    if (!limit || Date.now() > limit.resetTime) {
      return maxRequests
    }
    return Math.max(0, maxRequests - limit.count)
  }

  static getResetTime(key: string): number | null {
    const limit = this.limits.get(key)
    return limit ? limit.resetTime : null
  }
}
