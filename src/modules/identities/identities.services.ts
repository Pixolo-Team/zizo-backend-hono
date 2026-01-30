// IDENTITY TYPE FILE //
import type { Identity, QueryResponseData } from '@/modules/identities/identities.types.js';

// OTHERS //
import { supabase } from '@/config/supabase.js';

// GET ALL IDENTITIES //
export const getIdentitiesService = async (): Promise<
  QueryResponseData<Identity[]>
> => {
  try {
    const { data, error } = await supabase
      .from('identities')
      .select('*')

    if (error) {
      throw error
    }

    return {
      data: data as Identity[],
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error: error as Error
    }
  }
}