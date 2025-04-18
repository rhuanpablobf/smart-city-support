
-- This SQL needs to be run in the Supabase SQL Editor to fix the department permissions

-- Create a function to fix department permissions
CREATE OR REPLACE FUNCTION public.fix_department_permissions()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Drop any existing RLS policies for departments
  DROP POLICY IF EXISTS "Anyone can select departments" ON departments;
  DROP POLICY IF EXISTS "Anyone can insert departments" ON departments;
  DROP POLICY IF EXISTS "Anyone can update departments" ON departments;
  DROP POLICY IF EXISTS "Anyone can delete departments" ON departments;

  -- Create new, more permissive policies
  CREATE POLICY "Anyone can select departments"
    ON departments FOR SELECT
    USING (true);

  CREATE POLICY "Anyone can insert departments"
    ON departments FOR INSERT
    WITH CHECK (true);

  CREATE POLICY "Anyone can update departments"
    ON departments FOR UPDATE
    USING (true);

  CREATE POLICY "Anyone can delete departments"
    ON departments FOR DELETE
    USING (true);

  -- Ensure RLS is enabled
  ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
  
  RETURN true;
END;
$$;

-- Add information to the user about executing this SQL
COMMENT ON FUNCTION public.fix_department_permissions() IS 'Function to fix department RLS policies';
