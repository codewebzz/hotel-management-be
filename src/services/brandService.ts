import { BrandRepository } from '../repositories/brandRepository';
import { Brand } from '../entities/Brand';
import { AppDataSource } from '../config/database';

export class BrandService {
  private brandRepository: BrandRepository;

  constructor() {
    this.brandRepository = new BrandRepository();
  }

  /**
   * Create a new brand
   */
  async createBrand(
    brandData: {
      name: string;
      email: string;
      phone?: string;
      address?: string;
      lat?: number;
      long?: number;
      companyId: string;
    },
    AppDataSource: any
  ): Promise<Brand> {
    const existingBrandByName = await this.brandRepository.findByName(brandData.name);
    if (existingBrandByName) {
      throw new Error('Brand with this name already exists');
    }

    const existingBrandByEmail = await this.brandRepository.findByEmail(brandData.email);
    if (existingBrandByEmail) {
      throw new Error('Brand with this email already exists');
    }

    if (brandData.phone) {
      const existingBrandByPhone = await this.brandRepository.findByPhone(brandData.phone);
      if (existingBrandByPhone) {
        throw new Error('Brand with this phone number already exists');
      }
    }

    const brandCreateData: Partial<Brand> = {
      name: brandData.name,
      email: brandData.email,
      phone: brandData.phone,
      companyId: brandData.companyId,
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

    return await this.brandRepository.create(brandCreateData);
  }

  async getAllBrandsPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Brand[]; total: number; page: number; limit: number }> {
    return await this.brandRepository.findAllPaginated(page, limit, search);
  }

  async getBrandsByCompanyId(
    companyId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ data: Brand[]; total: number }> {
    return await this.brandRepository.findByCompanyId(companyId, page, limit);
  }

  async getBrandById(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    return brand;
  }

  async updateBrand(
    id: string,
    updateData: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      lat?: number;
      long?: number;
      isActive?: boolean;
      companyId?: string;
    },
    AppDataSource: any
  ): Promise<Brand> {
    const existingBrand = await this.brandRepository.findById(id);
    if (!existingBrand) {
      throw new Error('Brand not found');
    }

    if (updateData.name && updateData.name !== existingBrand.name) {
      const nameExists = await this.brandRepository.existsByName(updateData.name);
      if (nameExists) {
        throw new Error('Brand with this name already exists');
      }
    }

    if (updateData.email && updateData.email !== existingBrand.email) {
      const emailExists = await this.brandRepository.existsByEmail(updateData.email);
      if (emailExists) {
        throw new Error('Brand with this email already exists');
      }
    }

    if (updateData.phone && updateData.phone !== existingBrand.phone) {
      const phoneExists = await this.brandRepository.existsByPhone(updateData.phone);
      if (phoneExists) {
        throw new Error('Brand with this phone number already exists');
      }
    }

    const brandUpdateData: Partial<Brand> = {
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone,
      isActive: updateData.isActive,
      companyId: updateData.companyId,
    };

    if (
      updateData.address ||
      updateData.lat !== undefined ||
      updateData.long !== undefined
    ) {
      const Address = (await import('../entities/Address')).Address;
      const addressRepo = AppDataSource.getRepository(Address);

      if (existingBrand.addressId) {
        await addressRepo.update(existingBrand.addressId, {
          address: updateData.address,
          lat: updateData.lat !== undefined ? Number(updateData.lat) : undefined,
          long: updateData.long !== undefined ? Number(updateData.long) : undefined,
        });
      } else {
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

  async deleteBrand(id: string): Promise<void> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    await this.brandRepository.delete(id);
  }

  async getActiveBrands(): Promise<Pick<Brand, 'id' | 'name'>[]> {
    return await this.brandRepository.findActive();
  }

  async toggleBrandStatus(id: string): Promise<Brand> {
    return await this.brandRepository.toggleStatus(id);
  }
}
