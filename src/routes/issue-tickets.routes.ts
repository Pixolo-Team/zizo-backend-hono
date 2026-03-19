// CONTRACTS //
import { raiseIssueTicketRoute } from '@/contracts/issue-tickets.contract';

// CONTROLLER //
import { issueTicketsController } from '@/controllers';

// ROUTES //
import { openapiApp } from '@/routes/openapi.routes';

// POST: /issue_tickets/raise
openapiApp.openapi(raiseIssueTicketRoute, (c) => issueTicketsController.raiseTicket(c));
