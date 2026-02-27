// TYPES //
import type { QueryResponseData } from "../../common/types/query.response.type.js";
import type { Coach, CreateCoachBody } from "./coaches.types.js";

// CONFIG //
import { supabase } from "../../config/supabase.js";

// UTILS //
import { isValidEmail } from "../../common/utils/email.util.js";

/**
 * Creates a new coach in Supabase
 * @param body - Coach data containing name and email
 * @returns QueryResponseData containing the created Coach or an error
 */
export const createCoachService = async (
  body: CreateCoachBody,
): Promise<QueryResponseData<Coach>> => {
  try {
    if (!body.name?.trim() || !body.email?.trim()) {
      return { data: null, error: new Error("Name and email are required") };
    }

    if (!isValidEmail(body.email)) {
      return { data: null, error: new Error("Invalid email format") };
    }

    const { data, error } = await supabase
      .from("coaches")
      .insert({ name: body.name, email: body.email })
      .select("id, name, email, created_at")
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error("Unexpected error"),
    };
  }
};
