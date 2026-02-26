// OTHERS //
import { Hono } from "hono";

// CONTROLLERS //
import { getTournaments } from "./tournaments.controllers.js";

// Init Hono
export const tournamentRoute = new Hono();

// GET: /tournaments/
tournamentRoute.get("/", getTournaments);
