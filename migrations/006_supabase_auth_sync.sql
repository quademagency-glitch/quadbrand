-- Trigger to automatically create a user_profile and workspace when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_workspace_id UUID;
BEGIN
  -- Insert into user_profiles
  INSERT INTO public.user_profiles (id, email, full_name, referred_by)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'referred_by'
  );

  -- Insert default workspace
  INSERT INTO public.workspaces (name, owner_id, credits_pool)
  VALUES (
    COALESCE(new.raw_user_meta_data->>'full_name', 'My Workspace'),
    new.id,
    20 -- default free credits
  ) RETURNING id INTO new_workspace_id;

  -- Add a signup bonus transaction
  INSERT INTO public.credit_transactions (workspace_id, user_id, amount, reason)
  VALUES (
    new_workspace_id,
    new.id,
    20,
    'signup_bonus'
  );

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
