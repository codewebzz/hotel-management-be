import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Invoice } from '../entities/Invoice';

export class InvoiceRepository {
  private repository: Repository<Invoice>;

  constructor() {
    this.repository = AppDataSource.getRepository(Invoice);
  }

  async create(data: Partial<Invoice>): Promise<Invoice> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Invoice[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.booking', 'booking');

    if (search && search.trim() !== '') {
      query = query.where(
        'invoice.invoiceNumber ILIKE :q OR invoice.paymentStatus ILIKE :q',
        { q: `%${search}%` }
      );
    }

    const [data, total] = await query
      .orderBy('invoice.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Invoice | null> {
    return await this.repository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.booking', 'booking')
      .where('invoice.id = :id', { id })
      .getOne();
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Invoice | null> {
    return await this.repository.findOne({ where: { invoiceNumber } });
  }

  async existsByInvoiceNumber(invoiceNumber: string): Promise<boolean> {
    const count = await this.repository.count({ where: { invoiceNumber } });
    return count > 0;
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Invoice not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Invoice not found');
    }
    await this.repository.remove(entity);
  }
}

