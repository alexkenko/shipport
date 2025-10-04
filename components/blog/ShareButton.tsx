'use client'

import { Button } from '@/components/ui/Button'
import { ShareIcon } from '@heroicons/react/24/outline'

interface ShareButtonProps {
  title: string
  excerpt?: string | null
  url: string
}

export function ShareButton({ title, excerpt, url }: ShareButtonProps) {
  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || '',
          url,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url)
      // You could add a toast notification here
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={sharePost}
      className="flex items-center gap-2"
    >
      <ShareIcon className="h-4 w-4" />
      Share
    </Button>
  )
}