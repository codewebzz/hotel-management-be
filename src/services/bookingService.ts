import { BookingRepository } from "../repositories/bookingRepository";
import { Booking } from "../entities/Booking";
import { AppDataSource } from "../config/database";

export class BookingService {
  private repo: BookingRepository;

  constructor() {
    this.repo = new BookingRepository();
  }

  private async generateBookingNumber(): Promise<string> {
    let bn: string;
    do {
      const ts = Date.now();
      bn = `BK-${ts}`;
    } while (await this.repo.existsByBookingNumber(bn));
    return bn;
  }

  async createBooking(data: {
    customerId: string;
    roomId: string;
    branchId: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children?: number;
    totalAmount: number;
    discount?: number;
    tax?: number;
    status: string;
    specialRequests?: string;
  }): Promise<Booking> {
    if (new Date(data.checkInDate) >= new Date(data.checkOutDate)) {
      throw new Error("checkInDate must be before checkOutDate");
    }

    const customerRepo = AppDataSource.getRepository("Customer");
    const customer = await customerRepo.findOne({
      where: { id: data.customerId },
    });
    if (!customer) {
      throw new Error("Customer not found");
    }

    const roomRepo = AppDataSource.getRepository("Room");
    const room = await roomRepo.findOne({ where: { id: data.roomId } });
    if (!room) {
      throw new Error("Room not found");
    }

    const branchRepo = AppDataSource.getRepository("Branch");
    const branch = await branchRepo.findOne({ where: { id: data.branchId } });
    if (!branch) {
      throw new Error("Branch not found");
    }

    const overlaps = await this.repo.findOverlappingForRoom(
      data.roomId,
      data.checkInDate,
      data.checkOutDate,
    );
    if (overlaps.length > 0) {
      throw new Error("Room is not available for the selected dates");
    }

    const discount = data.discount ?? 0;
    const tax = data.tax ?? 0;
    const finalAmount =
      Number(data.totalAmount) - Number(discount) + Number(tax);

    const bookingNumber = await this.generateBookingNumber();

    const entity = await this.repo.create({
      bookingNumber,
      customerId: data.customerId,
      roomId: data.roomId,
      branchId: data.branchId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: data.adults,
      children: data.children ?? 0,
      totalAmount: data.totalAmount,
      discount,
      tax,
      finalAmount,
      status: data.status,
      specialRequests: data.specialRequests,
    });

    return entity;
  }

  async getAllBookingsPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: Booking[];
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
    const result = await this.repo.findAllPaginated(page, limit, search);
    return { ...result, totalPages: Math.ceil(result.total / limit) };
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.repo.findById(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  }

  async updateBooking(
    id: string,
    data: {
      customerId?: string;
      roomId?: string;
      branchId?: string;
      checkInDate?: string;
      checkOutDate?: string;
      adults?: number;
      children?: number;
      totalAmount?: number;
      discount?: number;
      tax?: number;
      status?: string;
      specialRequests?: string;
    },
  ): Promise<Booking> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error("Booking not found");
    }

    const nextCheckIn = data.checkInDate ?? existing.checkInDate;
    const nextCheckOut = data.checkOutDate ?? existing.checkOutDate;
    if (new Date(nextCheckIn) >= new Date(nextCheckOut)) {
      throw new Error("checkInDate must be before checkOutDate");
    }

    const nextRoomId = data.roomId ?? existing.roomId;
    if (
      nextRoomId !== existing.roomId ||
      nextCheckIn !== existing.checkInDate ||
      nextCheckOut !== existing.checkOutDate
    ) {
      const overlaps = await this.repo.findOverlappingForRoom(
        nextRoomId,
        nextCheckIn,
        nextCheckOut,
      );
      const overlapsExcludingSelf = overlaps.filter((b) => b.id !== id);
      if (overlapsExcludingSelf.length > 0) {
        throw new Error("Room is not available for the selected dates");
      }
    }

    if (data.customerId) {
      const customerRepo = AppDataSource.getRepository("Customer");
      const customer = await customerRepo.findOne({
        where: { id: data.customerId },
      });
      if (!customer) {
        throw new Error("Customer not found");
      }
    }

    if (data.roomId) {
      const roomRepo = AppDataSource.getRepository("Room");
      const room = await roomRepo.findOne({ where: { id: data.roomId } });
      if (!room) {
        throw new Error("Room not found");
      }
    }

    if (data.branchId) {
      const branchRepo = AppDataSource.getRepository("Branch");
      const branch = await branchRepo.findOne({ where: { id: data.branchId } });
      if (!branch) {
        throw new Error("Branch not found");
      }
    }

    const finalAmount =
      Number(data.totalAmount ?? existing.totalAmount) -
      Number(data.discount ?? existing.discount) +
      Number(data.tax ?? existing.tax);

    const updateData: Partial<Booking> = {
      customerId: data.customerId,
      roomId: data.roomId,
      branchId: data.branchId,
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: data.adults,
      children: data.children,
      totalAmount: data.totalAmount,
      discount: data.discount,
      tax: data.tax,
      finalAmount,
      status: data.status,
      specialRequests: data.specialRequests,
    };

    return await this.repo.update(id, updateData);
  }

  async deleteBooking(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getConfirmedBookings(): Promise<
    Pick<
      Booking,
      | "id"
      | "bookingNumber"
      | "totalAmount"
      | "discount"
      | "tax"
      | "finalAmount"
    >[]
  > {
    return await this.repo.findAlConfirmed();
  }
}
