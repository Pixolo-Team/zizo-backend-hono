// TYPES //
import type { Coach, CreateCoachBody } from "./coaches.types.js";
import type { QueryResponseData } from "../../common/types/query.response.type.js";

// CONFIG //
import { supabase } from "../../config/supabase.js";

/**
 * Inserts a new coach record into the database.
 * @param body - The coach data containing name and email
 * @returns QueryResponseData with the created coach or an error
 */
export const createCoachService = async (
  body: CreateCoachBody,
): Promise<QueryResponseData<Coach>> => {
  const { data, error } = await supabase
    .from("coaches")
    .insert(body)
    .select("id, name, email, created_at")
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data, error: null };
};
