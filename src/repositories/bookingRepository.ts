import { Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { Booking } from "../entities/Booking";

export class BookingRepository {
  private repository: Repository<Booking>;

  constructor() {
    this.repository = AppDataSource.getRepository(Booking);
  }

  async create(data: Partial<Booking>): Promise<Booking> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    branchId?: string,
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder("booking")
      .leftJoinAndSelect("booking.customer", "customer")
      .leftJoinAndSelect("booking.room", "room")
      .leftJoinAndSelect("booking.branch", "branch");

    if (search && search.trim() !== "") {
      query = query.where(
        "booking.bookingNumber ILIKE :q OR customer.name ILIKE :q",
        { q: `%${search}%` },
      );
    }

    if (branchId) {
      query = query.andWhere("booking.branchId = :branchId", { branchId });
    }

    const [data, total] = await query
      .orderBy("booking.createdAt", "DESC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Booking | null> {
    return await this.repository
      .createQueryBuilder("booking")
      .leftJoinAndSelect("booking.customer", "customer")
      .leftJoinAndSelect("booking.room", "room")
      .leftJoinAndSelect("booking.branch", "branch")
      .where("booking.id = :id", { id })
      .getOne();
  }

  async findByBookingNumber(bookingNumber: string): Promise<Booking | null> {
    return await this.repository.findOne({ where: { bookingNumber } });
  }

  async existsByBookingNumber(bookingNumber: string): Promise<boolean> {
    const count = await this.repository.count({ where: { bookingNumber } });
    return count > 0;
  }

  async findOverlappingForRoom(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
  ): Promise<Booking[]> {
    return await this.repository
      .createQueryBuilder("booking")
      .where("booking.roomId = :roomId", { roomId })
      .andWhere(
        "(booking.status != :cancelled) AND (booking.checkInDate < :end) AND (booking.checkOutDate > :start)",
        { cancelled: "cancelled", start: checkInDate, end: checkOutDate },
      )
      .getMany();
  }

  async update(id: string, data: Partial<Booking>): Promise<Booking> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error("Booking not found after update");
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error("Booking not found");
    }
    await this.repository.remove(entity);
  }

  async findAlConfirmed(): Promise<
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
    return await this.repository.find({
      where: { status: "confirmed" },
      order: { createdAt: "DESC" },
      select: ["id", "bookingNumber", "totalAmount", "discount", "tax", "finalAmount"],
      relations: [],
    });
  }
}
