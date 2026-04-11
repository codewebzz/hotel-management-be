import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { RoomType } from '../entities/RoomType';

export class RoomTypeRepository {
  private repository: Repository<RoomType>;

  constructor() {
    this.repository = AppDataSource.getRepository(RoomType);
  }

  async create(data: Partial<RoomType>): Promise<RoomType> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(page: number = 1, limit: number = 10, search?: string) {
    const offset = (page - 1) * limit;

    if (search && search.trim() !== '') {
      const [data, total] = await this.repository
        .createQueryBuilder('roomType')
        .leftJoinAndSelect('roomType.branch', 'branch')
        .where('roomType.name ILIKE :q', { q: `%${search}%` })
        .orderBy('roomType.createdAt', 'DESC')
        .skip(offset)
        .take(limit)
        .getManyAndCount();
      return { data, total, page, limit };
    }

    const [data, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
      relations: ['branch'],
    });

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<RoomType | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<RoomType | null> {
    return await this.repository.findOne({ where: { name } });
  }

  async update(id: string, data: Partial<RoomType>): Promise<RoomType> {
    await this.repository.update(id, data);
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
