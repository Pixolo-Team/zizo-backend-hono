// TYPES //
export interface IssueTicket {
  id: string;
  name: string;
  phone_number: string;
  description: string;
  created_at: Date;
}

export interface CreateIssueTicketDto {
  name: string;
  phone_number: string;
  description: string;
}
