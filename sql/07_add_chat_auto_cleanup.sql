-- Add auto-cleanup functionality for chat messages
-- Messages will be automatically deleted after 24 hours

-- Create function to clean up old chat messages
CREATE OR REPLACE FUNCTION cleanup_old_chat_messages()
RETURNS void AS $$
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
$$ language 'plpgsql';

-- Create a scheduled job to run cleanup every hour
-- Note: This requires pg_cron extension which may not be available on all Supabase plans
-- Alternative: Use Supabase Edge Functions with cron triggers

-- Create function to get message count (for monitoring)
CREATE OR REPLACE FUNCTION get_chat_message_count()
RETURNS integer AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM superintendent_chat_messages);
END;
$$ language 'plpgsql';

-- Create function to get messages older than specified hours
CREATE OR REPLACE FUNCTION get_old_messages_count(hours_old integer)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM superintendent_chat_messages 
    WHERE created_at < now() - (hours_old || ' hours')::interval
  );
END;
$$ language 'plpgsql';

-- Add index for better performance on cleanup queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at_cleanup 
ON superintendent_chat_messages(created_at DESC) 
WHERE created_at < now() - interval '24 hours';

-- Create view for recent messages only (last 24 hours)
CREATE OR REPLACE VIEW recent_chat_messages AS
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

-- Update the existing chat_messages_with_users view to only show recent messages
DROP VIEW IF EXISTS chat_messages_with_users;
CREATE VIEW chat_messages_with_users AS
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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION cleanup_old_chat_messages() TO authenticated;
GRANT EXECUTE ON FUNCTION get_chat_message_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_old_messages_count(integer) TO authenticated;

-- Create a simple trigger to log when messages are cleaned up
CREATE OR REPLACE FUNCTION log_chat_cleanup()
RETURNS trigger AS $$
BEGIN
  -- This function can be used to log cleanup activities if needed
  -- For now, we'll just return the deleted row
  RETURN OLD;
END;
$$ language 'plpgsql';

-- Add trigger for cleanup logging (optional)
-- CREATE TRIGGER chat_cleanup_log AFTER DELETE ON superintendent_chat_messages
-- FOR EACH ROW EXECUTE FUNCTION log_chat_cleanup();

-- Instructions for setting up automatic cleanup:
-- 
-- Option 1: Use Supabase Edge Functions with cron
-- Create an Edge Function that calls cleanup_old_chat_messages() every hour
--
-- Option 2: Use external cron job
-- Set up a cron job that calls the cleanup function via API
--
-- Option 3: Manual cleanup (for testing)
-- Call: SELECT cleanup_old_chat_messages();
