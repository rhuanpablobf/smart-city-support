
import { User, UserRole, UserStatus } from '@/types/auth';
import { validateStatus } from './userStatusUtils';

/**
 * Maps data from Supabase to our User type
 */
export function mapSupabaseToUser(user: any): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    isOnline: user.is_online,
    status: validateStatus(user.status),
    maxConcurrentChats: user.max_concurrent_chats,
    secretaryId: user.secretary_id,
    secretaryName: user.secretary_name,
    departmentId: user.department_id,
    departmentName: user.department_name,
    avatar: user.avatar || '/placeholder.svg',
    createdAt: new Date(user.created_at || Date.now()),
    updatedAt: new Date(user.updated_at || Date.now()),
    active: true
  };
}
