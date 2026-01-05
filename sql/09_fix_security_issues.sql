-- Fix Security Issues Identified by Supabase Security Advisor
-- This migration addresses:
-- 1. RLS Disabled on blog_categories and blog_posts
-- 2. Security Definer Views (chat_messages_with_users, recent_chat_messages)
-- 3. Function Search Path Mutable (cleanup_old_chat_messages)

-- ============================================
-- 1. ENABLE RLS ON BLOG TABLES
-- ============================================

-- Enable Row Level Security on blog tables
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog Categories Policies
-- Public read access for published categories
CREATE POLICY "Public can view blog categories" ON blog_categories
  FOR SELECT
  USING (true);

-- Only authenticated users with admin role can insert/update/delete categories
CREATE POLICY "Admins can manage blog categories" ON blog_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'superadmin' OR users.role = 'admin')
    )
  );

-- Blog Posts Policies
-- Public can view published posts only
CREATE POLICY "Public can view published blog posts" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Authenticated users can view their own draft posts
CREATE POLICY "Users can view their own draft posts" ON blog_posts
  FOR SELECT
  USING (
    author_id = auth.uid() 
    AND status IN ('draft', 'archived')
  );

-- Authors can insert their own posts
CREATE POLICY "Users can create blog posts" ON blog_posts
  FOR INSERT
  WITH CHECK (
    author_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid()
    )
  );

-- Authors can update their own posts, admins can update any
CREATE POLICY "Authors and admins can update blog posts" ON blog_posts
  FOR UPDATE
  USING (
    author_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'superadmin' OR users.role = 'admin')
    )
  );

-- Authors can delete their own posts, admins can delete any
CREATE POLICY "Authors and admins can delete blog posts" ON blog_posts
  FOR DELETE
  USING (
    author_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND (users.role = 'superadmin' OR users.role = 'admin')
    )
  );

-- Note: blog_seo_data table doesn't exist in the current database
-- If you create it later, enable RLS and add similar policies

-- ============================================
-- 2. FIX SECURITY DEFINER VIEWS
-- ============================================

-- Drop and recreate views with SECURITY INVOKER (default, but explicit)
-- This ensures views run with the permissions of the user calling them, not the view creator

-- Fix chat_messages_with_users view
-- PostgreSQL 15+ supports security_invoker option for views
-- This ensures views run with the permissions of the querying user, not the view creator
DROP VIEW IF EXISTS chat_messages_with_users CASCADE;
CREATE VIEW chat_messages_with_users 
WITH (security_invoker = true) AS
SELECT 
  m.*,
  u.name,
  u.surname,
  u.photo_url,
  u.email,
  reply_msg.message as reply_message,
  reply_user.name as reply_user_name,
  reply_user.surname as reply_user_surname
FROM superintendent_chat_messages m
LEFT JOIN users u ON m.user_id = u.id
LEFT JOIN superintendent_chat_messages reply_msg ON m.reply_to_message_id = reply_msg.id
LEFT JOIN users reply_user ON reply_msg.user_id = reply_user.id
WHERE m.is_deleted = FALSE
  AND m.created_at > now() - interval '24 hours'
ORDER BY m.created_at DESC;

-- Fix recent_chat_messages view
DROP VIEW IF EXISTS recent_chat_messages CASCADE;
CREATE VIEW recent_chat_messages 
WITH (security_invoker = true) AS
SELECT 
  m.*,
  u.name,
  u.surname,
  u.photo_url,
  u.email,
  reply_msg.message as reply_message,
  reply_user.name as reply_user_name,
  reply_user.surname as reply_user_surname
FROM superintendent_chat_messages m
LEFT JOIN users u ON m.user_id = u.id
LEFT JOIN superintendent_chat_messages reply_msg ON m.reply_to_message_id = reply_msg.id
LEFT JOIN users reply_user ON reply_msg.user_id = reply_user.id
WHERE m.is_deleted = FALSE
  AND m.created_at > now() - interval '24 hours'
ORDER BY m.created_at DESC;

-- Set view ownership to postgres (default) to ensure proper security context
-- Views will respect RLS policies of underlying tables
ALTER VIEW chat_messages_with_users OWNER TO postgres;
ALTER VIEW recent_chat_messages OWNER TO postgres;

-- Grant permissions on views
GRANT SELECT ON chat_messages_with_users TO authenticated;
GRANT SELECT ON recent_chat_messages TO authenticated;

-- ============================================
-- 3. FIX FUNCTION SEARCH PATH
-- ============================================

-- Recreate cleanup_old_chat_messages function with explicit search_path
-- This prevents search_path injection attacks
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Delete messages older than 24 hours
  DELETE FROM superintendent_chat_messages 
  WHERE created_at < now() - interval '24 hours';
  
  -- Also clean up related reactions for deleted messages
  DELETE FROM superintendent_chat_reactions 
  WHERE message_id NOT IN (SELECT id FROM superintendent_chat_messages);
  
  -- Clean up read status for deleted messages
  UPDATE superintendent_chat_read_status 
  SET last_read_message_id = NULL 
  WHERE last_read_message_id NOT IN (SELECT id FROM superintendent_chat_messages);
END;
$$;

-- Also fix other functions that might have the same issue
CREATE OR REPLACE FUNCTION cleanup_offline_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  DELETE FROM superintendent_chat_online 
  WHERE last_seen_at < now() - interval '5 minutes';
END;
$$;

CREATE OR REPLACE FUNCTION get_chat_message_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM superintendent_chat_messages);
END;
$$;

CREATE OR REPLACE FUNCTION get_old_messages_count(hours_old integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM superintendent_chat_messages 
    WHERE created_at < now() - (hours_old || ' hours')::interval
  );
END;
$$;

-- Re-grant execute permissions
GRANT EXECUTE ON FUNCTION cleanup_old_chat_messages() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION cleanup_offline_users() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_chat_message_count() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_old_messages_count(integer) TO authenticated, service_role;

-- ============================================
-- NOTES
-- ============================================
-- 
-- LEAKED PASSWORD PROTECTION:
-- This setting must be enabled in the Supabase Dashboard:
-- 1. Go to Authentication > Settings
-- 2. Find "Leaked Password Protection"
-- 3. Enable it
-- 
-- This cannot be done via SQL migration as it's a Supabase Auth setting.
-- Please enable it manually in the dashboard.

