/**
 * Centralized database table name constants
 * Use these instead of hardcoded strings in Supabase queries
 */
export const tables = {
  USERS: 'users',
  ORGS: 'organizations',
  ORG_MEMBERS: 'organization_members',
  ORG_MEMBER_ROLE: 'organization_member_role',
  MEMBER_ROLES: 'member_roles',
  ORG_INVITES: 'organization_invites',
  PLAYERS: 'players',
  PLAYER_GUARDIANS: 'player_guardians',
  ORG_PLAYER: 'organization_player',
  SESSIONS: 'sessions',
  SESSION_MEMBER: 'session_member',
  SESSION_PLAYER_ATTENDANCE: 'session_player_attendance',
  SESSION_MEMBER_ATTENDANCE: 'session_member_attendance',
  BATCHES: 'batches',
  BATCH_PLAYER: 'batch_player',
  BATCH_MEMBER: 'batch_member',
  SESSIONS_TEMPLATE: 'sessions_template',
  ISSUE_TICKETS: 'issue_tickets',
} as const;
