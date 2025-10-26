-- Create email_verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    otp_code VARCHAR(6),
    otp_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on user_id and email
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_verifications_user_email ON email_verifications(user_id, email);

-- Create trigger for updated_at
CREATE TRIGGER update_email_verifications_updated_at 
BEFORE UPDATE ON email_verifications 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


