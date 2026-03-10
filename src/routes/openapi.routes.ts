import { OpenAPIHono } from '@hono/zod-openapi';
import { errorResponse } from '@/common/utils/api.util';
import { HTTP_STATUS } from '@/constants/api';

export const openapiApp = new OpenAPIHono({
    defaultHook: (result, c) => {
        if (!result.success) {
            const firstError =
                result.error.issues[0]?.message ?? 'Validation failed';
            return errorResponse(
                c,
                firstError,
                'Validation failed',
                HTTP_STATUS.UNPROCESSABLE_ENTITY
            );
        }
    },
});