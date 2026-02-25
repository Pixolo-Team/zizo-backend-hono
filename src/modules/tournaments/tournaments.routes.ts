// OTHERS //
import { Hono } from "hono";

// CONTROLLERS //
import {
  getTournaments,
  getTournamentDetails,
} from "./tournaments.controllers.js";

// Init Hono
export const tournamentRoute = new Hono();

// GET: /tournaments/
tournamentRoute.get("/", getTournaments);

// GET: /tournaments/:id
tournamentRoute.get("/:id", getTournamentDetails);
