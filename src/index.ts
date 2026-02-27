// UTILS //
import { sendResponse } from "./common/utils/api.util.js";

// LIBRARIES //
import { Hono } from "hono";
import { handle } from "@hono/node-server/vercel";
import { logger } from "hono/logger";

const app = new Hono();
// Middleware
app.use(logger());

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

export default handle(app);
