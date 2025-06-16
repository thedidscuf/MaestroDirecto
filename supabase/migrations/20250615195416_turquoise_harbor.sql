/*
  # Disable email verification requirement

  This migration removes the requirement for email verification by:
  1. Adding a comment explaining the change is handled in application code
  2. Ensuring users table can handle unverified emails
  3. Adding helper functions for user management without email verification

  Note: Supabase email confirmation settings are managed through the dashboard
  or environment variables, not through SQL migrations.
*/

-- Add comment to document the change
COMMENT ON TABLE public.users IS 'Users table - email verification disabled, users can access immediately after signup';

-- Ensure users table allows for immediate access without email verification
-- Update any existing policies that might block unverified users

-- Function to handle user creation without email verification requirement
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nombre, tipo_usuario, activo, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'tipo_usuario', 'cliente'),
    true, -- Always set as active since we don't require email verification
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    activo = true, -- Ensure user is active
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail authentication
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the trigger to use the new function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure all existing users are marked as active (since we're removing email verification)
UPDATE public.users 
SET 
  activo = true,
  updated_at = NOW()
WHERE activo IS NULL OR activo = false;

-- Update RLS policies to not check for email verification
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure professionals can be created immediately after user signup
DROP POLICY IF EXISTS "Professionals can insert own data" ON public.professionals;
CREATE POLICY "Professionals can insert own data"
  ON public.professionals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add a function to automatically activate new professional accounts
CREATE OR REPLACE FUNCTION auto_activate_professional()
RETURNS TRIGGER AS $$
BEGIN
  -- Set the professional as active immediately
  NEW.activo = true;
  NEW.verificado = false; -- Will be verified manually later
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-activation
DROP TRIGGER IF EXISTS auto_activate_professional_trigger ON public.professionals;
CREATE TRIGGER auto_activate_professional_trigger
  BEFORE INSERT ON public.professionals
  FOR EACH ROW EXECUTE FUNCTION auto_activate_professional();

-- Create a function to check if user setup is complete
CREATE OR REPLACE FUNCTION is_user_setup_complete(user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  user_exists boolean;
  is_professional boolean;
  professional_exists boolean;
BEGIN
  -- Check if user exists in users table
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = user_uuid) INTO user_exists;
  
  -- Check if user is marked as professional
  SELECT tipo_usuario = 'profesional' FROM public.users WHERE id = user_uuid INTO is_professional;
  
  -- If professional, check if professional profile exists
  IF is_professional THEN
    SELECT EXISTS(SELECT 1 FROM public.professionals WHERE user_id = user_uuid) INTO professional_exists;
    RETURN user_exists AND professional_exists;
  ELSE
    RETURN user_exists;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_user_setup_complete(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION auto_activate_professional() TO authenticated;

-- Add indexes for better performance on active users
CREATE INDEX IF NOT EXISTS idx_users_active_type ON public.users(activo, tipo_usuario) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_professionals_active ON public.professionals(activo, user_id) WHERE activo = true;

-- Update any existing professional records to be active
UPDATE public.professionals 
SET 
  activo = true,
  updated_at = NOW()
WHERE activo IS NULL OR activo = false;