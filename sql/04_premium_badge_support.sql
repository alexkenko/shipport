-- Premium Badge Support Migration
-- This migration adds support for premium badges for Marine Superintendents
-- who signed up before December 31, 2025

-- Note: Premium status is calculated dynamically based on signup date and role
-- No additional database fields are needed as the logic is handled in the application

-- The premium badge eligibility is determined by:
-- 1. User role must be 'superintendent'
-- 2. User created_at date must be <= '2025-12-31T23:59:59Z'

-- This ensures that all Marine Superintendents who sign up until December 31, 2025
-- will automatically receive the "Premium Badge" in all profile views

-- Premium badge features:
-- - Shows "New Premium" for users who signed up within the last 30 days
-- - Shows "Premium" for users who signed up more than 30 days ago but before deadline
-- - Only displays for superintendents
-- - Automatically disappears after December 31, 2025 for new signups

-- No database changes required - premium status is calculated in real-time
