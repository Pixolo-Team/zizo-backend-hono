// MODULES //
import { OpenAPIHono } from '@hono/zod-openapi';

// UTILS //
import { errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS } from '@/constants/api';

export const openapiApp = new OpenAPIHono({
    defaultHook: (result, c) => {
        if (!result.success) {
            const parseError = result.error.issues[0];
            const fieldName = parseError?.path.join('.') ?? 'unknown';
            const issueMessage = parseError?.message ?? 'Validation failed';
            return errorResponse(
                c,
               `Invalid field '${fieldName}': ${issueMessage}`,
                'Validation failed',
                HTTP_STATUS.UNPROCESSABLE_ENTITY
            );
        }
        return;
    },
});