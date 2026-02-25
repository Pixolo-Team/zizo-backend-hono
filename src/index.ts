import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { tournamentRoute } from "./modules/tournaments/tournaments.routes.js";

const app = new Hono();

app.route("/tournaments", tournamentRoute);

serve({ fetch: app.fetch, port: 3000 });
