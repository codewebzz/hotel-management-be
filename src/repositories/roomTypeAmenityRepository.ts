import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { RoomTypeAmenity } from '../entities/RoomTypeAmenity';

export class RoomTypeAmenityRepository {
  private repository: Repository<RoomTypeAmenity>;

  constructor() {
    this.repository = AppDataSource.getRepository(RoomTypeAmenity);
  }

  async create(data: Partial<RoomTypeAmenity>): Promise<RoomTypeAmenity> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: RoomTypeAmenity[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('roomTypeAmenity')
      .leftJoinAndSelect('roomTypeAmenity.roomType', 'roomType')
      .leftJoinAndSelect('roomTypeAmenity.amenity', 'amenity');

    if (search && search.trim() !== '') {
      query = query.where(
        'roomType.name ILIKE :q OR amenity.name ILIKE :q',
        { q: `%${search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('roomTypeAmenity.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<RoomTypeAmenity | null> {
    return await this.repository
      .createQueryBuilder('roomTypeAmenity')
      .leftJoinAndSelect('roomTypeAmenity.roomType', 'roomType')
      .leftJoinAndSelect('roomTypeAmenity.amenity', 'amenity')
      .where('roomTypeAmenity.id = :id', { id })
      .getOne();
  }

  async findByRoomTypeAndAmenity(
    roomTypeId: string,
    amenityId: string
  ): Promise<RoomTypeAmenity | null> {
    return await this.repository.findOne({
      where: { roomTypeId, amenityId },
    });
  }

  async update(
    id: string,
    data: Partial<RoomTypeAmenity>
  ): Promise<RoomTypeAmenity> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('RoomTypeAmenity not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('RoomTypeAmenity not found');
    }
    await this.repository.remove(entity);
  }

  async findActive(): Promise<Pick<RoomTypeAmenity, 'id' | 'roomTypeId' | 'amenityId'>[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'roomTypeId', 'amenityId'],
      relations: [],
    });
  }

  async toggleStatus(id: string): Promise<RoomTypeAmenity> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('RoomTypeAmenity not found');
    }
    await this.repository.update(id, { isActive: !entity.isActive });
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('RoomTypeAmenity not found after status update');
    }
    return updated;
  }
}
