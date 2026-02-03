// OTHERS //
import { Hono } from "hono";

// ROUTES //
import { identityRoute } from "@/modules/identities/identities.routes.js";
import { tournamentRoute } from "@/modules/tournaments/tournaments.routes.js";

// Init Hono
export const app = new Hono();

// Testing Route
app.get("/", (c) => c.text("Hello World!"));

// Init Routes
app.route("/identities", identityRoute);
app.route("/tournaments", tournamentRoute);
