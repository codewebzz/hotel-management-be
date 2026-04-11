import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Customer } from '../entities/Customer';

export class CustomerRepository {
  private repository: Repository<Customer>;

  constructor() {
    this.repository = AppDataSource.getRepository(Customer);
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Customer[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.company', 'company')
      .leftJoinAndSelect('customer.address', 'address');

    if (search && search.trim() !== '') {
      query = query.where(
        'customer.name ILIKE :q OR customer.email ILIKE :q OR customer.phone ILIKE :q',
        { q: `%${search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('customer.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Customer | null> {
    return await this.repository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.company', 'company')
      .leftJoinAndSelect('customer.address', 'address')
      .where('customer.id = :id', { id })
      .getOne();
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return await this.repository.findOne({ where: { phone } });
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Customer not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Customer not found');
    }
    await this.repository.remove(entity);
  }

  async findActive(): Promise<Pick<Customer, 'id' | 'name'>[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'name'],
      relations: [],
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.repository.count({ where: { phone } });
    return count > 0;
  }

  async toggleStatus(id: string): Promise<Customer> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Customer not found');
    }
    await this.repository.update(id, { isActive: !entity.isActive });
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Customer not found after status update');
    }
    return updated;
  }
}
