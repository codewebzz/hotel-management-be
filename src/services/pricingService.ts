import { PricingRepository } from '../repositories/pricingRepository';
import { Pricing } from '../entities/Pricing';
import { AppDataSource } from '../config/database';

export class PricingService {
  private repo: PricingRepository;

  constructor() {
    this.repo = new PricingRepository();
  }

  async createPricing(data: {
    roomTypeId: string;
    basePrice: number;
    seasonName: string;
    startDate: string;
    endDate: string;
  }): Promise<Pricing> {
    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new Error('startDate must be before or equal to endDate');
    }

    const existing = await this.repo.findByUniqueKey(
      data.roomTypeId,
      data.seasonName,
      data.startDate,
      data.endDate
    );
    if (existing) {
      throw new Error(
        'Pricing with this roomType, season and date range already exists'
      );
    }

    const roomTypeRepository = AppDataSource.getRepository('RoomType');
    const roomType = await roomTypeRepository.findOne({
      where: { id: data.roomTypeId },
    });
    if (!roomType) {
      throw new Error('RoomType not found');
    }

    const pricing = await this.repo.create({
      roomTypeId: data.roomTypeId,
      basePrice: data.basePrice,
      seasonName: data.seasonName,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: true,
    });

    return pricing;
  }

  async getAllPricingsPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    data: Pricing[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const result = await this.repo.findAllPaginated(page, limit, search);
    return {
      ...result,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async getPricingById(id: string): Promise<Pricing> {
    const pricing = await this.repo.findById(id);
    if (!pricing) {
      throw new Error('Pricing not found');
    }
    return pricing;
  }

  async updatePricing(
    id: string,
    data: {
      roomTypeId?: string;
      basePrice?: number;
      seasonName?: string;
      startDate?: string;
      endDate?: string;
      isActive?: boolean;
    }
  ): Promise<Pricing> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Pricing not found');
    }

    const nextRoomTypeId = data.roomTypeId ?? existing.roomTypeId;
    const nextSeasonName = data.seasonName ?? existing.seasonName;
    const nextStartDate = data.startDate ?? existing.startDate;
    const nextEndDate = data.endDate ?? existing.endDate;

    if (new Date(nextStartDate) > new Date(nextEndDate)) {
      throw new Error('startDate must be before or equal to endDate');
    }

    if (
      nextRoomTypeId !== existing.roomTypeId ||
      nextSeasonName !== existing.seasonName ||
      nextStartDate !== existing.startDate ||
      nextEndDate !== existing.endDate
    ) {
      const duplicate = await this.repo.findByUniqueKey(
        nextRoomTypeId,
        nextSeasonName,
        nextStartDate,
        nextEndDate
      );
      if (duplicate && duplicate.id !== id) {
        throw new Error(
          'Pricing with this roomType, season and date range already exists'
        );
      }
    }

    if (data.roomTypeId) {
      const roomTypeRepository = AppDataSource.getRepository('RoomType');
      const roomType = await roomTypeRepository.findOne({
        where: { id: data.roomTypeId },
      });
      if (!roomType) {
        throw new Error('RoomType not found');
      }
    }

    const updateData: Partial<Pricing> = {
      roomTypeId: data.roomTypeId,
      basePrice: data.basePrice,
      seasonName: data.seasonName,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
    };

    return await this.repo.update(id, updateData);
  }

  async deletePricing(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getActivePricings(): Promise<
    Pick<Pricing, 'id' | 'seasonName' | 'basePrice'>[]
  > {
    return await this.repo.findActive();
  }

  async togglePricingStatus(id: string): Promise<Pricing> {
    return await this.repo.toggleStatus(id);
  }
}

