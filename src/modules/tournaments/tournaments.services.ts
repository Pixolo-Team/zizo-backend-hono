// TYPE FILES //
import { QueryResponseData } from '@/common/types/query.response.type.js';
import { Tournament } from './tournaments.types.js';

// OTHERS //
import { supabase } from '@/config/supabase.js';


// GET ALL TOURNAMENTS //
export const getTournamentsService = async (): Promise<
  QueryResponseData<Tournament[]>
> => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')

    if (error) {
      throw error
    }

    return {
      data: data as Tournament[],
      error: null
    }
  } catch (error) {
    return {
      data: null,
      error: error as Error
    }
  }
}