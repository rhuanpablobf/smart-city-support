
import { UserStatus } from '@/types/auth';

/**
 * Validates and converts a status string to a valid UserStatus
 * @param statusString The status string to validate
 * @returns A valid UserStatus
 */
export function validateStatus(statusString: string): UserStatus {
  if (statusString === 'online' || statusString === 'offline' || statusString === 'break') {
    return statusString as UserStatus;
  }
  // Default to 'offline' for any invalid status values
  return 'offline';
}
