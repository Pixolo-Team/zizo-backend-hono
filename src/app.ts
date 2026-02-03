// OTHERS //
import { Hono } from "hono";

// UTILS //
import { sendResponse } from "@/common/utils/api.util.js";

// ROUTES //
import { identityRoute } from "@/modules/identities/identities.routes.js";
import { tournamentRoute } from "@/modules/tournaments/tournaments.routes.js";

// Init Hono
export const app = new Hono();

/**
 * Global Error Handler
 */
app.onError((err, c) => {
  console.error(`${err}`);
  return sendResponse(c, null, 500, "Internal Server Error", err.message);
});

/**
 * Not Found Handler
 */
app.notFound((c) => {
  return sendResponse(c, null, 404, "Route Not Found");
});

/**
 * Root Route
 */
app.get("/", (c) => {
  return sendResponse(c, { version: "1.0.0" }, 200, "Zizo API is running");
});

// Init Routes
app.route("/identities", identityRoute);
app.route("/tournaments", tournamentRoute);
