export interface GetPlayersQueryDto {
  organizationId: string;
  ageGroup?: string;
  search?: string;
  status?: string;
}

export interface PlayerListItem {
  playerId: string;
  name: string;
  profilePhotoUrl: string | null;
  organizationId: string;
  identificationCode: string | null;
  status: string | null;
}

export interface OrganizationPlayerUserRecord {
  first_name: string | null;
  last_name: string | null;
  profile_photo_url: string | null;
}

export interface OrganizationPlayerNestedRecord {
  id: string;
  user: OrganizationPlayerUserRecord | OrganizationPlayerUserRecord[] | null;
}

export interface OrganizationPlayerRow {
  organization_id: string;
  player_id: string;
  identification_code: string | null;
  status: string | null;
  player: OrganizationPlayerNestedRecord | OrganizationPlayerNestedRecord[] | null;
}

export type GetPlayersErrorCode = 'FORBIDDEN' | 'DATABASE_ERROR';

export interface GetPlayersServiceResult {
  data: PlayerListItem[] | null;
  error: Error | null;
  errorCode?: GetPlayersErrorCode;
}
