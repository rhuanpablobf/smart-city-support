
import { supabase } from '@/services/base/supabaseBase';

export async function configureRLSPolicies() {
  try {
    // Call the RPC function properly without any parameters
    const { error } = await supabase.rpc('fix_department_permissions');
    
    if (error) {
      console.error('Error fixing permissions:', error);
      return false;
    }
    
    console.info('Permissions successfully configured');
    return true;
  } catch (error) {
    console.error('Error configuring RLS policies:', error);
    return false;
  }
}
