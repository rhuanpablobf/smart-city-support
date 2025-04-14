
import { supabase as originalSupabase } from "@/integrations/supabase/client";
import type { CustomSupabaseClient } from "@/types/database";

/**
 * Base service file that exports the supabase client
 * for use in other service files
 */
// Cast the original supabase client to our extended type
export const supabase = originalSupabase as unknown as CustomSupabaseClient;
