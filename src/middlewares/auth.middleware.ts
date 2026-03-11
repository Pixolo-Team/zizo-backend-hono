// MODULES //
import { createMiddleware } from 'hono/factory';


// SUPABASE //
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';

// UTILS //
import { errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// Define the custom variables for the context to ensure type safety
type EnvData = {
  Variables: {
    user: User;
  };
};

/**
 * Authentication Middleware
 * Validates the access_token cookie and attaches the authenticated User to context
 */
export const authMiddleware = createMiddleware<EnvData>(async (c, next) => {
  
  const authHeader = c.req.header('Authorization');
  // Get access_token from header
  const token = authHeader?.replace('Bearer ', '');
  
  // Check if token exists
  if (!authHeader) {
    return errorResponse(
      c,
      'Access token missing',
      ERROR_MESSAGES.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED
    );
  }
  

  if (!token) {
    return errorResponse(
      c,
      'Access token missing',
      ERROR_MESSAGES.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Validate token with Supabase auth
  const { data, error } = await supabase.auth.getUser(token);
  
  // Handle invalid or expired token
  if (error || !data?.user) {
    return errorResponse(
      c,
      'Invalid or expired token',
      ERROR_MESSAGES.UNAUTHORIZED,
      HTTP_STATUS.UNAUTHORIZED
    );
  }

  // Attach authenticated User to request context
  c.set('user', data.user);

  // Proceed to next middleware or route handler and return its result
  return await next();
});
