/*
  # Disable email verification requirement

  This migration disables email verification in Supabase Auth settings
  to allow users to login immediately after registration.
*/

-- Update auth settings to disable email confirmation
UPDATE auth.config 
SET 
  enable_signup = true,
  enable_email_confirmations = false,
  enable_email_change_confirmations = false
WHERE true;

-- If the above doesn't work (config table might not exist), we'll handle it in the application
-- The main change is in the application code to not require email verification