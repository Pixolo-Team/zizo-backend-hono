import { createPaymentRoute } from '@/contracts/payments.contract';
import { paymentsController } from '@/controllers';
import { openapiApp } from '@/routes/openapi.routes';

openapiApp.openapi(createPaymentRoute, (c) => paymentsController.createPayment(c));
