import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Brand } from '../entities/Brand';

export class BrandRepository {
  private repository: Repository<Brand>;

  constructor() {
    this.repository = AppDataSource.getRepository(Brand);
  }

  /**
   * Create a new brand
   */
  async create(brandData: Partial<Brand>): Promise<Brand> {
    const brand = this.repository.create(brandData);
    return await this.repository.save(brand);
  }

  /**
   * Find all brands with pagination and optional search
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Brand[]; total: number; page: number; limit: number }> {
    let query = this.repository.createQueryBuilder('brand')
      .leftJoinAndSelect('brand.address', 'address');

    if (search && search.trim()) {
      query = query.where('brand.name ILIKE :search', { search: `%${search}%` });
    }

    const [data, total] = await query
      .orderBy('brand.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  /**
   * Find brand by ID
   */
  async findById(id: string): Promise<Brand | null> {
    return await this.repository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.address', 'address')
      .where('brand.id = :id', { id })
      .getOne();
  }

  /**
   * Find brand by name
   */
  async findByName(name: string): Promise<Brand | null> {
    return await this.repository.findOne({ where: { name } });
  }

  /**
   * Find brand by email
   */
  async findByEmail(email: string): Promise<Brand | null> {
    return await this.repository.findOne({ where: { email } });
  }

  /**
   * Find brand by phone
   */
  async findByPhone(phone: string): Promise<Brand | null> {
    return await this.repository.findOne({ where: { phone } });
  }

  /**
   * Update brand
   */
  async update(id: string, brandData: Partial<Brand>): Promise<Brand> {
    await this.repository.update(id, brandData);
    const updatedBrand = await this.findById(id);
    if (!updatedBrand) {
      throw new Error('Brand not found after update');
    }
    return updatedBrand;
  }

  /**
   * Delete brand
   */
  async delete(id: string): Promise<void> {
    const brand = await this.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    await this.repository.remove(brand);
  }

  /**
   * Find all brands belonging to a specific company
   */
  async findByCompanyId(
    companyId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ data: Brand[]; total: number }> {
    const [data, total] = await this.repository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.address', 'address')
      .where('brand.companyId = :companyId', { companyId })
      .orderBy('brand.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total };
  }

  /**
   * Find active brands (for dropdown - returns only id and name)
   */
  async findActive(): Promise<Pick<Brand, 'id' | 'name'>[]> {
    return await this.repository
      .createQueryBuilder('brand')
      .select(['brand.id', 'brand.name'])
      .where('brand.isActive = :isActive', { isActive: true })
      .orderBy('brand.name', 'ASC')
      .getMany();
  }

  /**
   * Check if brand exists by name
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  /**
   * Check if brand exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  /**
   * Check if brand exists by phone
   */
  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.repository.count({ where: { phone } });
    return count > 0;
  }

  /**
   * Toggle brand status
   */
  async toggleStatus(id: string): Promise<Brand> {
    const brand = await this.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }

    brand.isActive = !brand.isActive;
    return await this.repository.save(brand);
  }
}

