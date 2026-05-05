import { createSubscriptionPlanRoute } from '@/contracts/subscription-plans.contract';
import { subscriptionPlansController } from '@/controllers';
import { openapiApp } from '@/routes/openapi.routes';

openapiApp.openapi(createSubscriptionPlanRoute, (c) => subscriptionPlansController.createSubscriptionPlan(c));
