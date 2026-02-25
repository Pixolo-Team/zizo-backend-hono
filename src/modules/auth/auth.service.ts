/**
 * ---------------------------------------------------------
 * AUTH SERVICE
 * ---------------------------------------------------------
 * Purpose:
 * Contains the core business logic for authentication.
 *
 * Responsibilities:
 * - Communicate with Supabase Auth
 * - Handle login and registration logic
 * - Apply business rules (roles, onboarding, validation)
 * - Manage authentication-related processes
 *
 * Important:
 * - Should NOT handle HTTP responses
 * - Should NOT define routes
 * - Should only focus on business logic
 *
 * Flow:
 * Service → Supabase → Return Result
 * ---------------------------------------------------------
 */
