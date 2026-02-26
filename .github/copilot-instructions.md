# Copilot Instructions — zizo-backend-hono

This is a **Hono.js** REST API backend written in **TypeScript**, deployed on **Vercel**, and using **Supabase** as the database/auth layer.

---

## Tech Stack

| Tool                      | Purpose                                 |
| ------------------------- | --------------------------------------- |
| [Hono](https://hono.dev/) | Web framework (lightweight, edge-ready) |
| TypeScript                | Language (strict mode enabled)          |
| Supabase JS               | Database client & Auth                  |
| Vercel                    | Deployment (serverless)                 |
| ESLint + Prettier         | Linting & formatting                    |
| Husky                     | Git hooks (pre-commit lint)             |
| tsx                       | Dev server with hot reload              |

---

## Folder Structure

```
zizo-backend-hono/
├── src/
│   ├── index.ts                  # App entry point — registers middleware, routes, error handlers
│   ├── config/
│   │   └── supabase.ts           # Supabase client singleton
│   ├── common/
│   │   ├── types/
│   │   │   ├── api.response.type.ts    # ApiResponse<T> interface (standard HTTP response shape)
│   │   │   └── query.response.type.ts  # QueryResponseData<T> interface (service return shape)
│   │   └── utils/
│   │       └── api.util.ts       # sendResponse() helper — builds standardized JSON responses
│   └── modules/
│       ├── auth/                 # Auth module (Supabase Auth)
│       │   ├── auth.routes.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.type.ts
│       ├── identities/           # Identities module
│       │   ├── identities.routes.ts
│       │   ├── identities.controllers.ts
│       │   ├── identities.services.ts
│       │   └── identities.types.ts
│       └── tournaments/          # Tournaments module
│           ├── tournaments.routes.ts
│           ├── tournaments.controllers.ts
│           ├── tournaments.services.ts
│           └── tournaments.types.ts
├── .env                          # Local env vars (never commit)
├── .env.example                  # Template for env vars
├── package.json
├── tsconfig.json
└── eslint.config.ts
```

---

## Module Architecture

Every feature lives in its own folder under `src/modules/`. Each module has exactly **4 files** following a strict layered pattern:

```
<module>/
├── <module>.routes.ts        # Route definitions only
├── <module>.controller.ts    # HTTP layer (reads request, calls service, sends response)
├── <module>.service.ts       # Business logic + Supabase queries
└── <module>.type.ts          # TypeScript interfaces for that module's DB table(s)
```

### Layer Responsibilities

| Layer          | File              | Responsibilities                                        | Must NOT                                 |
| -------------- | ----------------- | ------------------------------------------------------- | ---------------------------------------- |
| **Routes**     | `*.routes.ts`     | Map HTTP methods + paths to controller functions        | Contain any logic                        |
| **Controller** | `*.controller.ts` | Parse request body/headers, call service, send response | Query DB directly or hold business logic |
| **Service**    | `*.service.ts`    | Business logic, all Supabase queries                    | Handle HTTP context or define routes     |
| **Types**      | `*.type(s).ts`    | TypeScript `interface` definitions for DB tables        | Contain any logic                        |

> **Flow:** `Route → Controller → Service → Supabase`

---

## How to Create a New API

### 1. Create the module folder

```
src/modules/<feature>/
```

### 2. Define types (`<feature>.types.ts`)

Model the Supabase table as a TypeScript `interface`. Use `interface`, not `type` (enforced by ESLint).

```ts
// <feature>.types.ts
export interface Feature {
  id: string;
  name: string;
  created_at?: string | null;
}
```

### 3. Write the service (`<feature>.service.ts`)

- Import `supabase` from `../../config/supabase.js`
- Return `QueryResponseData<T>` — always return `{ data, error }`, never throw to the controller
- All functions must have JSDoc comments

```ts
// <feature>.services.ts
import { supabase } from "../../config/supabase.js";
import { QueryResponseData } from "../../common/types/query.response.type.js";
import type { Feature } from "./feature.types.js";

/**
 * Fetch all features from the database
 * @returns Promise with QueryResponseData containing Feature array
 */
export const getFeaturesService = async (): Promise<
  QueryResponseData<Feature[]>
> => {
  try {
    const { data, error } = await supabase.from("features").select("*");

    if (error) {
      throw error;
    }

    return { data: data as Feature[], error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};
```

### 4. Write the controller (`<feature>.controller.ts`)

- Accepts `Context` from Hono
- Calls the service
- Uses `sendResponse()` from `../../common/utils/api.util.js` for all responses
- Must handle both success and error cases

```ts
// <feature>.controllers.ts
import type { Context } from "hono";
import { sendResponse } from "../../common/utils/api.util.js";
import { getFeaturesService } from "./feature.services.js";

/**
 * Controller to get all features
 * @param c - Hono Context
 * @returns Promise with JSON response
 */
export const getFeatures = async (c: Context): Promise<Response> => {
  const result = await getFeaturesService();

  if (result.error) {
    return sendResponse(
      c,
      null,
      500,
      "Failed to fetch features",
      result.error.message,
    );
  }

  return sendResponse(c, result.data, 200, "Features fetched successfully");
};
```

### 5. Define routes (`<feature>.routes.ts`)

- Create a `new Hono()` instance
- Export it as `featureRoute`
- Wire controller functions to HTTP methods/paths
- Add a comment above each route indicating the full path

```ts
// <feature>.routes.ts
import { Hono } from "hono";
import { getFeatures } from "./feature.controllers.js";

export const featureRoute = new Hono();

// GET: /features/
featureRoute.get("/", getFeatures);
```

### 6. Register the route in `src/index.ts`

```ts
import { featureRoute } from "./modules/feature/feature.routes.js";

app.route("/features", featureRoute);
```

---

## Standard Response Shape

All API responses use `sendResponse()` which produces this JSON structure:

```json
{
  "data": <T> | null,
  "status": "success" | "error",
  "status_code": 200,
  "message": "Human readable message",
  "error": null | "Error detail string"
}
```

- `status` is automatically derived: `"success"` for 2xx codes, `"error"` for everything else
- Always pass `null` for `data` on error responses
- Always pass `null` for `error` on success responses (it's the default)

---

## TypeScript Conventions

- **Strict mode** is enabled — no implicit `any`
- Always use `interface` over `type` for object shapes (ESLint enforced)
- Every exported function **must have an explicit return type** (ESLint enforced)
- All functions **must have JSDoc comments** with `@param` and `@returns` (ESLint enforced)
- Use `import type` for type-only imports (e.g., `import type { Context } from "hono"`)
- All imports use `.js` extensions even for `.ts` source files (required by NodeNext module resolution)

---

## Import Ordering Convention

Group imports in this order with section comments:

```ts
// TYPES //
import type { ... } from "...";

// UTILS //
import { ... } from "../../common/utils/...";

// SERVICES //
import { ... } from "./feature.services.js";

// OTHERS //
import { Hono } from "hono";
```

---

## File Naming Conventions

| File       | Convention                  | Example                      |
| ---------- | --------------------------- | ---------------------------- |
| Routes     | `<module>.routes.ts`        | `tournaments.routes.ts`      |
| Controller | `<module>.controller(s).ts` | `tournaments.controllers.ts` |
| Service    | `<module>.service(s).ts`    | `tournaments.services.ts`    |
| Types      | `<module>.type(s).ts`       | `tournaments.types.ts`       |

> Note: some files use singular (`controller`, `service`) and some plural — be consistent within a module.

---

## Environment Variables

Defined in `.env` (local). Always add new variables to `.env.example` too.

| Variable                   | Description                  |
| -------------------------- | ---------------------------- |
| `PUBLIC_SUPABASE_URL`      | Your Supabase project URL    |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public API key |

Access via `process.env.VARIABLE_NAME`.

---

## Dev Scripts

```bash
npm run dev      # Start dev server with hot reload (tsx watch)
npm run build    # Compile TypeScript to dist/
npm run start    # Run compiled output
npm run lint     # Run ESLint
```

---

## Error Handling

- **Global error handler** is defined in `src/index.ts` via `app.onError()` — catches any unhandled errors and returns a 500 response
- **Not found handler** is defined via `app.notFound()` — returns 404 for unknown routes
- In services, always wrap Supabase calls in `try/catch` and return the error in `QueryResponseData` rather than throwing up to the controller

---

## Supabase Client

A single shared Supabase client is created in `src/config/supabase.ts` and imported wherever needed:

```ts
import { supabase } from "../../config/supabase.js";
```

- `persistSession` is set to `false` (stateless server environment)
- The client is created with the anon key — use Supabase RLS policies for access control

Always follow the Route → Controller → Service → Supabase flow
Never mix DB calls inside controller
Always use QueryResponseData<T>
Always use sendResponse()
Always include JSDoc
Always include explicit return types
Always import using .js extensions
Never generate CommonJS
Never use any
Prefer small focused functions
Keep file length under 150 lines
