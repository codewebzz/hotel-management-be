import { CompanyRepository } from "../repositories/companyRepository";
import { Company } from "../entities/Company";

export class CompanyService {
  private companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  /**
   * Create a new company
   */
  async createCompany(companyData: {
    name: string;
    email: string;
    phone?: string;
    addressId?: string;
  }): Promise<Company> {
    // Check if company name already exists
    const existingCompanyByName = await this.companyRepository.findByName(
      companyData.name
    );
    if (existingCompanyByName) {
      throw new Error("Company with this name already exists");
    }

    // Check if company email already exists
    const existingCompanyByEmail = await this.companyRepository.findByEmail(
      companyData.email
    );
    if (existingCompanyByEmail) {
      throw new Error("Company with this email already exists");
    }

    // Check if company phone already exists (if phone is provided)
    if (companyData.phone) {
      const existingCompanyByPhone = await this.companyRepository.findByPhone(
        companyData.phone
      );
      if (existingCompanyByPhone) {
        throw new Error("Company with this phone number already exists");
      }
    }

    const company = await this.companyRepository.create({
      ...companyData,
      isActive: true,
    });

    return company;
  }

  /**
   * Get all companies with pagination
   */
  async getAllCompaniesPaginated(
    page: number = 1,
    limit: number = 10,
    search: string | undefined = undefined
  ): Promise<{
    data: Company[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.companyRepository.findAllPaginated(
      page,
      limit,
      search
    );
    return {
      ...result,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  /**
   * Get company by ID
   */
  async getCompanyById(id: string): Promise<Company> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }
    return company;
  }

  /**
   * Update company
   */
  async updateCompany(
    id: string,
    updateData: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      lat?: number;
      long?: number;
      isActive?: boolean;
    },
    AppDataSource: any
  ): Promise<Company> {
    // Check if company exists
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new Error("Company not found");
    }

    // If name is being updated, check if new name already exists
    if (updateData.name && updateData.name !== existingCompany.name) {
      const nameExists = await this.companyRepository.existsByName(
        updateData.name
      );
      if (nameExists) {
        throw new Error("Company with this name already exists");
      }
    }

    // If email is being updated, check if new email already exists
    if (updateData.email && updateData.email !== existingCompany.email) {
      const emailExists = await this.companyRepository.existsByEmail(
        updateData.email
      );
      if (emailExists) {
        throw new Error("Company with this email already exists");
      }
    }

    // Handle address update if provided
    const companyUpdateData: any = {
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone,
      isActive: updateData.isActive,
    };

    if (
      updateData.address ||
      updateData.lat !== undefined ||
      updateData.long !== undefined
    ) {
      const Address = (await import("../entities/Address")).Address;
      const addressRepo = AppDataSource.getRepository(Address);

      if (existingCompany.addressId) {
        // Update existing address
        await addressRepo.update(existingCompany.addressId, {
          address: updateData.address,
          lat: updateData.lat !== undefined ? Number(updateData.lat) : undefined,
          long: updateData.long !== undefined ? Number(updateData.long) : undefined,
        });
      } else {
        // Create new address if company didn't have one
        const addressEntity = addressRepo.create({
          address: updateData.address,
          lat: updateData.lat !== undefined ? Number(updateData.lat) : 0,
          long: updateData.long !== undefined ? Number(updateData.long) : 0,
        });
        const savedAddress = await addressRepo.save(addressEntity);
        companyUpdateData.addressId = savedAddress.id;
      }
    }

    return await this.companyRepository.update(id, companyUpdateData);
  }

  /**
   * Delete company
   */
  async deleteCompany(id: string): Promise<void> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new Error("Company not found");
    }
    await this.companyRepository.delete(id);
  }

  /**
   * Get active companies
   */
  async getActiveCompanies(): Promise<Pick<Company, "id" | "name">[]> {
    return await this.companyRepository.findActive();
  }

  /**
   * Toggle company status
   */
  async toggleCompanyStatus(id: string): Promise<Company> {
    return await this.companyRepository.toggleStatus(id);
  }
}
