
import { UserStatus } from '@/types/auth';

/**
 * Validates user status and returns a default if invalid
 */
export function validateStatus(status: string | null | undefined): UserStatus {
  const validStatuses: UserStatus[] = ['online', 'offline', 'break'];
  
  if (typeof status === 'string' && validStatuses.includes(status as UserStatus)) {
    return status as UserStatus;
  }
  
  // Default to offline if status is invalid
  return 'offline';
}

/**
 * Gets status badge color
 */
export function getStatusBadgeColor(status: UserStatus): string {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'break':
      return 'bg-yellow-500';
    case 'offline':
    default:
      return 'bg-gray-500';
  }
}

/**
 * Gets status text translation
 */
export function getStatusText(status: UserStatus): string {
  switch (status) {
    case 'online':
      return 'Online';
    case 'break':
      return 'Em pausa';
    case 'offline':
    default:
      return 'Offline';
  }
}
