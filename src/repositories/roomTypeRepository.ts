import { Repository, EntityManager } from 'typeorm';
import { AppDataSource } from '../config/database';
import { RoomType } from '../entities/RoomType';

export class RoomTypeRepository {
  private repository: Repository<RoomType>;

  constructor() {
    this.repository = AppDataSource.getRepository(RoomType);
  }

  async create(data: Partial<RoomType>, manager?: EntityManager): Promise<RoomType> {
    const repo = manager ? manager.getRepository(RoomType) : this.repository;
    const entity = repo.create(data);
    return await repo.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    branchId?: string
  ) {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('roomType')
      .leftJoinAndSelect('roomType.branch', 'branch')
      .leftJoinAndSelect('roomType.roomTypeAmenities', 'roomTypeAmenities')
      .leftJoinAndSelect('roomTypeAmenities.amenity', 'amenity');

    if (search && search.trim() !== '') {
      query = query.where('roomType.name ILIKE :q', { q: `%${search}%` });
    }

    if (branchId) {
      query = query.andWhere('roomType.branchId = :branchId', { branchId });
    }

    const [data, total] = await query
      .orderBy('roomType.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<RoomType | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ['branch', 'roomTypeAmenities', 'roomTypeAmenities.amenity'],
    });
  }

  async findByName(name: string): Promise<RoomType | null> {
    return await this.repository.findOne({ where: { name } });
  }

  async update(id: string, data: Partial<RoomType>, manager?: EntityManager): Promise<RoomType> {
    const repo = manager ? manager.getRepository(RoomType) : this.repository;
    await repo.update(id, data);
    const updated = await this.findById(id);
    if (!updated) throw new Error('RoomType not found after update');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) throw new Error('RoomType not found');
    await this.repository.remove(entity);
  }

  async findActive(): Promise<Pick<RoomType, 'id' | 'name'>[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'name'],
      relations: [],
    });
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  async toggleStatus(id: string): Promise<RoomType> {
    const rt = await this.findById(id);
    if (!rt) throw new Error('RoomType not found');
    await this.repository.update(id, { isActive: !rt.isActive });
    const updated = await this.findById(id);
    if (!updated) throw new Error('RoomType not found after status update');
    return updated;
  }
}
