import { OpenAPIHono } from '@hono/zod-openapi';
import { errorResponse } from '@/common/utils/api.util';
import { HTTP_STATUS } from '@/constants/api';

/**
 * OpenAPI Hono application instance with a global defaultHook for validation errors
 */
export const openapiApp = new OpenAPIHono({
    defaultHook: (result, c) => {
        if (!result.success) {
            const validationIssue = result.error.issues[0];
            const fieldName = validationIssue?.path.join('.') ?? 'unknown';
            const issueMessage = validationIssue?.message ?? 'Validation failed';
            return errorResponse(
                c,
               `Invalid field '${fieldName}': ${issueMessage}`,
                'Validation failed',
                HTTP_STATUS.UNPROCESSABLE_ENTITY
            );
        }
    },

});