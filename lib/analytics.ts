// Google Analytics 4 utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-N64DM3EHCR'

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined') return

  try {
    // Load gtag script with error handling
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`
    script.onerror = () => {
      console.warn('Failed to load Google Analytics script')
    }
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      try {
        window.dataLayer.push(arguments)
      } catch (error) {
        console.warn('Google Analytics error:', error)
      }
    }
    
    window.gtag('js', new Date())
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: false, // We'll handle this manually
    })
  } catch (error) {
    console.warn('Google Analytics initialization failed:', error)
  }
}

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  try {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title || document.title,
    })
  } catch (error) {
    console.warn('Google Analytics page view tracking failed:', error)
  }
}

// Track custom events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Blog-specific tracking events
export const trackBlogPostView = (postTitle: string, postSlug: string) => {
  trackEvent('blog_post_view', 'Blog', postTitle)
  
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'blog_post_view', {
      event_category: 'Blog',
      event_label: postTitle,
      custom_parameters: {
        post_slug: postSlug,
        post_title: postTitle,
      }
    })
  }
}

export const trackBlogSearch = (searchTerm: string) => {
  trackEvent('blog_search', 'Blog', searchTerm)
}

export const trackBlogCategoryFilter = (categoryName: string) => {
  trackEvent('blog_category_filter', 'Blog', categoryName)
}

// User engagement tracking
export const trackUserRegistration = (userType: 'manager' | 'superintendent') => {
  trackEvent('user_registration', 'User', userType)
}

export const trackJobApplication = (jobId: string, jobTitle: string) => {
  trackEvent('job_application', 'Jobs', jobTitle, 1)
}

export const trackJobPost = (jobTitle: string) => {
  trackEvent('job_post', 'Jobs', jobTitle, 1)
}

// Contact form tracking
export const trackContactForm = (formType: string) => {
  trackEvent('contact_form_submit', 'Contact', formType)
}

// Error tracking
export const trackError = (errorMessage: string, errorLocation: string) => {
  trackEvent('error', 'System', `${errorLocation}: ${errorMessage}`)
}