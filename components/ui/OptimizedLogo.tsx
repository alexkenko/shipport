import Image from 'next/image'
import Link from 'next/link'

interface OptimizedLogoProps {
  href?: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
}

export function OptimizedLogo({ 
  href = '/', 
  className = '', 
  width = 32, 
  height = 32,
  priority = false 
}: OptimizedLogoProps) {
  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/logo-horizontal.png"
        alt="ShipinPort Logo"
        width={width * 2.5}
        height={height}
        priority={priority}
        className="rounded"
        sizes="(max-width: 768px) 125px, 187px"
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}

// Text-based logo for better performance when images aren't needed
export function TextLogo({ href = '/', className = '' }: { href?: string, className?: string }) {
  const logoElement = (
    <span className={`text-2xl font-bold ${className}`}>
      <span className="text-blue-400">Ship</span>
      <span className="text-red-500">in</span>
      <span className="text-blue-400">Port.com</span>
    </span>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
