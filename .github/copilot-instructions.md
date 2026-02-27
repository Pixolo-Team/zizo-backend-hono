# Copilot Instructions — zizo-backend-hono

This is a **Hono.js** REST API backend written in **TypeScript**, deployed on **Vercel**, and using **Supabase** as the database/auth layer.

This project follows **strict layered architecture and clean code discipline**.
Copilot must follow all rules defined in this file.

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
│   │   ├── utils/
│   │   └── constants/
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

- No DB logic in controller
- No HTTP logic in service
- No business logic in routes

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

Every file must follow this grouped import format and exact order.

```ts
// TYPES //
import type { Context } from "hono";
import type { Feature } from "./feature.types.js";

// CONFIG //
import { supabase } from "../../config/supabase.js";

// CONSTANTS //
import { EMAIL_REGEX } from "../../common/constants/regex.constants.js";

// UTILS //
import { isValidEmail } from "../../common/utils/email.util.js";

// SERVICES //
import { createFeatureService } from "./feature.service.js";

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
- Do not change order of groups

---

# Utility & Constants Architecture (MANDATORY)

## No Inline Regex, Constants, or Helper Functions

Never define:

- Regex
- Validation helpers
- Formatting helpers
- Parsing helpers
- Magic numbers
- Reusable constants

inside:

- Routes
- Controllers
- Services

---

## Utilities Location

Reusable logic must live in:

```
src/common/utils/
```

Examples:

- email.util.ts
- validation.util.ts
- string.util.ts
- date.util.ts

---

## Constants Location

All constants must live in:

```
src/common/constants/
```

Examples:

- regex.constants.ts
- pagination.constants.ts
- app.constants.ts

---

## Example (Correct Email Validation Pattern)

### regex.constants.ts

```ts
export const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### email.util.ts

```ts
// CONSTANTS //
import { EMAIL_REGEX } from "../constants/regex.constants.js";

/**
 * Validates email format
 * @param email - Email string
 * @returns boolean
 */
export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};
```

### Service Usage

```ts
// UTILS //
import { isValidEmail } from "../../common/utils/email.util.js";
```

Never place regex inside service.

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

- Pass `null` data on error
- Pass `null` error on success
- Never use `c.json()` directly

---

# Service Return Pattern (MANDATORY)

Services must return:

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
- Controllers decide HTTP status
- Services must not access Context

---

# TypeScript Rules

- Strict mode enabled
- No `any`
- Always explicit return types
- Always use `interface`
- Always use `import type`
- Never generate CommonJS
- Named exports only
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
- Early returns preferred
- Max 2 nesting levels

---

## 2. File Size Limit

- Max 150 lines per file
- Refactor if exceeded

---

## 3. Naming Conventions

Variables:

- camelCase
- Descriptive names only

Functions:

Controller:

```
getCoaches
createCoach
updateCoach
deleteCoach
```

Service:

```
getCoachesService
createCoachService
```

Constants:

```
UPPER_SNAKE_CASE
```

---

## 4. No Magic Values

Never hardcode:

- Regex
- Numbers
- Reused strings
- Limits
- Status messages

Move to `common/constants`.

---

# Supabase Rules

- Queries only inside service
- Always destructure `{ data, error }`
- Always check error
- Prefer explicit column selection
- Never create supabase client inside module
- Use RLS for security

---

# Architectural Discipline

Never:

- Query DB in controller
- Access Context in service
- Throw errors in service
- Define regex inside service
- Define helper functions inside controller
- Use classes
- Use global mutable state

---

# Error Handling

- Global error handler in `index.ts`
- `app.notFound()` for 404
- Services return error via QueryResponseData
- Controllers map error to HTTP response
- Do not expose raw DB errors in production

---

# Security Rules

- Never log secrets
- Never expose env variables
- Validate input before DB call
- Do not bypass RLS
- No hardcoded credentials

---

# Environment Variables

Defined in `.env`.

Must also be added to `.env.example`.

Access via:

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
- Extract reusable logic into common/utils
- Extract constants into common/constants
- Never define regex inside services
- Keep files under 150 lines
- Use interface (not type)
- Use .js extensions
- Never use any
- Never generate CommonJS
- Prefer named exports
- Use early returns
- Never mix DB logic in controller
- Never access Context in service

---
