import { Repository, IsNull } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Room, RoomStatus } from '../entities/Room';
import { RoomStatusHistory } from '../entities/RoomStatusHistory';

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

  async updateRoomStatusWithHistory(id: string, newStatus: RoomStatus): Promise<Room> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const room = await queryRunner.manager.findOne(Room, { where: { id } });
      if (!room) {
        throw new Error('Room not found');
      }

      if (room.status === newStatus) {
        await queryRunner.release();
        return room;
      }

      const now = new Date();

      const openHistories = await queryRunner.manager.find(RoomStatusHistory, {
        where: { roomId: id, endTime: IsNull() },
      });

      if (openHistories.length > 0) {
        for (const history of openHistories) {
          history.endTime = now;
          await queryRunner.manager.save(history);
        }
      }

      room.status = newStatus;
      await queryRunner.manager.save(room);

      const newHistory = queryRunner.manager.create(RoomStatusHistory, {
        roomId: id,
        status: newStatus,
        startTime: now,
      });
      await queryRunner.manager.save(newHistory);

      await queryRunner.commitTransaction();
      return room;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getStatusHistory(id: string): Promise<RoomStatusHistory[]> {
    const historyRepository = AppDataSource.getRepository(RoomStatusHistory);
    return await historyRepository.find({
      where: { roomId: id },
      order: { startTime: 'DESC' },
    });
  }

  async createBulk(
    roomsData: {
      roomNumber: string;
      roomTypeId: string;
      floorId?: string;
      floor?: number;
      notes?: string;
      companyId: string;
      brandId: string;
      branchId: string;
    }[]
  ): Promise<Room[]> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdRooms: Room[] = [];
      const roomTypeRepository = queryRunner.manager.getRepository('RoomType');
      const companyRepository = queryRunner.manager.getRepository('Company');
      const brandRepository = queryRunner.manager.getRepository('Brand');
      const branchRepository = queryRunner.manager.getRepository('Branch');
      const floorRepository = queryRunner.manager.getRepository('Floor');

      const floorCache: Record<string, string> = {};

      for (const roomData of roomsData) {
        const count = await queryRunner.manager.count(Room, {
          where: { roomNumber: roomData.roomNumber, branchId: roomData.branchId },
        });
        if (count > 0) {
          throw new Error(`Room number ${roomData.roomNumber} already exists in this branch`);
        }

        const roomType = await roomTypeRepository.findOne({
          where: { id: roomData.roomTypeId },
        });
        if (!roomType) {
          throw new Error(`RoomType not found for room ${roomData.roomNumber}`);
        }

        const company = await companyRepository.findOne({
          where: { id: roomData.companyId },
        });
        if (!company) {
          throw new Error(`Company not found for room ${roomData.roomNumber}`);
        }

        const brand = await brandRepository.findOne({
          where: { id: roomData.brandId },
        });
        if (!brand) {
          throw new Error(`Brand not found for room ${roomData.roomNumber}`);
        }

        const branch = await branchRepository.findOne({
          where: { id: roomData.branchId },
        });
        if (!branch) {
          throw new Error(`Branch not found for room ${roomData.roomNumber}`);
        }

        let resolvedFloorId = roomData.floorId;

        if (!resolvedFloorId && roomData.floor !== undefined && roomData.floor !== null) {
          const cacheKey = `${roomData.branchId}-${roomData.floor}`;
          if (floorCache[cacheKey]) {
            resolvedFloorId = floorCache[cacheKey];
          } else {
            let floorEntity = await floorRepository.findOne({
              where: { branchId: roomData.branchId, floorNumber: roomData.floor }
            }) as any;

            if (!floorEntity) {
              const newFloor = floorRepository.create({
                floorNumber: roomData.floor,
                name: `Floor ${roomData.floor}`,
                companyId: roomData.companyId,
                brandId: roomData.brandId,
                branchId: roomData.branchId,
                isActive: true
              });
              floorEntity = await floorRepository.save(newFloor);
            }
            resolvedFloorId = floorEntity.id;
            floorCache[cacheKey] = floorEntity.id;
          }
        }

        const room = queryRunner.manager.create(Room, {
          roomNumber: roomData.roomNumber,
          roomTypeId: roomData.roomTypeId,
          floorId: resolvedFloorId,
          notes: roomData.notes,
          companyId: roomData.companyId,
          brandId: roomData.brandId,
          branchId: roomData.branchId,
          isActive: true,
        });

        const savedRoom = await queryRunner.manager.save(room);
        createdRooms.push(savedRoom);
      }

      await queryRunner.commitTransaction();
      return createdRooms;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

