# Quick Setup: Get Your Free Gemini API Key

## Step 1: Get API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

## Step 2: Add to .env.local

```bash
GEMINI_API_KEY=paste_your_key_here
CRON_SECRET=generate_random_secret_here
```

## Step 3: Generate Random Secret

```bash
# Linux/Mac:
openssl rand -hex 32

# Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

## Step 4: Add to Vercel

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add both `GEMINI_API_KEY` and `CRON_SECRET`

## Step 5: Deploy

The cron job will automatically run daily at 9 AM UTC.

