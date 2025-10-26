# Vercel Environment Variables Setup

## ✅ Local Setup Complete

Your `.env.local` now includes:
- GEMINI_API_KEY
- CRON_SECRET

## Add to Vercel

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your **shipport** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variables

Add these two variables:

**Variable 1:**
- Key: `GEMINI_API_KEY`
- Value: `AIzaSyAUm4wcXczS7BNJ0gILAH9HrBzSS8N_umo`
- Environment: Production, Preview, Development ✓

**Variable 2:**
- Key: `CRON_SECRET`
- Value: `0yEcCKQ6wVUGebzuvXS7lm2Y1fnhBWRP`
- Environment: Production, Preview, Development ✓

### Step 3: Save

Click "Save" to apply the changes.

## Deploy

After adding the variables, redeploy:

```bash
git add .
git commit -m "Add automated blog generation"
git push
```

Or use Vercel dashboard → Deployments → Redeploy

## Test Locally (Optional)

Test the blog generation:

```bash
npm run dev
# In another terminal:
curl -X GET http://localhost:3000/api/cron/generate-blog -H "Authorization: Bearer 0yEcCKQ6wVUGebzuvXS7lm2Y1fnhBWRP"
```

## What Happens Next

Once deployed:
- ✅ Bot runs daily at 9:00 AM UTC
- ✅ Generates blog posts using Gemini AI
- ✅ Targets "Marine Superintendent" keywords
- ✅ Auto-publishes with SEO optimization
- ✅ Pings Google/Bing for indexing

## Monitor

Check logs in Vercel:
- Functions → `/api/cron/generate-blog`
- Look for success messages

