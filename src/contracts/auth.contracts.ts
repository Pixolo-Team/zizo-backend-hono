import { ApiRoutes } from "@/constants/routes.constants";
import { verifyOtpRequestSchema, verifyOtpResponseSchema, loginRequestSchema, loginResponseSchema } from "@/validators";
import { apiResponseSchema } from "@/validators/api-response.schema";
import { createRoute } from "@hono/zod-openapi";
import z from "zod";

// Route definition for verifying a User's OTP
export const verifyOtpRoute = createRoute({
  method: 'post',
  path: ApiRoutes.VERIFY_OTP,
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
export const loginRoute = createRoute({
  method: 'post',
  path: ApiRoutes.LOGIN,
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