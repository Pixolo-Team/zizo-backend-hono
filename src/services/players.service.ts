import { supabase } from '@/config/supabase';
import { tables } from '@/constants/database.constants';
import { logger } from '@/common/utils/logger.util';
import type {
  GetPlayersQueryDto,
  GetPlayersServiceResult,
  OrganizationPlayerNestedRecord,
  OrganizationPlayerRow,
  OrganizationPlayerUserRecord,
  PlayerListItem,
} from '@/models/players.model';

const allowedRoles = new Set(['admin', 'manager']);

const normalizeSingleRecord = <T>(value: T | T[] | null): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
};

const buildPlayerName = (user: OrganizationPlayerUserRecord | null): string => {
  if (!user) {
    return 'Unknown Player';
  }

  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'Unknown Player';
};

const mapOrganizationPlayerRow = (row: OrganizationPlayerRow): PlayerListItem => {
  const player = normalizeSingleRecord<OrganizationPlayerNestedRecord>(row.player);
  const user = normalizeSingleRecord<OrganizationPlayerUserRecord>(player?.user ?? null);

  return {
    playerId: row.player_id,
    name: buildPlayerName(user),
    profilePhotoUrl: user?.profile_photo_url ?? null,
    organizationId: row.organization_id,
    identificationCode: row.identification_code,
    status: row.status,
  };
};

const matchesSearch = (player: PlayerListItem, searchTerm: string): boolean => {
  const normalizedSearch = searchTerm.toLowerCase();

  return (
    player.name.toLowerCase().includes(normalizedSearch) ||
    (player.identificationCode ?? '').toLowerCase().includes(normalizedSearch)
  );
};

const resolveOrganizationPlayersTable = async (): Promise<string> => {
  const preferredTable = tables.ORG_PLAYERS;
  const fallbackTable = tables.ORG_PLAYER;

  const preferredResult = await supabase
    .from(preferredTable)
    .select('player_id', { count: 'exact', head: true });

  if (!preferredResult.error) {
    return preferredTable;
  }

  logger.warn(`Falling back to '${fallbackTable}' because '${preferredTable}' is unavailable`, preferredResult.error);
  return fallbackTable;
};

const hasOrganizationAccess = async (authId: string, organizationId: string): Promise<{
  allowed: boolean;
  error: Error | null;
}> => {
  const { data: membership, error: membershipError } = await supabase
    .from(tables.ORG_MEMBERS)
    .select('id')
    .eq('organization_id', organizationId)
    .eq('user_id', authId)
    .maybeSingle();

  if (membershipError) {
    logger.error('Failed to verify organization membership:', membershipError);
    return { allowed: false, error: new Error(membershipError.message) };
  }

  if (!membership) {
    return { allowed: false, error: null };
  }

  const { data: roles, error: rolesError } = await supabase
    .from(tables.ORG_MEMBER_ROLE)
    .select(`
      member_role:member_roles (
        name
      )
    `)
    .eq('organization_member_id', membership.id);

  if (rolesError) {
    logger.error('Failed to fetch organization member roles:', rolesError);
    return { allowed: false, error: new Error(rolesError.message) };
  }

  const hasRequiredRole = (roles ?? []).some((roleEntry) => {
    const role = normalizeSingleRecord<{ name: string | null }>(
      (roleEntry as { member_role?: { name: string | null } | { name: string | null }[] | null }).member_role ?? null
    );

    return !!role?.name && allowedRoles.has(role.name.toLowerCase());
  });

  return { allowed: hasRequiredRole, error: null };
};

export const getPlayersService = async (
  authId: string,
  query: GetPlayersQueryDto
): Promise<GetPlayersServiceResult> => {
  try {
    const accessCheck = await hasOrganizationAccess(authId, query.organizationId);

    if (accessCheck.error) {
      return { data: null, error: accessCheck.error, errorCode: 'DATABASE_ERROR' };
    }

    if (!accessCheck.allowed) {
      return {
        data: null,
        error: new Error('User does not have permission to access this organization'),
        errorCode: 'FORBIDDEN',
      };
    }

    const organizationPlayersTable = await resolveOrganizationPlayersTable();

    let playersQuery = supabase
      .from(organizationPlayersTable)
      .select(`
        organization_id,
        player_id,
        identification_code,
        status,
        player:players!inner (
          id,
          user:users!inner (
            first_name,
            last_name,
            profile_photo_url
          )
        )
      `)
      .eq('organization_id', query.organizationId);

    if (query.status) {
      playersQuery = playersQuery.ilike('status', query.status);
    }

    // ageGroup is accepted for forward compatibility but is not applied yet
    // because there is no age-group column in the current player listing schema.
    const { data, error } = await playersQuery.order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch organization players:', error);
      return { data: null, error: new Error('Database query failed'), errorCode: 'DATABASE_ERROR' };
    }

    const formattedPlayers = ((data ?? []) as OrganizationPlayerRow[]).map(mapOrganizationPlayerRow);
    const filteredPlayers = query.search
      ? formattedPlayers.filter((player) => matchesSearch(player, query.search as string))
      : formattedPlayers;

    return {
      data: filteredPlayers,
      error: null,
    };
  } catch (err) {
    logger.error('Unexpected error in getPlayersService:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('Unexpected error'),
      errorCode: 'DATABASE_ERROR',
    };
  }
};
