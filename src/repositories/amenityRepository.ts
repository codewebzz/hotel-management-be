import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Amenity } from '../entities/Amenity';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class AmenityRepository {
  private repository: Repository<Amenity>;

  constructor() {
    this.repository = AppDataSource.getRepository(Amenity);
  }

  /**
   * Create a new amenity
   */
  async create(amenityData: Partial<Amenity>): Promise<Amenity> {
    const amenity = this.repository.create(amenityData);
    return await this.repository.save(amenity);
  }

  /**
   * Find all amenities with pagination
   */
  async findAll(options?: PaginationOptions): Promise<PaginatedResult<Amenity>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find all amenities without pagination
   */
  async findAllWithoutPagination(): Promise<Amenity[]> {
    return await this.repository.find({
      order: { createdAt: 'DESC' },
      select: ['id', 'name'],
    });
  }

  /**
   * Find amenity by ID
   */
  async findById(id: string): Promise<Amenity | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * Find amenity by name
   */
  async findByName(name: string): Promise<Amenity | null> {
    return await this.repository.findOne({ where: { name } });
  }

  /**
   * Update amenity
   */
  async update(id: string, amenityData: Partial<Amenity>): Promise<Amenity> {
    await this.repository.update(id, amenityData);
    const updatedAmenity = await this.findById(id);
    if (!updatedAmenity) {
      throw new Error('Amenity not found after update');
    }
    return updatedAmenity;
  }

  /**
   * Delete amenity
   */
  async delete(id: string): Promise<void> {
    const amenity = await this.findById(id);
    if (!amenity) {
      throw new Error('Amenity not found');
    }
    await this.repository.remove(amenity);
  }

  /**
   * Search amenities by name with pagination
   */
  async searchByName(query: string, options?: PaginationOptions): Promise<PaginatedResult<Amenity>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      where: {
        name: query,
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Check if amenity exists by name
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }
}

