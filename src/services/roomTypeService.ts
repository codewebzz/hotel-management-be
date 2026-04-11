import { RoomTypeRepository } from '../repositories/roomTypeRepository';
import { RoomType } from '../entities/RoomType';
import { AppDataSource } from '../config/database';

export class RoomTypeService {
  private repo: RoomTypeRepository;

  constructor() {
    this.repo = new RoomTypeRepository();
  }

  async createRoomType(data: { name: string; description?: string; branchId: string; }) : Promise<RoomType> {
    // branchId required
    if (!data.branchId) throw new Error('branchId is required');

    const existing = await this.repo.findByName(data.name);
    if (existing) throw new Error('RoomType with this name already exists');

    // ensure branch exists
    const branch = await AppDataSource.getRepository('Branch').findOne({ where: { id: data.branchId } });
    if (!branch) throw new Error('Branch not found');

    const rt = await this.repo.create({ ...data, isActive: true });
    return rt;
  }

  async getAllRoomTypesPaginated(page = 1, limit = 10, search?: string) {
    if (page < 1) throw new Error('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100');
    const result = await this.repo.findAllPaginated(page, limit, search);
    return { ...result, totalPages: Math.ceil(result.total / limit) };
  }

  async getRoomTypeById(id: string) {
    const rt = await this.repo.findById(id);
    if (!rt) throw new Error('RoomType not found');
    return rt;
  }

  async updateRoomType(id: string, data: { name?: string; description?: string; branchId?: string; isActive?: boolean; }, AppDataSourceParam?: any) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error('RoomType not found');

    if (data.name && data.name !== existing.name) {
      const nameExists = await this.repo.existsByName(data.name);
      if (nameExists) throw new Error('RoomType with this name already exists');
    }

    if (data.branchId) {
      const branch = await AppDataSource.getRepository('Branch').findOne({ where: { id: data.branchId } });
      if (!branch) throw new Error('Branch not found');
    }

    const updateData: any = { name: data.name, description: data.description, isActive: data.isActive };
    if (data.branchId !== undefined) updateData.branchId = data.branchId;

    return await this.repo.update(id, updateData);
  }

  async deleteRoomType(id: string) {
    await this.repo.delete(id);
  }

  async getActiveRoomTypes() {
    return await this.repo.findActive();
  }

  async toggleRoomTypeStatus(id: string) {
    return await this.repo.toggleStatus(id);
  }
}
