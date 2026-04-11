import { InvoiceRepository } from '../repositories/invoiceRepository';
import { Invoice } from '../entities/Invoice';
import { AppDataSource } from '../config/database';

export class InvoiceService {
  private repo: InvoiceRepository;

  constructor() {
    this.repo = new InvoiceRepository();
  }

  private async generateInvoiceNumber(): Promise<string> {
    let num: string;
    do {
      const ts = Date.now();
      num = `INV-${ts}`;
    } while (await this.repo.existsByInvoiceNumber(num));
    return num;
  }

  async createInvoice(data: {
    bookingId: string;
    amount: number;
    tax?: number;
    discount?: number;
    paymentStatus: string;
    paymentMethod?: string;
    paidAmount?: number;
  }): Promise<Invoice> {
    const bookingRepo = AppDataSource.getRepository('Booking');
    const booking = await bookingRepo.findOne({ where: { id: data.bookingId } });
    if (!booking) {
      throw new Error('Booking not found');
    }

    const discount = data.discount ?? 0;
    const tax = data.tax ?? 0;
    const paidAmount = data.paidAmount ?? 0;
    const finalAmount = Number(data.amount) - Number(discount) + Number(tax);

    const invoiceNumber = await this.generateInvoiceNumber();

    const entity = await this.repo.create({
      invoiceNumber,
      bookingId: data.bookingId,
      amount: data.amount,
      discount,
      tax,
      finalAmount,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      paidAmount,
      paidAt: data.paymentStatus === 'paid' ? new Date() : undefined,
    });
    return entity;
  }

  async getAllInvoicesPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: Invoice[]; total: number; page: number; limit: number; totalPages: number }> {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    const result = await this.repo.findAllPaginated(page, limit, search);
    return { ...result, totalPages: Math.ceil(result.total / limit) };
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.repo.findById(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }

  async updateInvoice(
    id: string,
    data: {
      bookingId?: string;
      amount?: number;
      tax?: number;
      discount?: number;
      paymentStatus?: string;
      paymentMethod?: string;
      paidAmount?: number;
    }
  ): Promise<Invoice> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Invoice not found');
    }

    if (data.bookingId && data.bookingId !== existing.bookingId) {
      const bookingRepo = AppDataSource.getRepository('Booking');
      const booking = await bookingRepo.findOne({ where: { id: data.bookingId } });
      if (!booking) {
        throw new Error('Booking not found');
      }
    }

    const nextAmount = data.amount ?? existing.amount;
    const nextDiscount = data.discount ?? existing.discount;
    const nextTax = data.tax ?? existing.tax;
    const finalAmount = Number(nextAmount) - Number(nextDiscount) + Number(nextTax);

    const nextPaidAmount = data.paidAmount ?? existing.paidAmount;
    let nextPaidAt = existing.paidAt;
    if (data.paymentStatus && data.paymentStatus !== existing.paymentStatus) {
      if (data.paymentStatus === 'paid' && !nextPaidAt) {
        nextPaidAt = new Date();
      }
      if (data.paymentStatus !== 'paid') {
        nextPaidAt = undefined;
      }
    }

    const updateData: Partial<Invoice> = {
      bookingId: data.bookingId,
      amount: data.amount,
      tax: data.tax,
      discount: data.discount,
      finalAmount,
      paymentStatus: data.paymentStatus,
      paymentMethod: data.paymentMethod,
      paidAmount: nextPaidAmount,
      paidAt: nextPaidAt,
    };

    return await this.repo.update(id, updateData);
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

