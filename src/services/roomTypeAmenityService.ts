import { RoomTypeAmenityRepository } from '../repositories/roomTypeAmenityRepository';
import { RoomTypeAmenity } from '../entities/RoomTypeAmenity';
import { AppDataSource } from '../config/database';

export class RoomTypeAmenityService {
  private repo: RoomTypeAmenityRepository;

  constructor() {
    this.repo = new RoomTypeAmenityRepository();
  }

  async createRoomTypeAmenity(data: {
    roomTypeId: string;
    amenityId: string;
  }): Promise<RoomTypeAmenity> {
    const existingMapping = await this.repo.findByRoomTypeAndAmenity(
      data.roomTypeId,
      data.amenityId
    );
    if (existingMapping) {
      throw new Error('RoomTypeAmenity with this roomType and amenity already exists');
    }

    const roomTypeRepository = AppDataSource.getRepository('RoomType');
    const roomType = await roomTypeRepository.findOne({
      where: { id: data.roomTypeId },
    });
    if (!roomType) {
      throw new Error('RoomType not found');
    }

    const amenityRepository = AppDataSource.getRepository('Amenity');
    const amenity = await amenityRepository.findOne({
      where: { id: data.amenityId },
    });
    if (!amenity) {
      throw new Error('Amenity not found');
    }

    const entity = await this.repo.create({
      roomTypeId: data.roomTypeId,
      amenityId: data.amenityId,
      isActive: true,
    });

    return entity;
  }

  async getAllRoomTypeAmenitiesPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    data: RoomTypeAmenity[];
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

  async getRoomTypeAmenityById(id: string): Promise<RoomTypeAmenity> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new Error('RoomTypeAmenity not found');
    }
    return entity;
  }

  async updateRoomTypeAmenity(
    id: string,
    data: { roomTypeId?: string; amenityId?: string; isActive?: boolean }
  ): Promise<RoomTypeAmenity> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('RoomTypeAmenity not found');
    }

    const nextRoomTypeId = data.roomTypeId ?? existing.roomTypeId;
    const nextAmenityId = data.amenityId ?? existing.amenityId;

    if (data.roomTypeId || data.amenityId) {
      const roomTypeRepository = AppDataSource.getRepository('RoomType');
      const roomType = await roomTypeRepository.findOne({
        where: { id: nextRoomTypeId },
      });
      if (!roomType) {
        throw new Error('RoomType not found');
      }

      const amenityRepository = AppDataSource.getRepository('Amenity');
      const amenity = await amenityRepository.findOne({
        where: { id: nextAmenityId },
      });
      if (!amenity) {
        throw new Error('Amenity not found');
      }

      const duplicate = await this.repo.findByRoomTypeAndAmenity(
        nextRoomTypeId,
        nextAmenityId
      );
      if (duplicate && duplicate.id !== id) {
        throw new Error('RoomTypeAmenity with this roomType and amenity already exists');
      }
    }

    const updateData: Partial<RoomTypeAmenity> = {};
    if (data.roomTypeId !== undefined) {
      updateData.roomTypeId = data.roomTypeId;
    }
    if (data.amenityId !== undefined) {
      updateData.amenityId = data.amenityId;
    }
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    return await this.repo.update(id, updateData);
  }

  async deleteRoomTypeAmenity(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getActiveRoomTypeAmenities(): Promise<Pick<RoomTypeAmenity, 'id' | 'roomTypeId' | 'amenityId'>[]> {
    return await this.repo.findActive();
  }

  async toggleRoomTypeAmenityStatus(id: string): Promise<RoomTypeAmenity> {
    return await this.repo.toggleStatus(id);
  }
}
