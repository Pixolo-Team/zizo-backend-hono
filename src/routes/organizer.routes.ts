// PACKAGES //
import { createRoute } from '@hono/zod-openapi';

// CONTROLLERS //
import { organizerController } from '@/controllers';

// VALIDATORS //
import { organizersSchema } from '@/validators/organizer.validator';
import { apiResponseSchema } from '@/validators/api-response.schema';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// Generate the Routes
const getAllOrganizersRoute = createRoute({
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

// /organizers/getbyid
const getOrganizerByIdRoute = createRoute({
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

// GET /organizers - Get all Organizers
openapiApp.openapi(getAllOrganizersRoute, (c) => organizerController.getOrganizers(c));

// GET: /organizers/getbyid - To get a single Organizer
openapiApp.openapi(getOrganizerByIdRoute, (c) => organizerController.getSingleOrganizer(c));
