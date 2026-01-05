-- Performance Optimization Migration
-- Fixes RLS performance issues, adds missing indexes, and removes duplicates
-- This addresses 73 performance issues identified by Supabase Performance Advisor

-- ============================================
-- 1. FIX RLS POLICIES - Use (select auth.uid()) for better performance
-- ============================================
-- Wrapping auth.uid() in SELECT causes it to be evaluated once per query instead of per row
-- This can improve performance by 99%+ for large tables

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Managers can view all superintendents" ON users;
CREATE POLICY "Managers can view all superintendents" ON users
  FOR SELECT
  USING (
    (role = 'superintendent')
    OR ((select auth.uid()) = id)
  );

DROP POLICY IF EXISTS "Superintendents can view manager profiles" ON users;
CREATE POLICY "Superintendents can view manager profiles" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM (
        job_applications
        JOIN jobs ON job_applications.job_id = jobs.id
      )
      WHERE job_applications.superintendent_id = (select auth.uid())
        AND jobs.manager_id = users.id
        AND users.role = 'manager'
    )
  );

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

-- Manager profiles policies
DROP POLICY IF EXISTS "Managers can view their own profile" ON manager_profiles;
CREATE POLICY "Managers can view their own profile" ON manager_profiles
  FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Managers can update their own profile" ON manager_profiles;
CREATE POLICY "Managers can update their own profile" ON manager_profiles
  FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Managers can insert their own profile" ON manager_profiles;
CREATE POLICY "Managers can insert their own profile" ON manager_profiles
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- Superintendent profiles policies
DROP POLICY IF EXISTS "Superintendents can view their own profile" ON superintendent_profiles;
CREATE POLICY "Superintendents can view their own profile" ON superintendent_profiles
  FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Superintendents can update their own profile" ON superintendent_profiles;
CREATE POLICY "Superintendents can update their own profile" ON superintendent_profiles
  FOR UPDATE
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Superintendents can insert their own profile" ON superintendent_profiles;
CREATE POLICY "Superintendents can insert their own profile" ON superintendent_profiles
  FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

-- Jobs policies
DROP POLICY IF EXISTS "Managers can view their own jobs" ON jobs;
CREATE POLICY "Managers can view their own jobs" ON jobs
  FOR SELECT
  USING (manager_id = (select auth.uid()));

DROP POLICY IF EXISTS "Managers can insert their own jobs" ON jobs;
CREATE POLICY "Managers can insert their own jobs" ON jobs
  FOR INSERT
  WITH CHECK (manager_id = (select auth.uid()));

DROP POLICY IF EXISTS "Managers can update their own jobs" ON jobs;
CREATE POLICY "Managers can update their own jobs" ON jobs
  FOR UPDATE
  USING (manager_id = (select auth.uid()))
  WITH CHECK (manager_id = (select auth.uid()));

-- Job applications policies
DROP POLICY IF EXISTS "Superintendents can view their own applications" ON job_applications;
CREATE POLICY "Superintendents can view their own applications" ON job_applications
  FOR SELECT
  USING (superintendent_id = (select auth.uid()));

DROP POLICY IF EXISTS "Superintendents can insert their own applications" ON job_applications;
CREATE POLICY "Superintendents can insert their own applications" ON job_applications
  FOR INSERT
  WITH CHECK (superintendent_id = (select auth.uid()));

DROP POLICY IF EXISTS "Superintendents can update their own applications" ON job_applications;
CREATE POLICY "Superintendents can update their own applications" ON job_applications
  FOR UPDATE
  USING (superintendent_id = (select auth.uid()))
  WITH CHECK (superintendent_id = (select auth.uid()));

DROP POLICY IF EXISTS "Superintendents can delete their own applications" ON job_applications;
CREATE POLICY "Superintendents can delete their own applications" ON job_applications
  FOR DELETE
  USING (superintendent_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can view applications for their jobs" ON job_applications;
CREATE POLICY "Users can view applications for their jobs" ON job_applications
  FOR SELECT
  USING (
    (select auth.uid()) IN (
      SELECT jobs.manager_id
      FROM jobs
      WHERE jobs.id = job_applications.job_id
    )
  );

DROP POLICY IF EXISTS "Managers can update applications for their jobs" ON job_applications;
CREATE POLICY "Managers can update applications for their jobs" ON job_applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = job_applications.job_id
        AND jobs.manager_id = (select auth.uid())
    )
  );

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Email verifications policies
DROP POLICY IF EXISTS "Users can read their own email verification records" ON email_verifications;
CREATE POLICY "Users can read their own email verification records" ON email_verifications
  FOR SELECT
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own email verification records" ON email_verifications;
CREATE POLICY "Users can insert their own email verification records" ON email_verifications
  FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update their own email verification records" ON email_verifications;
CREATE POLICY "Users can update their own email verification records" ON email_verifications
  FOR UPDATE
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can delete their own email verification records" ON email_verifications;
CREATE POLICY "Users can delete their own email verification records" ON email_verifications
  FOR DELETE
  USING (user_id = (select auth.uid()));

-- Chat messages policies
DROP POLICY IF EXISTS "Only superintendents can view chat messages" ON superintendent_chat_messages;
CREATE POLICY "Only superintendents can view chat messages" ON superintendent_chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND users.role = 'superintendent'
    )
  );

DROP POLICY IF EXISTS "Only superintendents can insert chat messages" ON superintendent_chat_messages;
CREATE POLICY "Only superintendents can insert chat messages" ON superintendent_chat_messages
  FOR INSERT
  WITH CHECK (
    user_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND users.role = 'superintendent'
    )
  );

DROP POLICY IF EXISTS "Users can update their own messages" ON superintendent_chat_messages;
CREATE POLICY "Users can update their own messages" ON superintendent_chat_messages
  FOR UPDATE
  USING (
    user_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND users.role = 'superintendent'
    )
  );

DROP POLICY IF EXISTS "Users can delete their own messages" ON superintendent_chat_messages;
CREATE POLICY "Users can delete their own messages" ON superintendent_chat_messages
  FOR DELETE
  USING (
    user_id = (select auth.uid()) AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND users.role = 'superintendent'
    )
  );

DROP POLICY IF EXISTS "Only superintendents can manage online status" ON superintendent_chat_online;
CREATE POLICY "Only superintendents can manage online status" ON superintendent_chat_online
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND users.role = 'superintendent'
    )
  );

DROP POLICY IF EXISTS "Only superintendents can manage reactions" ON superintendent_chat_reactions;
CREATE POLICY "Only superintendents can manage reactions" ON superintendent_chat_reactions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND users.role = 'superintendent'
    )
  );

DROP POLICY IF EXISTS "Only superintendents can manage read status" ON superintendent_chat_read_status;
CREATE POLICY "Only superintendents can manage read status" ON superintendent_chat_read_status
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND users.role = 'superintendent'
    )
  );

-- Blog posts policies
DROP POLICY IF EXISTS "Users can view their own draft posts" ON blog_posts;
CREATE POLICY "Users can view their own draft posts" ON blog_posts
  FOR SELECT
  USING (
    author_id = (select auth.uid())
    AND status IN ('draft', 'archived')
  );

DROP POLICY IF EXISTS "Users can create blog posts" ON blog_posts;
CREATE POLICY "Users can create blog posts" ON blog_posts
  FOR INSERT
  WITH CHECK (
    author_id = (select auth.uid())
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Authors and admins can update blog posts" ON blog_posts;
CREATE POLICY "Authors and admins can update blog posts" ON blog_posts
  FOR UPDATE
  USING (
    author_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND (users.role = 'superadmin' OR users.role = 'admin')
    )
  );

DROP POLICY IF EXISTS "Authors and admins can delete blog posts" ON blog_posts;
CREATE POLICY "Authors and admins can delete blog posts" ON blog_posts
  FOR DELETE
  USING (
    author_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND (users.role = 'superadmin' OR users.role = 'admin')
    )
  );

DROP POLICY IF EXISTS "Admins can manage blog categories" ON blog_categories;
CREATE POLICY "Admins can manage blog categories" ON blog_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = (select auth.uid())
      AND (users.role = 'superadmin' OR users.role = 'admin')
    )
  );

-- Crew applications policies
DROP POLICY IF EXISTS "Admins can view all applications" ON crew_applications;
CREATE POLICY "Admins can view all applications" ON crew_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = (
        SELECT users.email
        FROM auth.users
        WHERE users.id = (select auth.uid())
      )
      AND admins.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can update applications" ON crew_applications;
CREATE POLICY "Admins can update applications" ON crew_applications
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.email = (
        SELECT users.email
        FROM auth.users
        WHERE users.id = (select auth.uid())
      )
      AND admins.is_active = true
    )
  );

-- ============================================
-- 2. ADD MISSING INDEXES ON FOREIGN KEYS
-- ============================================

-- Index on chat messages reply_to_message_id foreign key
CREATE INDEX IF NOT EXISTS idx_chat_messages_reply_to_message_id 
ON superintendent_chat_messages(reply_to_message_id)
WHERE reply_to_message_id IS NOT NULL;

-- Index on chat reactions user_id foreign key
CREATE INDEX IF NOT EXISTS idx_chat_reactions_user_id 
ON superintendent_chat_reactions(user_id);

-- Index on chat read status last_read_message_id foreign key
CREATE INDEX IF NOT EXISTS idx_chat_read_status_last_read_message_id 
ON superintendent_chat_read_status(last_read_message_id)
WHERE last_read_message_id IS NOT NULL;

-- ============================================
-- 3. REMOVE DUPLICATE INDEXES
-- ============================================

-- Remove duplicate index on email_verifications
-- Keep the unique constraint index, drop the redundant one
DROP INDEX IF EXISTS idx_email_verifications_user_email;

-- ============================================
-- 4. OPTIMIZE MULTIPLE PERMISSIVE POLICIES
-- ============================================
-- Note: Some multiple policies are necessary for different access patterns
-- We'll keep them but ensure they use optimized auth.uid() calls
-- The performance impact is minimal compared to the auth.uid() optimization above

-- ============================================
-- NOTES
-- ============================================
-- 
-- Performance improvements expected:
-- - RLS policy evaluation: 99%+ faster for large tables
-- - Foreign key lookups: Faster joins and deletes
-- - Reduced index overhead: Removed duplicate indexes
--
-- The multiple permissive policies warning is acceptable in many cases
-- as they provide necessary access patterns. The auth.uid() optimization
-- is the most critical performance improvement.

