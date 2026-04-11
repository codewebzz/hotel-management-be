import { BrandRepository } from '../repositories/brandRepository';
import { Brand } from '../entities/Brand';
import { AppDataSource } from '../config/database';

export class BrandService {
  private brandRepository: BrandRepository;

  constructor() {
    this.brandRepository = new BrandRepository();
  }

  /**
   * Create a new brand (requires branchId)
   */
  async createBrand(brandData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    lat?: number;
    long?: number;
    branchId: string;
  }, AppDataSource?: any): Promise<Brand> {
    // Check if brand name already exists
    const existingBrandByName = await this.brandRepository.findByName(brandData.name);
    if (existingBrandByName) {
      throw new Error('Brand with this name already exists');
    }

    // Check if brand email already exists
    const existingBrandByEmail = await this.brandRepository.findByEmail(brandData.email);
    if (existingBrandByEmail) {
      throw new Error('Brand with this email already exists');
    }

    // Check if brand phone already exists (if phone is provided)
    if (brandData.phone) {
      const existingBrandByPhone = await this.brandRepository.findByPhone(brandData.phone);
      if (existingBrandByPhone) {
        throw new Error('Brand with this phone number already exists');
      }
    }

    // Check if branch exists
    const branchRepository = AppDataSource.getRepository('Branch');
    const branchExists = await branchRepository.findOne({
      where: { id: brandData.branchId },
    });
    if (!branchExists) {
      throw new Error('Branch not found');
    }

    // Handle address creation if provided
    const brandCreateData: any = {
      name: brandData.name,
      email: brandData.email,
      phone: brandData.phone,
      branchId: brandData.branchId,
      isActive: true,
    };

    if (brandData.address || brandData.lat !== undefined || brandData.long !== undefined) {
      const Address = (await import('../entities/Address')).Address;
      const addressRepo = AppDataSource.getRepository(Address);
      const addressEntity = addressRepo.create({
        address: brandData.address || '',
        lat: brandData.lat !== undefined ? Number(brandData.lat) : 0,
        long: brandData.long !== undefined ? Number(brandData.long) : 0,
      });
      const savedAddress = await addressRepo.save(addressEntity);
      brandCreateData.addressId = savedAddress.id;
    }

    const brand = await this.brandRepository.create(brandCreateData);
    return brand;
  }

  /**
   * Get all brands with pagination and optional search
   */
  async getAllBrandsPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Brand[]; total: number; page: number; limit: number }> {
    return await this.brandRepository.findAllPaginated(page, limit, search);
  }

  /**
   * Get brand by ID
   */
  async getBrandById(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }

  /**
   * Update brand (allows branchId update with validation, handles address)
   */
  async updateBrand(
    id: string,
    updateData: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      lat?: number;
      long?: number;
      branchId?: string;
      isActive?: boolean;
    },
    AppDataSource: any
  ): Promise<Brand> {
    // Check if brand exists
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new Error('Brand not found');
    }

    // If name is being updated, check if new name already exists
    if (updateData.name && updateData.name !== existingBrand.name) {
      const nameExists = await this.brandRepository.existsByName(updateData.name);
      if (nameExists) {
        throw new Error('Brand with this name already exists');
      }
    }

    // If email is being updated, check if new email already exists
    if (updateData.email && updateData.email !== existingBrand.email) {
      const emailExists = await this.brandRepository.existsByEmail(updateData.email);
      if (emailExists) {
        throw new Error('Brand with this email already exists');
      }
    }

    // If phone is being updated, check if new phone already exists
    if (updateData.phone && updateData.phone !== existingBrand.phone) {
      const phoneExists = await this.brandRepository.existsByPhone(updateData.phone);
      if (phoneExists) {
        throw new Error('Brand with this phone number already exists');
      }
    }

    // If branchId is being updated, validate the branch exists
    if (updateData.branchId && updateData.branchId !== existingBrand.branchId) {
      const branchRepository = AppDataSource.getRepository('Branch');
      const branchExists = await branchRepository.findOne({
        where: { id: updateData.branchId },
      });
      if (!branchExists) {
        throw new Error('Branch not found');
      }
    }

    // Handle address update if provided
    const brandUpdateData: any = {
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone,
      branchId: updateData.branchId,
      isActive: updateData.isActive,
    };

    if (
      updateData.address ||
      updateData.lat !== undefined ||
      updateData.long !== undefined
    ) {
      const Address = (await import('../entities/Address')).Address;
      const addressRepo = AppDataSource.getRepository(Address);

      if (existingBrand.addressId) {
        // Update existing address
        await addressRepo.update(existingBrand.addressId, {
          address: updateData.address,
          lat: updateData.lat !== undefined ? Number(updateData.lat) : undefined,
          long: updateData.long !== undefined ? Number(updateData.long) : undefined,
        });
      } else {
        // Create new address if brand didn't have one
        const addressEntity = addressRepo.create({
          address: updateData.address,
          lat: updateData.lat !== undefined ? Number(updateData.lat) : 0,
          long: updateData.long !== undefined ? Number(updateData.long) : 0,
        });
        const savedAddress = await addressRepo.save(addressEntity);
        brandUpdateData.addressId = savedAddress.id;
      }
    }

    return await this.brandRepository.update(id, brandUpdateData);
  }

  /**
   * Delete brand
   */
  async deleteBrand(id: string): Promise<void> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    await this.brandRepository.delete(id);
  }

  /**
   * Get active brands (for dropdown)
   */
  async getActiveBrands(): Promise<Pick<Brand, 'id' | 'name'>[]> {
    return await this.brandRepository.findActive();
  }

  /**
   * Toggle brand status
   */
  async toggleBrandStatus(id: string): Promise<Brand> {
    return await this.brandRepository.toggleStatus(id);
  }
}

