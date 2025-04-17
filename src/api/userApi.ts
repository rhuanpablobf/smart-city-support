
import { supabase } from '@/services/base/supabaseBase';
import { User, UserRole, UserStatus } from '@/types/auth';
import { mapSupabaseToUser } from '@/utils/userDataMappers';

/**
 * Fetches all users from the database
 */
export async function fetchUsers() {
  const { data, error } = await supabase
    .from('app_users')
    .select('*');

  if (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }

  // Map Supabase data to our User type
  return data.map(mapSupabaseToUser);
}

/**
 * Adds a new user to the database
 */
export async function addUser(newUser: Partial<User>) {
  const initialStatus: UserStatus = newUser.role === 'admin' ? 'offline' : 'online';
  
  const { data, error } = await supabase
    .from('app_users')
    .insert({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      is_online: initialStatus !== 'offline',
      status: initialStatus,
      max_concurrent_chats: newUser.maxConcurrentChats || 5,
      secretary_id: newUser.secretaryId,
      secretary_name: newUser.secretaryName,
      department_id: newUser.departmentId,
      department_name: newUser.departmentName,
      avatar: '/placeholder.svg',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error adding user: ${error.message}`);
  }

  return mapSupabaseToUser(data);
}

/**
 * Updates an existing user in the database
 */
export async function updateUser(user: User) {
  const { error } = await supabase
    .from('app_users')
    .update({
      name: user.name,
      email: user.email,
      role: user.role,
      is_online: user.isOnline,
      status: user.status,
      max_concurrent_chats: user.maxConcurrentChats,
      secretary_id: user.secretaryId,
      secretary_name: user.secretaryName,
      department_id: user.departmentId,
      department_name: user.departmentName,
    })
    .eq('id', user.id);

  if (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
  
  return true;
}

/**
 * Deletes a user from the database
 */
export async function deleteUser(userId: string) {
  const { error } = await supabase
    .from('app_users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
  
  return true;
}
