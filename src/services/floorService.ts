import { AppDataSource } from '../config/database';
import { Floor } from '../entities/Floor';
import { CreateFloorInput } from '../validators/floor.validator';

export class FloorService {
  private repo = AppDataSource.getRepository(Floor);

  async getAllByBranch(branchId: string): Promise<Floor[]> {
    return await this.repo.find({
      where: { branchId, isActive: true },
      order: { floorNumber: 'ASC' },
    });
  }

  async createFloor(data: CreateFloorInput & { branchId: string; companyId: string; brandId: string }): Promise<Floor> {
    const floor = this.repo.create(data);
    return await this.repo.save(floor);
  }
}
