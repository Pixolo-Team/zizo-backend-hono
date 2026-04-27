/**
 * Session entity returned from the database
 */
export interface Session {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  batch_id: string;
  venue_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  session_template_id: number | null;
  session_type: string;
  reporting_time: string | null;
  name: string;
  organization_id: string;
}

/**
 * Session member payload received from frontend
 */
export interface SessionMemberInputDto {
  organization_member_id: string;
  session_role: 'coach' | 'asst';
}

/**
 * Data required to create a Session
 */
export interface CreateSessionDto {
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  reporting_time?: string;
  batch_id: string;
  venue_id: string;
  session_type?: string;
  status?: string;
  session_members: SessionMemberInputDto[];
}

/**
 * Data required to edit a Session
 */
export interface EditSessionDto {
  name?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  reporting_time?: string;
  batch_id?: string;
  venue_id?: string;
  session_type?: string;
  status?: string;
  session_members?: SessionMemberInputDto[];
}
