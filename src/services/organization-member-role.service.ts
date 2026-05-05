import { logger } from '@/common/utils/logger.util';
import { supabase } from '@/config/supabase';
import { tables } from '@/constants/database.constants';

type RoleAccessResult = {
  allowed: boolean;
  error: Error | null;
};

type OrganizationMemberRoleAccessResult = RoleAccessResult & {
  organizationMemberId: string | null;
};

export const getOrganizationMemberRoleAccess = async (
  organizationId: string,
  authId: string,
  allowedRoleNames: string[]
): Promise<OrganizationMemberRoleAccessResult> => {
  const { data: organizationMember, error: organizationMemberError } = await supabase
    .from(tables.ORG_MEMBERS)
    .select('id')
    .eq('organization_id', organizationId)
    .eq('auth_id', authId)
    .maybeSingle();

  if (organizationMemberError) {
    logger.error('Failed to fetch organization member for role access check:', organizationMemberError);
    return { allowed: false, organizationMemberId: null, error: new Error(organizationMemberError.message) };
  }

  if (!organizationMember) {
    return { allowed: false, organizationMemberId: null, error: null };
  }

  const allowedRoleNamesSet = new Set(allowedRoleNames.map((roleName) => roleName.trim().toLowerCase()));

  const { data: memberRoles, error: memberRolesError } = await supabase
    .from(tables.MEMBER_ROLES)
    .select('id, name');

  if (memberRolesError) {
    logger.error('Failed to fetch member roles for role access check:', memberRolesError);
    return {
      allowed: false,
      organizationMemberId: organizationMember.id,
      error: new Error(memberRolesError.message),
    };
  }

  const allowedRoleIds = new Set(
    (memberRoles ?? [])
      .filter((role) => allowedRoleNamesSet.has(role.name.trim().toLowerCase()))
      .map((role) => role.id)
  );

  if (allowedRoleIds.size === 0) {
    return { allowed: false, organizationMemberId: organizationMember.id, error: null };
  }

  const { data: assignedRoles, error: assignedRolesError } = await supabase
    .from(tables.ORG_MEMBER_ROLE)
    .select('member_role_id')
    .eq('organization_member_id', organizationMember.id);

  if (assignedRolesError) {
    logger.error('Failed to fetch organization member role assignments for role access check:', assignedRolesError);
    return {
      allowed: false,
      organizationMemberId: organizationMember.id,
      error: new Error(assignedRolesError.message),
    };
  }

  const allowed = (assignedRoles ?? []).some((assignment) => allowedRoleIds.has(assignment.member_role_id));

  return { allowed, organizationMemberId: organizationMember.id, error: null };
};

export const hasOrganizationMemberRoleAccess = async (
  organizationId: string,
  authId: string,
  allowedRoleNames: string[]
): Promise<RoleAccessResult> => {
  const { allowed, error } = await getOrganizationMemberRoleAccess(organizationId, authId, allowedRoleNames);
  return { allowed, error };
};
