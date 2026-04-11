import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Company } from "../entities/Company";

export class CompanyRepository {
  private repository: Repository<Company>;

  constructor() {
    this.repository = AppDataSource.getRepository(Company);
  }

  /**
   * Create a new company
   */
  async create(companyData: Partial<Company>): Promise<Company> {
    const company = this.repository.create(companyData);
    return await this.repository.save(company);
  }

  /**
   * Find all companies with pagination and optional search
   */
  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search: string | undefined = undefined
  ): Promise<{ data: Company[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    // Search by name if search parameter is provided
    if (search !== undefined && search.trim() !== "") {
      const [data, total] = await this.repository
        .createQueryBuilder("company")
        .leftJoinAndSelect("company.address", "address")
        .where("company.name ILIKE :query", { query: `%${search}%` })
        .orderBy("company.createdAt", "DESC")
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      return { data, total, page, limit };
    }

    // Get all companies if no search parameter
    const [data, total] = await this.repository.findAndCount({
      order: { createdAt: "DESC" },
      skip: offset,
      take: limit,
      relations: ["address"],
    });

    return { data, total, page, limit };
  }

  /**
   * Find company by ID
   */
  async findById(id: string): Promise<Company | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * Find company by name
   */
  async findByName(name: string): Promise<Company | null> {
    return await this.repository.findOne({ where: { name } });
  }

  /**
   * Find company by email
   */
  async findByEmail(email: string): Promise<Company | null> {
    return await this.repository.findOne({ where: { email } });
  }

  /**
   * Find company by address ID
   */
  async findByAddressId(addressId: string): Promise<Company | null> {
    return await this.repository.findOne({ where: { addressId } });
  }

  /**
   * Update company
   */
  async update(id: string, companyData: Partial<Company>): Promise<Company> {
    await this.repository.update(id, companyData);
    const updatedCompany = await this.findById(id);
    if (!updatedCompany) {
      throw new Error("Company not found after update");
    }
    return updatedCompany;
  }

  /**
   * Delete company
   */
  async delete(id: string): Promise<void> {
    const company = await this.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }
    await this.repository.remove(company);
  }

  /**
   * Find active companies for dropdown - only id and name
   */
  async findActive(): Promise<Pick<Company, "id" | "name">[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
      select: ["id", "name"],
      relations: [],
    });
  }

  /**
   * Check if company exists by name
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await this.repository.count({ where: { name } });
    return count > 0;
  }

  /**
   * Check if company exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  /**
   * Find company by phone
   */
  async findByPhone(phone: string): Promise<Company | null> {
    return await this.repository.findOne({ where: { phone } });
  }

  /**
   * Check if company exists by phone
   */
  async existsByPhone(phone: string): Promise<boolean> {
    const count = await this.repository.count({ where: { phone } });
    return count > 0;
  }

  /**
   * Toggle company status (activate if inactive, deactivate if active)
   */
  async toggleStatus(id: string): Promise<Company> {
    const company = await this.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }
    
    const newStatus = !company.isActive;
    await this.repository.update(id, { isActive: newStatus });
    
    const updatedCompany = await this.findById(id);
    if (!updatedCompany) {
      throw new Error("Company not found after status update");
    }
    return updatedCompany;
  }
}
