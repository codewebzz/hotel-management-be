import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Floor } from '../entities/Floor';
import { RoomType } from '../entities/RoomType';

export const getFloorsDropdown = async (req: any, res: Response) => {
  try {
    const branchId = req.user?.branchId;
    const { isActive } = req.query; // example filter

    if (!branchId) {
      return res.status(400).json({ success: false, error: 'User branch not found' });
    }

    const whereCondition: any = { branchId };
    
    // Add optional filters
    if (isActive !== undefined) {
      whereCondition.isActive = isActive === 'true';
    } else {
      whereCondition.isActive = true; // Default to active only
    }

    const floors = await AppDataSource.getRepository(Floor).find({
      where: whereCondition,
      select: ['id', 'name', 'floorNumber'],
      order: { floorNumber: 'ASC' }
    });

    const formattedFloors = floors.map(f => ({
      label: `${f.name} (Floor ${f.floorNumber})`,
      value: f.id,
      floorNumber: f.floorNumber
    }));

    return res.json({ success: true, data: formattedFloors });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRoomTypesDropdown = async (req: any, res: Response) => {
  try {
    const branchId = req.user?.branchId;
    const { isActive } = req.query; // example filter

    if (!branchId) {
      return res.status(400).json({ success: false, error: 'User branch not found' });
    }

    const whereCondition: any = { branchId };
    
    // Add optional filters
    if (isActive !== undefined) {
      whereCondition.isActive = isActive === 'true';
    } else {
      whereCondition.isActive = true; // Default to active only
    }

    const roomTypes = await AppDataSource.getRepository(RoomType).find({
      where: whereCondition,
      select: ['id', 'name'],
      order: { createdAt: 'DESC' }
    });

    const formattedRoomTypes = roomTypes.map(rt => ({
      label: rt.name,
      value: rt.id
    }));

    return res.json({ success: true, data: formattedRoomTypes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
