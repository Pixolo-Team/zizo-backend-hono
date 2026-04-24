// CONTRACTS //
import { createVenueRoute, getAllVenuesRoute } from '@/contracts/venue.contract';

// CONTROLLERS //
import { venueController } from '@/controllers/venue.controller';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST /venues/create
openapiApp.openapi(createVenueRoute, (c) => venueController.createVenue(c));

// GET /venues
openapiApp.openapi(getAllVenuesRoute, (c) => venueController.getAllVenues(c));
