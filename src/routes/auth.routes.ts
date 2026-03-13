// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';

// VALIDATORS //
import {
  verifyOtpRequestSchema,
  verifyOtpResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
} from '@/validators/auth.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// CONTROLLER //
import { authController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// Route definition for verifying a user's OTP
const verifyOtpRoute = createRoute({
  method: 'post',
  path: '/auth/verify-otp',
  tags: ['Auth'],
  summary: 'Verify OTP and authenticate User',
  request: {
    body: {
      content: {
        'application/json': {
          schema: verifyOtpRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'OTP verified successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(verifyOtpResponseSchema),
        },
      },
    },
    400: {
      description: 'Bad Request - Malformed JSON',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    401: {
      description: 'Invalid or expired OTP',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    422: {
      description: 'Validation Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
  },
});

// Route definition for POST /auth/login
const loginRoute = createRoute({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Initiate OTP login using phone number',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: 'OTP sent successfully',
      content: {
        'application/json': {
          schema: apiResponseSchema(loginResponseSchema),
        },
      },
    },
    400: {
      description: 'Bad Request - Malformed JSON',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    404: {
      description: 'Phone number not found',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    422: {
      description: 'Validation Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: apiResponseSchema(z.null()),
        },
      },
    },
  },
});

// POST: /auth/verify-otp
openapiApp.openapi(verifyOtpRoute, (c) => authController.verifyOtp(c));

// POST: /auth/login
openapiApp.openapi(loginRoute, (c) => authController.login(c));
