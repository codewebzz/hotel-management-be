import { BranchRepository } from '../repositories/branchRepository';
import { Branch } from '../entities/Branch';
import { AppDataSource } from '../config/database';

export class BranchService {
  private branchRepository: BranchRepository;

  constructor() {
    this.branchRepository = new BranchRepository();
  }

  /**
   * Create a new branch (requires brandId)
   */
  async createBranch(branchData: {
    name: string;
    brandId: string;
    addressId?: string;
  }): Promise<Branch> {
    const existingBranch = await this.branchRepository.findByName(branchData.name);
    if (existingBranch) {
      throw new Error("Branch with this name already exists");
    }

    const brandRepository = AppDataSource.getRepository('Brand');
    const brandExists = await brandRepository.findOne({
      where: { id: branchData.brandId },
    });
    if (!brandExists) {
      throw new Error('Brand not found');
    }

    return await this.branchRepository.create({
      ...branchData,
      isActive: true,
    });
  }

  async getAllBranchesPaginated(
    page: number = 1,
    limit: number = 10,
    search: string | undefined = undefined
  ): Promise<{
    data: Branch[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    const result = await this.branchRepository.findAllPaginated(page, limit, search);
    return {
      ...result,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async getBranchesByBrandId(
    brandId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ data: Branch[]; total: number }> {
    return await this.branchRepository.findByBrandId(brandId, page, limit);
  }

  async getBranchById(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new Error('Branch not found');
    }
    return branch;
  }

  async updateBranch(
    id: string,
    updateData: {
      name?: string;
      brandId?: string;
      addressId?: string;
      isActive?: boolean;
      address?: string;
      lat?: number;
      long?: number;
    },
    AppDataSource?: any
  ): Promise<Branch> {
    const existingBranch = await this.branchRepository.findById(id);
    if (!existingBranch) {
      throw new Error("Branch not found");
    }

    if (updateData.name && updateData.name !== existingBranch.name) {
      const nameExists = await this.branchRepository.existsByName(updateData.name);
      if (nameExists) {
        throw new Error("Branch with this name already exists");
      }
    }

    if (updateData.brandId && updateData.brandId !== existingBranch.brandId) {
      const brandRepository = AppDataSource.getRepository('Brand');
      const brandExists = await brandRepository.findOne({
        where: { id: updateData.brandId },
      });
      if (!brandExists) {
        throw new Error('Brand not found');
      }
    }

    const branchUpdateData: Partial<Branch> = {
      name: updateData.name,
      brandId: updateData.brandId,
      isActive: updateData.isActive,
    };

    if (
      updateData.address ||
      updateData.lat !== undefined ||
      updateData.long !== undefined
    ) {
      if (AppDataSource) {
        const Address = (await import("../entities/Address")).Address;
        const addressRepo = AppDataSource.getRepository(Address);

        if (existingBranch.addressId) {
          await addressRepo.update(existingBranch.addressId, {
            address: updateData.address,
            lat:
              updateData.lat !== undefined ? Number(updateData.lat) : undefined,
            long:
              updateData.long !== undefined ? Number(updateData.long) : undefined,
          });
        } else {
          const addressEntity = addressRepo.create({
            address: updateData.address,
            lat: updateData.lat !== undefined ? Number(updateData.lat) : 0,
            long: updateData.long !== undefined ? Number(updateData.long) : 0,
          });
          const savedAddress = await addressRepo.save(addressEntity);
          branchUpdateData.addressId = savedAddress.id;
        }
      }
    } else if (updateData.addressId) {
      branchUpdateData.addressId = updateData.addressId;
    }

    return await this.branchRepository.update(id, branchUpdateData);
  }

  async deleteBranch(id: string): Promise<void> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new Error('Branch not found');
    }
    await this.branchRepository.delete(id);
  }

  async getActiveBranches(): Promise<Branch[]> {
    return await this.branchRepository.findActive();
  }

  async toggleBranchStatus(id: string): Promise<Branch> {
    return await this.branchRepository.toggleStatus(id);
  }
}
