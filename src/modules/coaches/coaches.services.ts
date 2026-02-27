// TYPES //
import type { QueryResponseData } from "../../common/types/query.response.type.js";
import type { Coach, CoachCreateData } from "./coaches.types.js";

// CONFIG //
import { supabase } from "../../config/supabase.js";

/**
 * Insert a new coach into the database
 * @param coachData - The coach data to insert
 * @returns Promise with QueryResponseData containing the created coach
 */
export const createCoachService = async (
  coachData: CoachCreateData,
): Promise<QueryResponseData<Coach>> => {
  try {
    const { data, error } = await supabase
      .from("coaches")
      .insert(coachData)
      .select("id, name, email, created_at")
      .single();

    if (error) {
      return {
        data: null,
        error: error as Error,
      };
    }

    return {
      data: data as Coach,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};
