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
        width={width * 2.30375}
        height={height}
        priority={priority}
        className="rounded"
        style={{ marginTop: '-2mm' }}
        sizes="(max-width: 768px) 250px, 375px"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
