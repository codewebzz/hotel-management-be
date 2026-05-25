import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Room } from '../entities/Room';

export class RoomRepository {
  private repository: Repository<Room>;

  constructor() {
    this.repository = AppDataSource.getRepository(Room);
  }

  async create(data: Partial<Room>): Promise<Room> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    branchId?: string
  ): Promise<{ data: Room[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.company', 'company')
      .leftJoinAndSelect('room.brand', 'brand')
      .leftJoinAndSelect('room.branch', 'branch')
      .leftJoinAndSelect('room.floor', 'floor');

    if (search && search.trim() !== '') {
      query = query.where('room.roomNumber ILIKE :q', { q: `%${search}%` });
    }

    if (branchId) {
      query = query.andWhere('room.branchId = :branchId', { branchId });
    }

    const [data, total] = await query
      .orderBy('room.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Room | null> {
    return await this.repository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('room.company', 'company')
      .leftJoinAndSelect('room.brand', 'brand')
      .leftJoinAndSelect('room.branch', 'branch')
      .leftJoinAndSelect('room.floor', 'floor')
      .where('room.id = :id', { id })
      .getOne();
  }

  async findByRoomNumberAndBranch(
    roomNumber: string,
    branchId: string
  ): Promise<Room | null> {
    return await this.repository.findOne({
      where: { roomNumber, branchId },
    });
  }

  async update(id: string, data: Partial<Room>): Promise<Room> {
    await this.repository.update(id, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Room not found after update');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Room not found');
    }
    await this.repository.remove(entity);
  }

  async findActive(): Promise<Pick<Room, 'id' | 'roomNumber'>[]> {
    return await this.repository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      select: ['id', 'roomNumber'],
      relations: [],
    });
  }

  async existsByRoomNumberInBranch(
    roomNumber: string,
    branchId: string
  ): Promise<boolean> {
    const count = await this.repository.count({
      where: { roomNumber, branchId },
    });
    return count > 0;
  }

  async toggleStatus(id: string): Promise<Room> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Room not found');
    }
    await this.repository.update(id, { isActive: !entity.isActive });
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Room not found after status update');
    }
    return updated;
  }
}

