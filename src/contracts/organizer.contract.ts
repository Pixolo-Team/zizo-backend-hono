// LIBRARIES //
import { createRoute } from '@hono/zod-openapi';

// VALIDATORS //
import { organizersSchema } from '@/validators/organizer.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

/**
 * Route definition for GET /organizers
 */
export const getAllOrganizersRoute = createRoute({
  method: 'get',
  path: `/organizers`,
  tags: ['Organizer'],
  summary: 'Get all the Organizers without Filters',
  responses: {
    200: {
      description: 'List of all the Organizers',
      content: {
        'application/json': {
          schema: apiResponseSchema(organizersSchema.array()),
        },
      },
    },
    500: {
      description: 'List of all the Organizers',
    },
  },
});

/**
 * Route definition for GET /organizers/getbyid
 */
export const getOrganizerByIdRoute = createRoute({
  method: 'get',
  path: `/organizers/getbyid`,
  tags: ['Organizer'],
  summary: 'Get the Organizer by the ID that is passed',
  responses: {
    200: {
      description: 'Organizer fetched',
      content: {
        'application/json': {
          schema: apiResponseSchema(organizersSchema),
        },
      },
    },
    500: {
      description: 'Could not fetch the Organizer',
    },
  },
});
