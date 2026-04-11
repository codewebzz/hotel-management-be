import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Pricing } from '../entities/Pricing';

export class PricingRepository {
  private repository: Repository<Pricing>;

  constructor() {
    this.repository = AppDataSource.getRepository(Pricing);
  }

  async create(data: Partial<Pricing>): Promise<Pricing> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Pricing[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('pricing')
      .leftJoinAndSelect('pricing.roomType', 'roomType');

    if (search && search.trim() !== '') {
      query = query.where(
        'pricing.seasonName ILIKE :q OR roomType.name ILIKE :q',
        { q: `%${search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('pricing.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Pricing | null> {
    return await this.repository
      .createQueryBuilder('pricing')
      .leftJoinAndSelect('pricing.roomType', 'roomType')
      .where('pricing.id = :id', { id })
      .getOne();
  }

  async findByUniqueKey(
    roomTypeId: string,
    seasonName: string,
    startDate: string,
    endDate: string
  ): Promise<Pricing | null> {
    return await this.repository.findOne({
      where: { roomTypeId, seasonName, startDate, endDate },
    });
  }

  async update(id: string, data: Partial<Pricing>): Promise<Pricing> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Pricing not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Pricing not found');
    }
    await this.repository.remove(entity);
  }

  async findActive(): Promise<Pick<Pricing, 'id' | 'seasonName' | 'basePrice'>[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'seasonName', 'basePrice'],
      relations: [],
    });
  }

  async toggleStatus(id: string): Promise<Pricing> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Pricing not found');
    }
    await this.repository.update(id, { isActive: !entity.isActive });
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Pricing not found after status update');
    }
    return updated;
  }
}

