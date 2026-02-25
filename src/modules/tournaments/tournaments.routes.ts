import { Hono } from "hono";
import { getTournaments } from "./tournaments.controllers.js";

export const tournamentRoute = new Hono();

// GET: /tournaments
tournamentRoute.get("/", getTournaments);
