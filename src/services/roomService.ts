import { RoomRepository } from '../repositories/roomRepository';
import { Room } from '../entities/Room';
import { AppDataSource } from '../config/database';

export class RoomService {
  private repo: RoomRepository;

  constructor() {
    this.repo = new RoomRepository();
  }

  async createRoom(data: {
    roomNumber: string;
    roomTypeId: string;
    floorId?: string;
    notes?: string;
    companyId: string;
    brandId: string;
    branchId: string;
  }): Promise<Room> {
    const exists = await this.repo.existsByRoomNumberInBranch(
      data.roomNumber,
      data.branchId
    );
    if (exists) {
      throw new Error(
        'Room with this room number already exists in this branch'
      );
    }

    const roomTypeRepository = AppDataSource.getRepository('RoomType');
    const roomType = await roomTypeRepository.findOne({
      where: { id: data.roomTypeId },
    });
    if (!roomType) {
      throw new Error('RoomType not found');
    }

    if (data.floorId) {
      const floorRepository = AppDataSource.getRepository('Floor');
      const floor = await floorRepository.findOne({
        where: { id: data.floorId },
      });
      if (!floor) {
        throw new Error('Floor not found');
      }
    }

    const companyRepository = AppDataSource.getRepository('Company');
    const company = await companyRepository.findOne({
      where: { id: data.companyId },
    });
    if (!company) {
      throw new Error('Company not found');
    }

    const brandRepository = AppDataSource.getRepository('Brand');
    const brand = await brandRepository.findOne({
      where: { id: data.brandId },
    });
    if (!brand) {
      throw new Error('Brand not found');
    }

    const branchRepository = AppDataSource.getRepository('Branch');
    const branch = await branchRepository.findOne({
      where: { id: data.branchId },
    });
    if (!branch) {
      throw new Error('Branch not found');
    }

    const room = await this.repo.create({
      roomNumber: data.roomNumber,
      roomTypeId: data.roomTypeId,
      floorId: data.floorId,
      notes: data.notes,
      companyId: data.companyId,
      brandId: data.brandId,
      branchId: data.branchId,
      isActive: true,
    });

    return room;
  }

  async getAllRoomsPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    branchId?: string
  ): Promise<{
    data: Room[];
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

    const result = await this.repo.findAllPaginated(page, limit, search, branchId);
    return {
      ...result,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  async getRoomById(id: string): Promise<Room> {
    const room = await this.repo.findById(id);
    if (!room) {
      throw new Error('Room not found');
    }
    return room;
  }

  async updateRoom(
    id: string,
    data: {
      roomNumber?: string;
      roomTypeId?: string;
      floorId?: string;
      notes?: string;
      companyId?: string;
      brandId?: string;
      branchId?: string;
      isActive?: boolean;
    }
  ): Promise<Room> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Room not found');
    }

    const nextRoomNumber = data.roomNumber ?? existing.roomNumber;
    const nextBranchId = data.branchId ?? existing.branchId;

    if (
      nextRoomNumber !== existing.roomNumber ||
      nextBranchId !== existing.branchId
    ) {
      const exists = await this.repo.existsByRoomNumberInBranch(
        nextRoomNumber,
        nextBranchId
      );
      if (exists) {
        throw new Error(
          'Room with this room number already exists in this branch'
        );
      }
    }

    if (data.roomTypeId) {
      const roomTypeRepository = AppDataSource.getRepository('RoomType');
      const roomType = await roomTypeRepository.findOne({
        where: { id: data.roomTypeId },
      });
      if (!roomType) {
        throw new Error('RoomType not found');
      }
    }

    if (data.floorId) {
      const floorRepository = AppDataSource.getRepository('Floor');
      const floor = await floorRepository.findOne({
        where: { id: data.floorId },
      });
      if (!floor) {
        throw new Error('Floor not found');
      }
    }

    if (data.companyId) {
      const companyRepository = AppDataSource.getRepository('Company');
      const company = await companyRepository.findOne({
        where: { id: data.companyId },
      });
      if (!company) {
        throw new Error('Company not found');
      }
    }

    if (data.brandId) {
      const brandRepository = AppDataSource.getRepository('Brand');
      const brand = await brandRepository.findOne({
        where: { id: data.brandId },
      });
      if (!brand) {
        throw new Error('Brand not found');
      }
    }

    if (data.branchId) {
      const branchRepository = AppDataSource.getRepository('Branch');
      const branch = await branchRepository.findOne({
        where: { id: data.branchId },
      });
      if (!branch) {
        throw new Error('Branch not found');
      }
    }

    const updateData: Partial<Room> = {
      roomNumber: data.roomNumber,
      roomTypeId: data.roomTypeId,
      floorId: data.floorId,
      notes: data.notes,
      companyId: data.companyId,
      brandId: data.brandId,
      branchId: data.branchId,
      isActive: data.isActive,
    };

    return await this.repo.update(id, updateData);
  }

  async deleteRoom(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getActiveRooms(): Promise<Pick<Room, 'id' | 'roomNumber'>[]> {
    return await this.repo.findActive();
  }

  async toggleRoomStatus(id: string): Promise<Room> {
    return await this.repo.toggleStatus(id);
  }

  async createRoomsBulk(
    rooms: {
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

      // Cache floors during bulk creation to avoid repeated DB calls
      const floorCache: Record<string, string> = {};

      for (const roomData of rooms) {
        const exists = await this.repo.existsByRoomNumberInBranch(
          roomData.roomNumber,
          roomData.branchId
        );
        if (exists) {
          throw new Error(
            `Room number ${roomData.roomNumber} already exists in this branch`
          );
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

        // If floor number is provided but no floorId, resolve or create the floor
        if (!resolvedFloorId && roomData.floor !== undefined && roomData.floor !== null) {
          const cacheKey = `${roomData.branchId}-${roomData.floor}`;
          if (floorCache[cacheKey]) {
            resolvedFloorId = floorCache[cacheKey];
          } else {
            let floorEntity = await floorRepository.findOne({
              where: { branchId: roomData.branchId, floorNumber: roomData.floor }
            });

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


