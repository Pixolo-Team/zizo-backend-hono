// MODELS //
import {} from '@/models';

// UTILS //
import { logger } from '@/common/utils/logger.util';

// MODELS //
import { Organizer } from '@/models/organizer.model';

/**
 * Organizer Service - Business logic for user operations
 */
export class OrganizerService {
  /**
   * Get all Organizers
   */
  async getOrganizersService(): Promise<Organizer[]> {
    logger.debug('Fetching all Organizers');
    return [];
  }
}

export const organizerService = new OrganizerService();
