// LIBRARIES //
import { OpenAPIHono } from '@hono/zod-openapi';

// UTILS //
import { errorResponse } from '@/common/utils/api.util';

// CONSTANTS //
import { HTTP_STATUS } from '@/constants/api';

export const openapiApp = new OpenAPIHono({
    defaultHook: (result, c) => {
        if (!result.success) {
            const validationError =
                result.error.issues[0]?.message ?? 'Validation failed';
            return errorResponse(
                c,
                validationError,
                'Validation failed',
                HTTP_STATUS.UNPROCESSABLE_ENTITY
            );
        }
        return undefined;
    },
});