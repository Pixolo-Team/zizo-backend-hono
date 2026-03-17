// CONTROLLER //
import { authController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';
import { verifyOtpRoute, loginRoute } from '@/contracts/auth.contracts';

// POST: /auth/verify-otp
openapiApp.openapi(verifyOtpRoute, (c) => authController.verifyOtp(c));

// POST: /auth/login
openapiApp.openapi(loginRoute, (c) => authController.login(c));
