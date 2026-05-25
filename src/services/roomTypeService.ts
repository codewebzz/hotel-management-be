import { RoomTypeRepository } from '../repositories/roomTypeRepository';
import { RoomTypeAmenityRepository } from '../repositories/roomTypeAmenityRepository';
import { RoomType } from '../entities/RoomType';
import { AppDataSource } from '../config/database';

export class RoomTypeService {
  private repo: RoomTypeRepository;
  private rtaRepo: RoomTypeAmenityRepository;

  constructor() {
    this.repo = new RoomTypeRepository();
    this.rtaRepo = new RoomTypeAmenityRepository();
  }

  async createRoomType(data: { name: string; description?: string; branchId: string; amenityIds?: string[]; }): Promise<RoomType> {
    // branchId required
    if (!data.branchId) throw new Error('branchId is required');

    const existing = await this.repo.findByName(data.name);
    if (existing) throw new Error('RoomType with this name already exists');

    // ensure branch exists
    const branch = await AppDataSource.getRepository('Branch').findOne({ where: { id: data.branchId } });
    if (!branch) throw new Error('Branch not found');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Use repository functions with transaction manager
      const rt = await this.repo.create({
        name: data.name,
        description: data.description,
        branchId: data.branchId,
        isActive: true,
      }, queryRunner.manager);

      if (data.amenityIds && data.amenityIds.length > 0) {
        for (const amenityId of data.amenityIds) {
          await this.rtaRepo.create({
            roomTypeId: rt.id,
            amenityId,
            isActive: true,
          }, queryRunner.manager);
        }
      }

      await queryRunner.commitTransaction();
      const finalResult = await this.repo.findById(rt.id);
      return finalResult!;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllRoomTypesPaginated(page = 1, limit = 10, search?: string, branchId?: string) {
    if (page < 1) throw new Error('Page must be greater than 0');
    if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100');
    const result = await this.repo.findAllPaginated(page, limit, search, branchId);
    return { ...result, totalPages: Math.ceil(result.total / limit) };
  }

  async getRoomTypeById(id: string) {
    const rt = await this.repo.findById(id);
    if (!rt) throw new Error('RoomType not found');
    return rt;
  }

  async updateRoomType(id: string, data: { name?: string; description?: string; branchId?: string; isActive?: boolean; amenityIds?: string[]; }, AppDataSourceParam?: any) {
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

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const updateData: any = { name: data.name, description: data.description, isActive: data.isActive };
      if (data.branchId !== undefined) updateData.branchId = data.branchId;

      // Use repository update function with transaction manager
      await this.repo.update(id, updateData, queryRunner.manager);

      if (data.amenityIds !== undefined) {
        // Use repository deleteByRoomTypeId function with transaction manager
        await this.rtaRepo.deleteByRoomTypeId(id, queryRunner.manager);
        
        if (data.amenityIds.length > 0) {
          for (const amenityId of data.amenityIds) {
            await this.rtaRepo.create({
              roomTypeId: id,
              amenityId,
              isActive: true,
            }, queryRunner.manager);
          }
        }
      }

      await queryRunner.commitTransaction();
      const finalResult = await this.repo.findById(id);
      return finalResult!;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
