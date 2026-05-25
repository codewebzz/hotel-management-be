import { Request, Response } from 'express';
import { FloorService } from '../services/floorService';
import { createFloorSchema } from '../validators/floor.validator';
import { AppDataSource } from '../config/database';
import { Branch } from '../entities/Branch';

const floorService = new FloorService();

export const getFloorsByBranch = async (req: any, res: Response) => {
  try {
    const branchId = req.user?.branchId;
    if (!branchId) {
      return res.status(400).json({ success: false, error: 'User branch not found' });
    }
    const floors = await floorService.getAllByBranch(branchId);
    res.json({ success: true, data: floors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createFloor = async (req: any, res: Response) => {
  try {
    const branchId = req.user?.branchId;

    if (!branchId) {
        return res.status(400).json({ success: false, error: 'User branch not found in context' });
    }

    const branchRepository = AppDataSource.getRepository(Branch);
    const branch = await branchRepository.findOne({
      where: { id: branchId },
      relations: ['brand']
    });

    if (!branch) {
      return res.status(404).json({ success: false, error: 'Branch not found' });
    }

    const brandId = branch.brandId;
    const companyId = branch.brand?.companyId;

    if (!brandId || !companyId) {
      return res.status(400).json({ success: false, error: 'Could not resolve brand or company for this branch' });
    }

    const data = createFloorSchema.parse(req.body);

    const floor = await floorService.createFloor({
        ...data,
        branchId,
        companyId,
        brandId
    });
    res.status(201).json({ success: true, data: floor, message: 'Floor created successfully' });
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ success: false, error: error.errors });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};
