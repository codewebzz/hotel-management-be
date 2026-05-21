import { Request, Response } from 'express';
import { RoomTypeService } from '../services/roomTypeService';
import { AppDataSource } from '../config/database';
import { SendSuccess, SendError } from '../utils/response';

const service = new RoomTypeService();

export const createRoomType = async (req: Request, res: Response) => {
  try {
    const { name, description, branchId } = req.body;
    const rt = await service.createRoomType({ name, description, branchId });
    return SendSuccess(res, 'RoomType created successfully', rt, 201);
  } catch (err: any) {
    const status = err.message.includes('already exists') ? 409 : err.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error creating RoomType', status, err);
  }
};

export const getAllRoomTypes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const result = await service.getAllRoomTypesPaginated(page, limit, search);
    return SendSuccess(res, 'RoomTypes retrieved successfully', result.data, 200, {
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err: any) {
    const status = err.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving RoomTypes', status, err);
  }
};

export const getRoomTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rt = await service.getRoomTypeById(id);
    return SendSuccess(res, 'RoomType retrieved successfully', rt);
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving RoomType', status, err);
  }
};

export const updateRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, branchId, isActive } = req.body;
    const rt = await service.updateRoomType(id, { name, description, branchId, isActive }, AppDataSource);
    return SendSuccess(res, 'RoomType updated successfully', rt);
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : err.message.includes('already exists') ? 409 : 500;
    return SendError(res, 'Error updating RoomType', status, err);
  }
};

export const deleteRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.deleteRoomType(id);
    return SendSuccess(res, 'RoomType deleted successfully', { id });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting RoomType', status, err);
  }
};

export const getActiveRoomTypes = async (req: Request, res: Response) => {
  try {
    const list = await service.getActiveRoomTypes();
    return SendSuccess(res, 'Active RoomTypes retrieved successfully', list);
  } catch (err: any) {
    return SendError(res, 'Error retrieving active RoomTypes', 500, err);
  }
};

export const toggleRoomTypeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rt = await service.toggleRoomTypeStatus(id);
    return SendSuccess(res, `RoomType ${rt.isActive ? 'activated' : 'deactivated'} successfully`, rt);
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling RoomType status', status, err);
  }
};