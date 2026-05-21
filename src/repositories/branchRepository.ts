import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Branch } from "../entities/Branch";

export class BranchRepository {
  private repository: Repository<Branch>;

  constructor() {
    this.repository = AppDataSource.getRepository(Branch);
  }

  /**
   * Create a new branch
   */
  async create(branchData: Partial<Branch>): Promise<Branch> {
    const branch = this.repository.create(branchData);
    return await this.repository.save(branch);
  }

  /**
   * Find all branches with pagination and optional search
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search: string | undefined = undefined
  ): Promise<{ data: Branch[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    // Search by name if search parameter is provided
    if (search !== undefined && search.trim() !== "") {
      console.log("Searching branches with query:", search);
      const [data, total] = await this.repository
        .createQueryBuilder("branch")
        .leftJoinAndSelect("branch.address", "address")
        .leftJoinAndSelect("branch.brand", "brand")
        .where("branch.name ILIKE :query", { query: `%${search}%` })
        .orderBy("branch.createdAt", "DESC")
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      return { data, total, page, limit };
    }

    // Get all branches if no search parameter
    const [data, total] = await this.repository.findAndCount({
      order: { createdAt: "DESC" },
      skip: offset,
      take: limit,
      relations: ["address", "brand"],
    });

    return { data, total, page, limit };
  }

  /**
   * Find branch by ID
   */
  async findById(id: string): Promise<Branch | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["address", "brand"],
    });
  }

  /**
   * Find branch by name
   */
  async findByName(name: string): Promise<Branch | null> {
    return await this.repository.findOne({ where: { name } });
  }

  /**
   * Find branch by address ID
   */
  async findByAddressId(addressId: string): Promise<Branch | null> {
    return await this.repository.findOne({ where: { addressId } });
  }

  /**
   * Update branch
   */
  async update(id: string, branchData: Partial<Branch>): Promise<Branch> {
    await this.repository.update(id, branchData);
    const updatedBranch = await this.findById(id);
    if (!updatedBranch) {
      throw new Error("Branch not found after update");
    }
    return updatedBranch;
  }

  /**
   * Delete branch
   */
  async delete(id: string): Promise<void> {
    const branch = await this.findById(id);
    if (!branch) {
      throw new Error("Branch not found");
    }
    await this.repository.remove(branch);
  }

  /**
   * Find branches by brandId (for lazy nested table loading)
   */
  async findByBrandId(
    brandId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ data: Branch[]; total: number }> {
    const [data, total] = await this.repository
      .createQueryBuilder('branch')
      .leftJoinAndSelect('branch.address', 'address')
      .where('branch.brandId = :brandId', { brandId })
      .orderBy('branch.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total };
  }

  /**
   * Find active branches for dropdown - only id and name
   */
  async findActive(): Promise<Pick<Branch, "id" | "name">[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
      select: ["id", "name"],
      relations: [],
    });
  }

  /**
   * Check if branch exists by name
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  /**
   * Toggle branch status (activate if inactive, deactivate if active)
   */
  async toggleStatus(id: string): Promise<Branch> {
    const branch = await this.findById(id);
    if (!branch) {
      throw new Error("Branch not found");
    }

    const newStatus = !branch.isActive;
    await this.repository.update(id, { isActive: newStatus });

    const updatedBranch = await this.findById(id);
    if (!updatedBranch) {
      throw new Error("Branch not found after status update");
    }
    return updatedBranch;
  }
}

