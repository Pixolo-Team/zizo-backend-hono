// CONTRACTS //
import { createVenueRoute, editVenueRoute } from '@/contracts/venue.contract';

// CONTROLLERS //
import { venueController } from '@/controllers/venue.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /venues/create
openapiApp.openapi(createVenueRoute, (c) => venueController.createVenue(c));

// PATCH /venues/edit/:venue_id
openapiApp.openapi(editVenueRoute, (c) => venueController.editVenue(c));
