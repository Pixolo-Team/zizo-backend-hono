// CONTRACTS //
import { getAllOrganizersRoute, getOrganizerByIdRoute } from '@/contracts/organizer.contract';

// CONTROLLERS //
import { organizerController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// GET /organizers - Get all Organizers
openapiApp.openapi(getAllOrganizersRoute, (c) => organizerController.getOrganizers(c));

// GET: /organizers/getbyid - To get a single Organizer
openapiApp.openapi(getOrganizerByIdRoute, (c) => organizerController.getSingleOrganizer(c));
