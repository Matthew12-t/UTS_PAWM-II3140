-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create a function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies - Allow service role to bypass (for trigger)
-- For user_profiles: Allow users to read/update their own, and allow trigger to insert
CREATE POLICY "Enable insert for service role" ON user_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for users based on id" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on id" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- For user_progress: Allow service role to insert, users to read/update their own
CREATE POLICY "Enable insert for service role" ON user_progress
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for users based on user_id" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- For lab_sessions: Users can do CRUD on their own
CREATE POLICY "Enable insert for authenticated users" ON lab_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for users based on user_id" ON lab_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON lab_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON lab_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- For lab_results: Users can do CRUD on their own
CREATE POLICY "Enable insert for authenticated users" ON lab_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable select for users based on user_id" ON lab_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON lab_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON lab_results
  FOR DELETE USING (auth.uid() = user_id);
