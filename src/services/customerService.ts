import { CustomerRepository } from '../repositories/customerRepository';
import { Customer } from '../entities/Customer';
import { AppDataSource } from '../config/database';

export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async createCustomer(data: {
    name: string;
    email: string;
    phone?: string;
    addressId?: string;
    idType?: string;
    idNumber?: string;
    companyId: string;
  }): Promise<Customer> {
    const existingByEmail = await this.customerRepository.findByEmail(
      data.email
    );
    if (existingByEmail) {
      throw new Error('Customer with this email already exists');
    }

    if (data.phone) {
      const existingByPhone = await this.customerRepository.findByPhone(
        data.phone
      );
      if (existingByPhone) {
        throw new Error('Customer with this phone number already exists');
      }
    }

    const companyRepository = AppDataSource.getRepository('Company');
    const company = await companyRepository.findOne({
      where: { id: data.companyId },
    });
    if (!company) {
      throw new Error('Company not found');
    }

    const customer = await this.customerRepository.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      addressId: data.addressId,
      idType: data.idType,
      idNumber: data.idNumber,
      companyId: data.companyId,
      isActive: true,
    });

    return customer;
  }

  async getAllCustomersPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{
    data: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const result = await this.customerRepository.findAllPaginated(
      page,
      limit,
      search
    );
    return {
      ...result,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async getCustomerById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async updateCustomer(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      lat?: number;
      long?: number;
      idType?: string;
      idNumber?: string;
      companyId?: string;
      isActive?: boolean;
    },
    AppDataSource: any
  ): Promise<Customer> {
    const existing = await this.customerRepository.findById(id);
    if (!existing) {
      throw new Error('Customer not found');
    }

    if (data.email && data.email !== existing.email) {
      const emailExists = await this.customerRepository.existsByEmail(
        data.email
      );
      if (emailExists) {
        throw new Error('Customer with this email already exists');
      }
    }

    if (data.phone && data.phone !== existing.phone) {
      const phoneExists = await this.customerRepository.existsByPhone(
        data.phone
      );
      if (phoneExists) {
        throw new Error('Customer with this phone number already exists');
      }
    }

    if (data.companyId && data.companyId !== existing.companyId) {
      const companyRepository = AppDataSource.getRepository('Company');
      const company = await companyRepository.findOne({
        where: { id: data.companyId },
      });
      if (!company) {
        throw new Error('Company not found');
      }
    }

    const customerUpdateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      idType: data.idType,
      idNumber: data.idNumber,
      companyId: data.companyId,
      isActive: data.isActive,
    };

    if (
      data.address ||
      data.lat !== undefined ||
      data.long !== undefined
    ) {
      const Address = (await import('../entities/Address')).Address;
      const addressRepo = AppDataSource.getRepository(Address);

      if (existing.addressId) {
        await addressRepo.update(existing.addressId, {
          address: data.address,
          lat: data.lat !== undefined ? Number(data.lat) : undefined,
          long: data.long !== undefined ? Number(data.long) : undefined,
        });
      } else {
        const addressEntity = addressRepo.create({
          address: data.address,
          lat: data.lat !== undefined ? Number(data.lat) : 0,
          long: data.long !== undefined ? Number(data.long) : 0,
        });
        const savedAddress = await addressRepo.save(addressEntity);
        customerUpdateData.addressId = savedAddress.id;
      }
    }

    return await this.customerRepository.update(id, customerUpdateData);
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.customerRepository.delete(id);
  }

  async getActiveCustomers(): Promise<Pick<Customer, 'id' | 'name'>[]> {
    return await this.customerRepository.findActive();
  }

  async toggleCustomerStatus(id: string): Promise<Customer> {
    return await this.customerRepository.toggleStatus(id);
  }
}
