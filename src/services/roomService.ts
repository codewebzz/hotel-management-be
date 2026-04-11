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
    floor?: number;
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
      floor: data.floor,
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
    search?: string
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

    const result = await this.repo.findAllPaginated(page, limit, search);
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
      floor?: number;
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
      floor: data.floor,
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
}

