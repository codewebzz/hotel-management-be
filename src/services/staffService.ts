import { StaffRepository } from '../repositories/staffRepository';
import { Staff } from '../entities/Staff';
import { AppDataSource } from '../config/database';

export class StaffService {
  private repo: StaffRepository;

  constructor() {
    this.repo = new StaffRepository();
  }

  async createStaff(data: {
    userId: string;
    position: string;
    salary: number;
    joinDate: string;
    shiftTiming?: string;
  }): Promise<Staff> {
    const userRepo = AppDataSource.getRepository('User');
    const user = await userRepo.findOne({ where: { id: data.userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const dup = await this.repo.findByUser(data.userId);
    if (dup) {
      throw new Error('Staff with this user already exists');
    }

    const entity = await this.repo.create({
      userId: data.userId,
      position: data.position,
      salary: data.salary,
      joinDate: data.joinDate,
      shiftTiming: data.shiftTiming,
      isActive: true,
    });
    return entity;
  }

  async getAllStaffPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
    branchId?: string
  ): Promise<{ data: Staff[]; total: number; page: number; limit: number; totalPages: number }> {
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
    const result = await this.repo.findAllPaginated(page, limit, search, branchId);
    return { ...result, totalPages: Math.ceil(result.total / limit) };
  }

  async getStaffById(id: string): Promise<Staff> {
    const staff = await this.repo.findById(id);
    if (!staff) {
      throw new Error('Staff not found');
    }
    return staff;
  }

  async updateStaff(
    id: string,
    data: {
      userId?: string;
      position?: string;
      salary?: number;
      joinDate?: string;
      shiftTiming?: string;
      isActive?: boolean;
    }
  ): Promise<Staff> {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new Error('Staff not found');
    }

    const nextUserId = data.userId ?? existing.userId;
    if (nextUserId !== existing.userId) {
      const duplicate = await this.repo.findByUser(nextUserId);
      if (duplicate && duplicate.id !== id) {
        throw new Error('Staff with this user already exists');
      }
    }

    if (data.userId) {
      const userRepo = AppDataSource.getRepository('User');
      const user = await userRepo.findOne({ where: { id: data.userId } });
      if (!user) {
        throw new Error('User not found');
      }
    }

    const updateData: Partial<Staff> = {
      userId: data.userId,
      position: data.position,
      salary: data.salary,
      joinDate: data.joinDate,
      shiftTiming: data.shiftTiming,
      isActive: data.isActive,
    };

    return await this.repo.update(id, updateData);
  }

  async deleteStaff(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getActiveStaff(): Promise<Pick<Staff, 'id' | 'position'>[]> {
    return await this.repo.findActive();
  }

  async toggleStaffStatus(id: string): Promise<Staff> {
    return await this.repo.toggleStatus(id);
  }
}

