-- Create chat system for superintendents only
-- This allows all verified superintendents to chat in a group chat

-- Chat messages table
CREATE TABLE IF NOT EXISTS superintendent_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text', -- text, image, file, system
  file_url TEXT,
  file_name TEXT,
  reply_to_message_id UUID REFERENCES superintendent_chat_messages(id) ON DELETE SET NULL,
  edited_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Online users tracking
CREATE TABLE IF NOT EXISTS superintendent_chat_online (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  is_typing BOOLEAN DEFAULT FALSE,
  typing_updated_at TIMESTAMPTZ DEFAULT now()
);

-- Message reactions
CREATE TABLE IF NOT EXISTS superintendent_chat_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES superintendent_chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction VARCHAR(10) NOT NULL, -- emoji reactions like '👍', '❤️', etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(message_id, user_id, reaction)
);

-- Message read status
CREATE TABLE IF NOT EXISTS superintendent_chat_read_status (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_message_id UUID REFERENCES superintendent_chat_messages(id) ON DELETE SET NULL,
  last_read_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON superintendent_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON superintendent_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_reactions_message_id ON superintendent_chat_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_chat_online_last_seen ON superintendent_chat_online(last_seen_at DESC);

-- Enable Row Level Security
ALTER TABLE superintendent_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE superintendent_chat_online ENABLE ROW LEVEL SECURITY;
ALTER TABLE superintendent_chat_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE superintendent_chat_read_status ENABLE ROW LEVEL SECURITY;

-- Create policies for superintendents only
-- Only superintendents can access chat messages
CREATE POLICY "Only superintendents can view chat messages" ON superintendent_chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superintendent'
      AND users.verification_status = 'approved'
    )
  );

CREATE POLICY "Only superintendents can insert chat messages" ON superintendent_chat_messages
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superintendent'
      AND users.verification_status = 'approved'
    )
  );

CREATE POLICY "Users can update their own messages" ON superintendent_chat_messages
  FOR UPDATE USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superintendent'
      AND users.verification_status = 'approved'
    )
  );

CREATE POLICY "Users can delete their own messages" ON superintendent_chat_messages
  FOR DELETE USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superintendent'
      AND users.verification_status = 'approved'
    )
  );

-- Online status policies
CREATE POLICY "Only superintendents can manage online status" ON superintendent_chat_online
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superintendent'
      AND users.verification_status = 'approved'
    )
  );

-- Reaction policies
CREATE POLICY "Only superintendents can manage reactions" ON superintendent_chat_reactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superintendent'
      AND users.verification_status = 'approved'
    )
  );

-- Read status policies
CREATE POLICY "Only superintendents can manage read status" ON superintendent_chat_read_status
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'superintendent'
      AND users.verification_status = 'approved'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for messages table
CREATE TRIGGER update_chat_messages_updated_at BEFORE UPDATE ON superintendent_chat_messages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update online status
CREATE OR REPLACE FUNCTION update_superintendent_online_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update online status when a message is sent
  INSERT INTO superintendent_chat_online (user_id, last_seen_at, is_typing, typing_updated_at)
  VALUES (NEW.user_id, now(), FALSE, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    last_seen_at = now(),
    is_typing = FALSE,
    typing_updated_at = now();
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update online status when messages are sent
CREATE TRIGGER update_online_status_on_message AFTER INSERT ON superintendent_chat_messages
FOR EACH ROW EXECUTE FUNCTION update_superintendent_online_status();

-- Create function to clean up old online statuses (consider users offline after 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_offline_users()
RETURNS void AS $$
BEGIN
  DELETE FROM superintendent_chat_online 
  WHERE last_seen_at < now() - interval '5 minutes';
END;
$$ language 'plpgsql';

-- Create view for chat messages with user details
CREATE OR REPLACE VIEW chat_messages_with_users AS
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
ORDER BY m.created_at DESC;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
