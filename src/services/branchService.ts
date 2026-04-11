import { BranchRepository } from '../repositories/branchRepository';
import { Branch } from '../entities/Branch';

export class BranchService {
  private branchRepository: BranchRepository;

  constructor() {
    this.branchRepository = new BranchRepository();
  }

  /**
   * Create a new branch
   */
  async createBranch(branchData: {
    name: string;
    addressId?: string;
  }): Promise<Branch> {
    // Check if branch name already exists
    const existingBranch = await this.branchRepository.findByName(
      branchData.name
    );
    if (existingBranch) {
      throw new Error("Branch with this name already exists");
    }

    const branch = await this.branchRepository.create({
      ...branchData,
      isActive: true,
    });

    return branch;
  }

  /**
   * Get all branches with pagination
   */
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
    // Validate pagination parameters
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

  /**
   * Get branch by ID
   */
  async getBranchById(id: string): Promise<Branch> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new Error('Branch not found');
    }
    return branch;
  }

  /**
   * Update branch
   */
  async updateBranch(
    id: string,
    updateData: {
      name?: string;
      addressId?: string;
      isActive?: boolean;
      address?: string;
      lat?: number;
      long?: number;
    },
    AppDataSource?: any
  ): Promise<Branch> {
    // Check if branch exists
    const existingBranch = await this.branchRepository.findById(id);
    if (!existingBranch) {
      throw new Error("Branch not found");
    }

    // If name is being updated, check if new name already exists
    if (updateData.name && updateData.name !== existingBranch.name) {
      const nameExists = await this.branchRepository.existsByName(
        updateData.name
      );
      if (nameExists) {
        throw new Error("Branch with this name already exists");
      }
    }

    // Handle address update if provided
    const branchUpdateData: any = {
      name: updateData.name,
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
          // Update existing address
          await addressRepo.update(existingBranch.addressId, {
            address: updateData.address,
            lat:
              updateData.lat !== undefined ? Number(updateData.lat) : undefined,
            long:
              updateData.long !== undefined ? Number(updateData.long) : undefined,
          });
        } else {
          // Create new address if branch didn't have one
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

  /**
   * Delete branch
   */
  async deleteBranch(id: string): Promise<void> {
    const branch = await this.branchRepository.findById(id);
    if (!branch) {
      throw new Error('Branch not found');
    }
    await this.branchRepository.delete(id);
  }

  /**
   * Get active branches
   */
  async getActiveBranches(): Promise<Pick<Branch, "id" | "name">[]> {
    return await this.branchRepository.findActive();
  }

  /**
   * Toggle branch status
   */
  async toggleBranchStatus(id: string): Promise<Branch> {
    return await this.branchRepository.toggleStatus(id);
  }
}

