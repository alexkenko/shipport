'use client'

import { BlogPost } from '@/types'
import { CalendarIcon, ClockIcon, UserIcon, ShareIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { trackBlogPostView } from '@/lib/analytics'

interface BlogContentProps {
  post: BlogPost
}

export default function BlogContent({ post }: BlogContentProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sharePost = async () => {
    trackBlogPostView(post.title, post.slug) // Also track on share
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || '',
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <>
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {post.category && (
            <Link href={`/blog?category=${post.category.slug}`} className="block">
              <span
                className="px-3 py-1 text-sm font-medium rounded-full text-white"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
            </Link>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              {formatDate(post.published_at || post.created_at)}
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4" />
              {post.reading_time} min read
            </div>
            {post.author && (
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {post.author.name} {post.author.surname}
              </div>
            )}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-gray-300 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={sharePost}
            className="flex items-center gap-2"
          >
            <ShareIcon className="h-4 w-4" />
            Share
          </Button>
        </div>
      </header>

      {post.featured_image_url && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-lg prose-invert max-w-none prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      <div className="mt-12 p-6 bg-gradient-to-r from-blue-900/30 to-primary-900/30 rounded-lg border border-blue-800/30">
        <h3 className="text-xl font-semibold text-white mb-3">
          Looking for Marine Superintendent Opportunities?
        </h3>
        <p className="text-gray-300 mb-4">
          Connect with vessel managers and shipping companies on our <Link href="/" className="text-blue-400 hover:text-blue-300 underline">marine superintendent</Link> platform.
          Find your next assignment and grow your maritime career.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/marine-superintendent-jobs">
            <Button className="bg-primary-600 hover:bg-primary-700">
              Browse Jobs
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="outline">
              Create Profile
            </Button>
          </Link>
        </div>
      </div>

      {post.author && (
        <div className="mt-12 p-6 bg-gray-800/50 rounded-lg">
          <div className="flex items-start gap-4">
            {post.author.photo_url ? (
              <Image
                src={post.author.photo_url}
                alt={`${post.author.name} ${post.author.surname}`}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {post.author.name} {post.author.surname}
              </h3>
              <p className="text-gray-300">
                Marine industry expert with extensive experience in vessel management and maritime compliance.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

