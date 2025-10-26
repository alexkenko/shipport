# Automated Blog Generation Setup

This document explains how to set up the automated blog generation system that creates daily blog posts about marine superintendent topics using Google Gemini AI.

## Overview

The system automatically:
- Fetches maritime regulation news from RSS feeds
- Uses Google Gemini AI to generate SEO-optimized blog posts
- Publishes posts with "Marine Superintendent" keywords for better Google ranking
- Automatically pings Google/Bing for indexing
- Runs daily at 9:00 AM UTC

## Setup Instructions

### 1. Get a Free Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Google Gemini API Key (free tier available)
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Secret for protecting cron endpoint
CRON_SECRET=generate-a-random-secret-string-here
```

**Generate a secure CRON_SECRET:**
```bash
# On Linux/Mac:
openssl rand -hex 32

# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### 3. Add Environment Variables to Vercel

If you're deploying to Vercel:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add:
   - `GEMINI_API_KEY`: Your Gemini API key
   - `CRON_SECRET`: Your random secret

### 4. Verify Database Tables

The system uses these database tables:
- `blog_posts` (already exists)
- `blog_categories` (already exists)
- `users` (for author assignment)

Ensure you have a blog category with slug `regulations-compliance`. If not:

```sql
INSERT INTO blog_categories (name, slug, description, color) 
VALUES ('Regulations & Compliance', 'regulations-compliance', 'Maritime regulations and compliance topics', '#EF4444');
```

## How It Works

### Daily Execution Flow

1. **9:00 AM UTC**: Vercel cron triggers `/api/cron/generate-blog`
2. **Fetch News**: Retrieves latest maritime news from your existing news API
3. **AI Generation**: Uses Gemini AI to create a 1500-word blog post optimized for "Marine Superintendent" keywords
4. **Publish**: Inserts the post into database with status 'published'
5. **Index**: Pings Google/Bing sitemaps for fast indexing

### Blog Post Content

The AI generates posts with:
- SEO-optimized titles including "Marine Superintendent"
- 1500-word comprehensive content
- Sections: Executive Summary, Key Implications, Responsibilities, Compliance, Best Practices
- Internal links to your existing pages
- Proper meta tags and reading time
- Category: "Regulations & Compliance"

### SEO Benefits

- Natural keyword integration for "marine superintendent"
- Internal linking to boost overall site authority
- Fresh content signals (daily updates)
- Automatic sitemap updates for faster Google indexing

## Testing Locally

Test the blog generation before deploying:

```bash
# Set environment variables in .env.local
GEMINI_API_KEY=your_key
CRON_SECRET=your_secret

# Run the endpoint manually
curl -X GET http://localhost:3000/api/cron/generate-blog \
  -H "Authorization: Bearer your_secret"
```

## Monitoring

### Vercel Logs
Monitor execution in Vercel dashboard:
1. Go to your project → Functions
2. View logs for `/api/cron/generate-blog`
3. Check for success messages: "💾 Saved to database"

### Success Indicators
- Posts appear in `/blog` page
- Posts indexed in sitemap at `/sitemap.xml`
- Google Search Console shows indexed pages

## Troubleshooting

### No posts are being generated
- Check Vercel logs for errors
- Verify `GEMINI_API_KEY` is set correctly
- Ensure `CRON_SECRET` matches in both .env and Vercel

### Gemini API errors
- Free tier has rate limits (60 requests/minute)
- Verify API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Check quota usage

### Posts not appearing
- Check if slug already exists (system skips duplicates)
- Verify database permissions
- Check blog category exists

## Cost
**Free tier includes:**
- 60 requests per minute
- 1,500 requests per day
- 2 million tokens per minute

This is sufficient for daily blog generation.

## Customization

### Change Schedule
Edit `vercel.json`:
```json
{
  "path": "/api/cron/generate-blog",
  "schedule": "0 9 * * *"  // Change time here
}
```

### Modify Prompt
Edit `app/api/cron/generate-blog/route.ts` → `generateBlogPostWithGemini()` function

### Add More Keywords
Edit the `targetKeywords` array in the same file.

## Support

For issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test Gemini API key manually at Google AI Studio

