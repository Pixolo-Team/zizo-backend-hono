// OTHERS //
import { Hono } from "hono";

// CONTROLLERS //
import { getIdentities } from "@/modules/identities/identities.controllers.js";

// Create Hono Instance for ROutes
export const identityRoute = new Hono();

// Define Routes

// GET: /identities/
identityRoute.get("/", getIdentities);
