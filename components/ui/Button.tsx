import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={clsx(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group',
          {
            // Primary - Enhanced with gradient and glow
            'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg hover:shadow-primary-500/25 focus:ring-primary-500 transform hover:scale-105 active:scale-95': variant === 'primary',
            
            // Secondary - Marine theme with gradient
            'bg-gradient-to-r from-marine-600 to-marine-700 hover:from-marine-500 hover:to-marine-600 text-white shadow-lg hover:shadow-marine-500/25 focus:ring-marine-500 transform hover:scale-105 active:scale-95': variant === 'secondary',
            
            // Outline - Glassmorphism style
            'border-2 border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-primary-600/10 backdrop-blur-sm hover:border-primary-400/50 hover:from-primary-500/20 hover:to-primary-600/20 text-primary-300 hover:text-primary-200 focus:ring-primary-500 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-primary-500/20': variant === 'outline',
            
            // Ghost - Subtle hover effects
            'hover:bg-gradient-to-r hover:from-dark-700/50 hover:to-dark-600/50 text-white hover:text-gray-100 focus:ring-primary-500 transform hover:scale-105 active:scale-95 backdrop-blur-sm': variant === 'ghost',
            
            // Gradient - Beautiful gradient with animation
            'bg-gradient-to-r from-primary-500 via-marine-500 to-primary-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-lg hover:shadow-primary-500/40 focus:ring-primary-500 transform hover:scale-105 active:scale-95 border border-primary-400/30 hover:border-primary-300/50': variant === 'gradient',
            
            // Glass - Glassmorphism effect
            'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 text-white shadow-lg hover:shadow-white/10 focus:ring-white/50 transform hover:scale-105 active:scale-95': variant === 'glass',
          },
          {
            'px-4 py-2.5 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {/* Shimmer effect for gradient buttons */}
        {(variant === 'gradient' || variant === 'primary' || variant === 'secondary') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center">
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading...
            </>
          ) : (
            children
          )}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
