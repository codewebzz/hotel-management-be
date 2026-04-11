import { HousekeepingLogRepository } from '../repositories/housekeepingLogRepository';
import { HousekeepingLog } from '../entities/HousekeepingLog';
import { AppDataSource } from '../config/database';

export class HousekeepingLogService {
  private repo: HousekeepingLogRepository;

  constructor() {
    this.repo = new HousekeepingLogRepository();
  }

  async createLog(data: {
    roomId: string;
    staffId: string;
    branchId: string;
    shift?: string;
    status: string;
    assignedAt?: string;
    startTime?: string;
    completedAt?: string;
    notes?: string;
  }): Promise<HousekeepingLog> {
    const roomRepo = AppDataSource.getRepository('Room');
    const room = await roomRepo.findOne({ where: { id: data.roomId } });
    if (!room) {
      throw new Error('Room not found');
    }

    const staffRepo = AppDataSource.getRepository('Staff');
    const staff = await staffRepo.findOne({ where: { id: data.staffId } });
    if (!staff) {
      throw new Error('Staff not found');
    }

    const branchRepo = AppDataSource.getRepository('Branch');
    const branch = await branchRepo.findOne({ where: { id: data.branchId } });
    if (!branch) {
      throw new Error('Branch not found');
    }

    if (room.branchId !== data.branchId) {
      throw new Error('Room does not belong to the specified branch');
    }
    if (staff.branchId !== data.branchId) {
      throw new Error('Staff does not belong to the specified branch');
    }

    const entity = await this.repo.create({
      roomId: data.roomId,
      staffId: data.staffId,
      branchId: data.branchId,
      shift: data.shift,
      status: data.status,
      assignedAt: data.assignedAt,
      startTime: data.startTime,
      completedAt: data.completedAt,
      notes: data.notes,
    });
    return entity;
  }

  async getAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<{ data: HousekeepingLog[]; total: number; page: number; limit: number; totalPages: number }> {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    const result = await this.repo.findAllPaginated(page, limit, search);
    return { ...result, totalPages: Math.ceil(result.total / limit) };
  }

  async getById(id: string): Promise<HousekeepingLog> {
    const log = await this.repo.findById(id);
    if (!log) {
      throw new Error('Housekeeping log not found');
    }
    return log;
  }

  async updateLog(
    id: string,
    data: {
      roomId?: string;
      staffId?: string;
      branchId?: string;
      shift?: string;
      status?: string;
      assignedAt?: string;
      startTime?: string;
      completedAt?: string;
      notes?: string;
    }
  ): Promise<HousekeepingLog> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Housekeeping log not found');
    }

    const nextRoomId = data.roomId ?? existing.roomId;
    const nextStaffId = data.staffId ?? existing.staffId;
    const nextBranchId = data.branchId ?? existing.branchId;

    if (data.roomId) {
      const roomRepo = AppDataSource.getRepository('Room');
      const room = await roomRepo.findOne({ where: { id: data.roomId } });
      if (!room) {
        throw new Error('Room not found');
      }
    }
    if (data.staffId) {
      const staffRepo = AppDataSource.getRepository('Staff');
      const staff = await staffRepo.findOne({ where: { id: data.staffId } });
      if (!staff) {
        throw new Error('Staff not found');
      }
    }
    if (data.branchId) {
      const branchRepo = AppDataSource.getRepository('Branch');
      const branch = await branchRepo.findOne({ where: { id: data.branchId } });
      if (!branch) {
        throw new Error('Branch not found');
      }
    }

    const updateData: Partial<HousekeepingLog> = {
      roomId: nextRoomId,
      staffId: nextStaffId,
      branchId: nextBranchId,
      shift: data.shift,
      status: data.status,
      assignedAt: data.assignedAt,
      startTime: data.startTime,
      completedAt: data.completedAt,
      notes: data.notes,
    };

    return await this.repo.update(id, updateData);
  }

  async deleteLog(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
