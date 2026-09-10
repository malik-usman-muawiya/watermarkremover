/**
 * Application Security Utility
 * Provides input sanitization, admin session verification with expiration,
 * and brute-force attempt lockout guards.
 */

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Strips HTML tags, script entities, and control characters to prevent XSS.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

/**
 * Checks if the current admin session is valid and not expired.
 */
export function isValidAdminSession(): boolean {
  try {
    const authState = sessionStorage.getItem('cleanmark_admin_auth');
    const authTimeStr = sessionStorage.getItem('cleanmark_admin_auth_time');

    if (authState !== 'authenticated' || !authTimeStr) {
      return false;
    }

    const authTime = parseInt(authTimeStr, 10);
    if (isNaN(authTime)) return false;

    const isExpired = Date.now() - authTime > SESSION_EXPIRY_MS;
    if (isExpired) {
      clearAdminSession();
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sets authenticated admin session.
 */
export function setAdminSession(): void {
  sessionStorage.setItem('cleanmark_admin_auth', 'authenticated');
  sessionStorage.setItem('cleanmark_admin_auth_time', Date.now().toString());
  resetFailedAttempts();
}

/**
 * Clears all admin session credentials.
 */
export function clearAdminSession(): void {
  sessionStorage.removeItem('cleanmark_admin_auth');
  sessionStorage.removeItem('cleanmark_admin_auth_time');
}

/**
 * Inspects if the admin login is currently in lockout state.
 */
export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  try {
    const lockUntilStr = sessionStorage.getItem('admin_lockout_until');
    const attemptsStr = sessionStorage.getItem('admin_failed_attempts');
    const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0;

    if (lockUntilStr) {
      const lockUntil = parseInt(lockUntilStr, 10);
      const remainingMs = lockUntil - Date.now();
      if (remainingMs > 0) {
        return {
          isLocked: true,
          remainingSeconds: Math.ceil(remainingMs / 1000),
          attempts
        };
      } else {
        sessionStorage.removeItem('admin_lockout_until');
        sessionStorage.removeItem('admin_failed_attempts');
      }
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attempts
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  }
}

/**
 * Records a failed login attempt and calculates lockout if threshold exceeded.
 */
export function recordFailedAttempt(): { isLocked: boolean; remainingSeconds: number; attempts: number } {
  try {
    const attemptsStr = sessionStorage.getItem('admin_failed_attempts');
    const currentAttempts = (attemptsStr ? parseInt(attemptsStr, 10) : 0) + 1;
    sessionStorage.setItem('admin_failed_attempts', currentAttempts.toString());

    if (currentAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      sessionStorage.setItem('admin_lockout_until', lockUntil.toString());
      return {
        isLocked: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        attempts: currentAttempts
      };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attempts: currentAttempts
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attempts: 1 };
  }
}

/**
 * Resets failed login attempts counter.
 */
export function resetFailedAttempts(): void {
  try {
    sessionStorage.removeItem('admin_failed_attempts');
    sessionStorage.removeItem('admin_lockout_until');
  } catch {
    // Ignore
  }
}
