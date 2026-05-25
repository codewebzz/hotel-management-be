import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { HousekeepingLog } from '../entities/HousekeepingLog';

export class HousekeepingLogRepository {
  private repository: Repository<HousekeepingLog>;

  constructor() {
    this.repository = AppDataSource.getRepository(HousekeepingLog);
  }

  async create(data: Partial<HousekeepingLog>): Promise<HousekeepingLog> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    branchId?: string
  ): Promise<{ data: HousekeepingLog[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('hk')
      .leftJoinAndSelect('hk.room', 'room')
      .leftJoinAndSelect('hk.staff', 'staff')
      .leftJoinAndSelect('hk.branch', 'branch');

    if (search && search.trim() !== '') {
      query = query.where(
        'room.roomNumber ILIKE :q OR staff.position ILIKE :q OR hk.status ILIKE :q',
        { q: `%${search}%` }
      );
    }

    if (branchId) {
      query = query.andWhere('hk.branchId = :branchId', { branchId });
    }

    const [data, total] = await query
      .orderBy('hk.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<HousekeepingLog | null> {
    return await this.repository
      .createQueryBuilder('hk')
      .leftJoinAndSelect('hk.room', 'room')
      .leftJoinAndSelect('hk.staff', 'staff')
      .leftJoinAndSelect('hk.branch', 'branch')
      .where('hk.id = :id', { id })
      .getOne();
  }

  async update(id: string, data: Partial<HousekeepingLog>): Promise<HousekeepingLog> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Housekeeping log not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Housekeeping log not found');
    }
    await this.repository.remove(entity);
  }
}
