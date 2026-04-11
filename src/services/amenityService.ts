import { AmenityRepository, PaginationOptions, PaginatedResult } from '../repositories/amenityRepository';
import { Amenity } from '../entities/Amenity';

export class AmenityService {
  private amenityRepository: AmenityRepository;

  constructor() {
    this.amenityRepository = new AmenityRepository();
  }

  /**
   * Create a new amenity
   */
  async createAmenity(amenityData: {
    name: string;
    description?: string;
    icon?: string;
  }): Promise<Amenity> {
    // Check if amenity name already exists
    const existingAmenity = await this.amenityRepository.findByName(amenityData.name);
    if (existingAmenity) {
      throw new Error('Amenity with this name already exists');
    }

    const amenity = await this.amenityRepository.create({
      ...amenityData,
      isActive: true,
    });

    return amenity;
  }

  /**
   * Get all amenities with pagination
   */
  async getAllAmenities(options?: PaginationOptions): Promise<PaginatedResult<Amenity>> {
    return await this.amenityRepository.findAll(options);
  }

  /**
   * Get all amenities without pagination
   */
  async getAllAmenitiesWithoutPagination(): Promise<Amenity[]> {
    return await this.amenityRepository.findAllWithoutPagination();
  }

  /**
   * Get amenity by ID
   */
  async getAmenityById(id: string): Promise<Amenity> {
    const amenity = await this.amenityRepository.findById(id);
    if (!amenity) {
      throw new Error('Amenity not found');
    }
    return amenity;
  }

  /**
   * Update amenity (excluding icon)
   */
  async updateAmenity(
    id: string,
    updateData: {
      name?: string;
      description?: string;
      isActive?: boolean;
      icon?: string;
    }
  ): Promise<Amenity> {
    // Check if amenity exists
    const existingAmenity = await this.amenityRepository.findById(id);
    if (!existingAmenity) {
      throw new Error('Amenity not found');
    }

    // If name is being updated, check if new name already exists
    if (updateData.name && updateData.name !== existingAmenity.name) {
      const nameExists = await this.amenityRepository.existsByName(updateData.name);
      if (nameExists) {
        throw new Error('Amenity with this name already exists');
      }
    }

    return await this.amenityRepository.update(id, updateData);
  }

  /**
   * Delete amenity
   */
  async deleteAmenity(id: string): Promise<void> {
    const amenity = await this.amenityRepository.findById(id);
    if (!amenity) {
      throw new Error('Amenity not found');
    }
    await this.amenityRepository.delete(id);
  }

}

