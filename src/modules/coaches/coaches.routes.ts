// CONTROLLERS //
import { createCoach } from "./coaches.controller.js";

// LIBRARIES //
import { Hono } from "hono";

const coachesRoutes = new Hono();

coachesRoutes.post("/", createCoach);

export { coachesRoutes };
