# Security Fixes Guide

This document explains the security issues identified by Supabase Security Advisor and how to fix them.

## Issues Identified

### Errors (4)
1. **RLS Disabled on `blog_categories`** - Row Level Security not enabled
2. **RLS Disabled on `blog_posts`** - Row Level Security not enabled  
3. **Security Definer View: `chat_messages_with_users`** - View created with elevated privileges
4. **Security Definer View: `recent_chat_messages`** - View created with elevated privileges

### Warnings (2)
1. **Function Search Path Mutable: `cleanup_old_chat_messages`** - Function doesn't set search_path
2. **Leaked Password Protection Disabled** - Auth setting needs to be enabled

## Fixes Applied

### 1. RLS on Blog Tables ✅

The migration `sql/09_fix_security_issues.sql` enables RLS on:
- `blog_categories`
- `blog_posts`
- `blog_seo_data`

**Policies Created:**
- **Public Access**: Anyone can view published blog posts and categories
- **Author Access**: Users can view/edit/delete their own draft posts
- **Admin Access**: Admins can manage all blog content

### 2. Security Definer Views ✅

The views `chat_messages_with_users` and `recent_chat_messages` have been recreated with:
- Explicit `security_invoker = true` option (PostgreSQL 15+ feature)
- This ensures views run with the permissions of the querying user, not the view creator
- Proper ownership set to postgres
- Respects RLS policies of underlying tables

### 3. Function Search Path ✅

The `cleanup_old_chat_messages` function (and related functions) have been updated to:
- Explicitly set `search_path = public, pg_temp`
- Prevent search_path injection attacks
- Maintain SECURITY DEFINER for proper execution context

## How to Apply Fixes

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `sql/09_fix_security_issues.sql`
4. Copy and paste the entire SQL into the SQL Editor
5. Click **Run** to execute the migration

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 3: Using MCP Tools

If you have Supabase MCP configured, you can apply the migration directly.

## Manual Steps Required

### Enable Leaked Password Protection

This setting **cannot** be applied via SQL migration. You must enable it in the Supabase Dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll down to find **"Leaked Password Protection"**
4. **Enable** the setting
5. Save changes

**Why this matters:**
- Prevents users from using passwords found in data breaches
- Enhances account security
- Protects against credential stuffing attacks

## Verification

After applying the fixes:

1. Go to **Security Advisor** in your Supabase dashboard
2. Click **"Rerun linter"** button
3. Verify that all errors are resolved
4. The warnings should also be resolved (except leaked password protection if not manually enabled)

## Expected Results

After applying all fixes:
- ✅ **0 Errors** (down from 4)
- ✅ **0-1 Warnings** (down from 2, depending on leaked password protection)

## Rollback (if needed)

If you need to rollback these changes, you can:

1. Drop the RLS policies:
```sql
DROP POLICY IF EXISTS "Public can view blog categories" ON blog_categories;
DROP POLICY IF EXISTS "Admins can manage blog categories" ON blog_categories;
-- ... (drop all policies)
ALTER TABLE blog_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE blog_seo_data DISABLE ROW LEVEL SECURITY;
```

2. Restore original views and functions from previous SQL files

## Security Impact

These fixes significantly improve your database security:

- **RLS on blog tables**: Prevents unauthorized access to draft/unpublished content
- **Fixed views**: Ensures views respect RLS policies
- **Function search_path**: Prevents SQL injection via search_path manipulation
- **Leaked password protection**: Reduces risk of compromised accounts

## Questions?

If you encounter any issues:
1. Check the Supabase logs for error messages
2. Verify your user roles are set up correctly
3. Ensure the `users` table has the correct structure
4. Check that RLS policies match your access requirements

