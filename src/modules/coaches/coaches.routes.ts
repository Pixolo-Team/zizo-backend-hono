// LIBRARIES //
import { Hono } from "hono";

// CONTROLLERS //
import { createCoach } from "./coaches.controllers.js";

// Init Hono
export const coachRoute = new Hono();

// POST: /coaches/
coachRoute.post("/", createCoach);
