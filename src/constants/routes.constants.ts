/* eslint-disable no-unused-vars */
export enum ApiRoutes {
  // Auth
  LOGIN = '/auth/login',
  VERIFY_OTP = '/auth/verify-otp',

  // Invites
  GET_USER_INVITES = '/invites/get-user-invites',
  CREATE_INVITE = '/invites/create',

  // Issue Tickets
  RAISE_ISSUE = '/issue_tickets/raise',

  // Health
  HEALTH_CHECK = '/health' 
}