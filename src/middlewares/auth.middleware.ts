import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import type { User } from '@supabase/supabase-js';

import { supabase } from '@/config/supabase';
import { errorResponse } from '@/common/utils/api.util';
import { HTTP_STATUS, ERROR_MESSAGES } from '@/constants/api';

// Define the custom variables for the context to ensure type safety
type Env = {
  Variables: {
    user: User;
  };
};

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  // Get access_token from cookies
  const token = getCookie(c, 'access_token');

  // Check if token exists
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

  // Attach authenticated user to request context
  c.set('user', data.user);

  // Proceed to next middleware or route handler and return its result
  return await next();
});
