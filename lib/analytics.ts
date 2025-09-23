import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals'

// Performance monitoring utility
export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }

  // Send to analytics service (you can add Google Analytics, etc.)
  // Example: gtag('event', metric.name, { ... })
}

// Initialize web vitals monitoring
export function initWebVitals() {
  if (typeof window !== 'undefined') {
    onCLS(reportWebVitals)
    onINP(reportWebVitals) // INP replaces FID in newer versions
    onFCP(reportWebVitals)
    onLCP(reportWebVitals)
    onTTFB(reportWebVitals)
  }
}
