import { Request, Response } from 'express';
import { RoomTypeService } from '../services/roomTypeService';
import { AppDataSource } from '../config/database';

const service = new RoomTypeService();

export const createRoomType = async (req: Request, res: Response) => {
  try {
    const { name, description, branchId } = req.body;
    const rt = await service.createRoomType({ name, description, branchId });
    res.status(201).json({ success: true, message: 'RoomType created', data: rt });
  } catch (err: any) {
    const status = err.message.includes('already exists') ? 409 : err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: 'Error creating RoomType', error: err.message });
  }
};

export const getAllRoomTypes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const result = await service.getAllRoomTypesPaginated(page, limit, search);
    res.status(200).json({ success: true, message: 'RoomTypes retrieved', data: result.data, pagination: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
  } catch (err: any) {
    const status = err.message.includes('must be') ? 400 : 500;
    res.status(status).json({ success: false, message: 'Error retrieving RoomTypes', error: err.message });
  }
};

export const getRoomTypeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rt = await service.getRoomTypeById(id);
    res.status(200).json({ success: true, message: 'RoomType retrieved', data: rt });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: 'Error retrieving RoomType', error: err.message });
  }
};

export const updateRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, branchId, isActive } = req.body;
    const rt = await service.updateRoomType(id, { name, description, branchId, isActive }, AppDataSource);
    res.status(200).json({ success: true, message: 'RoomType updated', data: rt });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : err.message.includes('already exists') ? 409 : 500;
    res.status(status).json({ success: false, message: 'Error updating RoomType', error: err.message });
  }
};

export const deleteRoomType = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await service.deleteRoomType(id);
    res.status(200).json({ success: true, message: 'RoomType deleted', data: { id } });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: 'Error deleting RoomType', error: err.message });
  }
};

export const getActiveRoomTypes = async (req: Request, res: Response) => {
  try {
    const list = await service.getActiveRoomTypes();
    res.status(200).json({ success: true, message: 'Active RoomTypes', data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error retrieving active RoomTypes', error: err.message });
  }
};

export const toggleRoomTypeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rt = await service.toggleRoomTypeStatus(id);
    res.status(200).json({ success: true, message: `RoomType ${rt.isActive ? 'activated' : 'deactivated'} successfully`, data: rt });
  } catch (err: any) {
    const status = err.message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, message: 'Error toggling RoomType status', error: err.message });
  }
};