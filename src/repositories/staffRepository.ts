import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Staff } from '../entities/Staff';

export class StaffRepository {
  private repository: Repository<Staff>;

  constructor() {
    this.repository = AppDataSource.getRepository(Staff);
  }

  async create(data: Partial<Staff>): Promise<Staff> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Staff[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.user', 'user')
      .leftJoinAndSelect('staff.branch', 'branch');

    if (search && search.trim() !== '') {
      query = query.where(
        'user.name ILIKE :q OR staff.position ILIKE :q OR staff.shiftTiming ILIKE :q',
        { q: `%${search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('staff.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Staff | null> {
    return await this.repository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.user', 'user')
      .leftJoinAndSelect('staff.branch', 'branch')
      .where('staff.id = :id', { id })
      .getOne();
  }

  async findByUserInBranch(userId: string, branchId: string): Promise<Staff | null> {
    return await this.repository.findOne({
      where: { userId, branchId },
    });
  }

  async update(id: string, data: Partial<Staff>): Promise<Staff> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Staff not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Staff not found');
    }
    await this.repository.remove(entity);
  }

  async findActive(): Promise<Pick<Staff, 'id' | 'position'>[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'position'],
      relations: [],
    });
  }

  async toggleStatus(id: string): Promise<Staff> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Staff not found');
    }
    await this.repository.update(id, { isActive: !entity.isActive });
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Staff not found after status update');
    }
    return updated;
  }
}

