// TYPES //
import type { Identity } from "./identities.types.js";
import { QueryResponseData } from "../../common/types/query.response.type.js";

// OTHERS //
import { supabase } from "../../config/supabase.js";

/**
 * Get all the Identities from the Databae
 * @returns Promise with QueryResponseData
 */
export const getIdentitiesService = async (): Promise<
  QueryResponseData<Identity[]>
> => {
  try {
    const { data, error } = await supabase.from("identities").select("*");

    if (error) {
      throw error;
    }

    return {
      data: data as Identity[],
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
    };
  }
};
