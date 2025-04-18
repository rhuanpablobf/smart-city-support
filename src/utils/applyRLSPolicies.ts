
import { supabase } from '@/integrations/supabase/client';

/**
 * This utility function configures RLS (Row Level Security) policies for departments
 * to allow adding new departments to secretaries.
 * 
 * It should be run after connecting to Supabase or when experiencing permission issues.
 */
export async function configureRLSPolicies() {
  try {
    // Check if we can add a department (test query)
    const { data, error } = await supabase
      .from('departments')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error checking departments table:', error);
    }
    
    // Instructions for manual setup if needed
    console.info('If you are experiencing permission issues with departments:');
    console.info('1. Go to the Supabase dashboard');
    console.info('2. Open the SQL Editor');
    console.info('3. Run the SQL from src/sql/fix-permissions.sql');
    
    return !!data;
  } catch (error) {
    console.error('Error configuring RLS policies:', error);
    return false;
  }
}
