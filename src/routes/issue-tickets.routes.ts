// CONTROLLER //
import { issueTicketsController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';
import { RaiseIssueTicketRoute } from '@/contracts/issue-tickets.contracts';

// POST: /issue_tickets/raise
openapiApp.openapi(RaiseIssueTicketRoute, (c) => issueTicketsController.raiseTicket(c));
