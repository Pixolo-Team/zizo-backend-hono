// CONTRACTS //
import { verifyOtpRoute, loginRoute } from '@/contracts/auth.contract';

// CONTROLLER //
import { authController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST: /auth/verify-otp
openapiApp.openapi(verifyOtpRoute, (c) => authController.verifyOtp(c));

// POST: /auth/login
openapiApp.openapi(loginRoute, (c) => authController.login(c));
