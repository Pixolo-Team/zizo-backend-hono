Here is your **fully updated Copilot Instructions file**
(with Import Heads + Clean Code Rules integrated properly and professionally structured).

You can replace your existing file completely with this.

---

# Copilot Instructions — zizo-backend-hono

This is a **Hono.js** REST API backend written in **TypeScript**, deployed on **Vercel**, and using **Supabase** as the database/auth layer.

---

# Tech Stack

| Tool                     | Purpose                                 |
| ------------------------ | --------------------------------------- |
| Hono                     | Web framework (lightweight, edge-ready) |
| TypeScript (Strict Mode) | Type-safe backend development           |
| Supabase JS              | Database client & Auth                  |
| Vercel                   | Serverless deployment                   |
| ESLint + Prettier        | Linting & formatting                    |
| Husky                    | Pre-commit lint enforcement             |
| tsx                      | Dev server with hot reload              |

---

# Folder Structure

```
zizo-backend-hono/
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── supabase.ts
│   ├── common/
│   │   ├── types/
│   │   │   ├── api.response.type.ts
│   │   │   └── query.response.type.ts
│   │   └── utils/
│   │       └── api.util.ts
│   └── modules/
│       ├── auth/
│       │   ├── auth.routes.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.types.ts
│       ├── <module>/
│       │   ├── <module>.routes.ts
│       │   ├── <module>.controller.ts
│       │   ├── <module>.service.ts
│       │   └── <module>.types.ts
├── .env
├── .env.example
├── package.json
├── tsconfig.json
└── eslint.config.ts
```

---

# Architecture Rule (STRICT)

Flow must always be:

```
Route → Controller → Service → Supabase
```

Never break this flow.

---

# Module Architecture

Each module must contain exactly 4 files:

```
<module>/
├── <module>.routes.ts
├── <module>.controller.ts
├── <module>.service.ts
└── <module>.types.ts
```

---

# Layer Responsibilities

| Layer      | Responsibility                             |
| ---------- | ------------------------------------------ |
| Routes     | Define endpoints only                      |
| Controller | Parse request, call service, send response |
| Service    | Business logic + Supabase queries          |
| Types      | TypeScript interfaces only                 |

---

# Import Head Convention (MANDATORY)

Every file must follow this exact grouped structure.

## Standard Import Order

```ts
// TYPES //
import type { Context } from "hono";
import type { Feature } from "./feature.types.js";

// CONFIG //
import { supabase } from "../../config/supabase.js";

// UTILS //
import { sendResponse } from "../../common/utils/api.util.js";

// SERVICES //
import { getFeaturesService } from "./feature.service.js";

// LIBRARIES //
import { Hono } from "hono";
```

## Rules

- Always use `.js` extensions
- Always use `import type` for type-only imports
- Never mix type + runtime imports
- No default exports
- No wildcard imports
- No unused imports
- Do not change order of import groups

---

# Standard Response Shape

All responses must use `sendResponse()`.

```
{
  "data": <T> | null,
  "status": "success" | "error",
  "status_code": 200,
  "message": "Human readable message",
  "error": null | "Error detail string"
}
```

Rules:

- Always pass `null` data on error
- Always pass `null` error on success
- Never use `c.json()` directly

---

# Service Return Pattern (MANDATORY)

Services must always return:

```
QueryResponseData<T>
```

Structure:

```ts
{
  data: T | null,
  error: Error | null
}
```

Rules:

- Services NEVER throw
- Services ALWAYS catch errors
- Controllers decide HTTP status codes

---

# TypeScript Rules

- Strict mode enabled
- No `any`
- Always explicit return types
- Always use `interface`
- Always use `import type`
- Never generate CommonJS
- All exports must be named exports
- All functions must include JSDoc

---

# JSDoc Requirement

Every exported function must include:

```ts
/**
 * Short description
 * @param paramName - Description
 * @returns Description
 */
```

---

# Clean Code Rules

## 1. Function Rules

- One responsibility per function
- Max 25–30 lines per function
- Use early returns
- Avoid deep nesting
- Max 2 levels of conditional nesting

Good:

```ts
if (!result.data) {
  return sendResponse(c, null, 404, "Not found");
}
```

Bad:

```ts
if (result) {
  if (result.data) {
    ...
  }
}
```

---

## 2. File Size Limit

- Max 150 lines per file
- If exceeded → refactor

---

## 3. Naming Conventions

Variables:

- camelCase
- Descriptive names only

Functions:

Controller:

```
getFeatures
createFeature
updateFeature
deleteFeature
```

Service:

```
getFeaturesService
createFeatureService
```

Constants:

```
UPPER_SNAKE_CASE
```

---

## 4. No Magic Values

Never hardcode numbers or strings.

Use constants instead.

---

## 5. Supabase Rules

- All queries inside service only
- Always destructure `{ data, error }`
- Always check error
- Prefer explicit column selection over `select("*")`
- Never create supabase client inside module
- Use RLS for access control

---

## 6. Architectural Discipline

Never:

- Query DB in controller
- Access Hono Context inside service
- Throw errors from service
- Use classes
- Use global mutable state
- Mix business logic inside routes

---

# Error Handling

- Global error handler defined in `index.ts`
- `app.notFound()` handles 404
- Services return error in QueryResponseData
- Controllers map errors to HTTP codes
- Never expose raw DB error in production

---

# Security Rules

- Never log secrets
- Never expose environment variables
- Validate request body before calling service
- Never bypass Supabase RLS
- No hardcoded credentials

---

# Environment Variables

Defined in `.env`.

Always add new ones to `.env.example`.

Access using:

```
process.env.VARIABLE_NAME
```

---

# Dev Scripts

```
npm run dev
npm run build
npm run start
npm run lint
```

Lint must pass before commit (Husky enforced).

---

# Final Mandatory Rules Summary

Copilot must always:

- Follow Route → Controller → Service → Supabase
- Use QueryResponseData<T>
- Use sendResponse()
- Use explicit return types
- Use import grouping format
- Keep files under 150 lines
- Use interface, not type
- Use .js extensions in imports
- Never use any
- Never generate CommonJS
- Prefer small focused functions
- Prefer named exports
- Use early returns
- Never mix DB logic in controller
- Never access Context in service

---
