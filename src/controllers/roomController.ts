import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';
import { SendSuccess, SendError } from '../utils/response';
import { AppDataSource } from '../config/database';
import { Branch } from '../entities/Branch';

const roomService = new RoomService();

export const createRoom = async (req: Request, res: Response) => {
  try {
    const {
      roomNumber,
      roomTypeId,
      floorId,
      notes,
      branchId,
    } = req.body;

    if (!roomNumber) {
      return SendError(res, 'Room number is required', 400);
    }

    const resolvedBranchId = branchId || (req as any).user?.branchId;
    if (!resolvedBranchId) {
      return SendError(res, 'Branch ID is required', 400);
    }

    const branch = await AppDataSource.getRepository(Branch).findOne({
      where: { id: resolvedBranchId },
      relations: ['brand'],
    });

    if (!branch) {
      return SendError(res, 'Branch not found', 404);
    }

    const resolvedBrandId = branch.brandId;
    const resolvedCompanyId = branch.brand?.companyId;

    if (!resolvedBrandId || !resolvedCompanyId) {
      return SendError(res, 'Could not resolve brand or company for this branch', 400);
    }

    const room = await roomService.createRoom({
      roomNumber,
      roomTypeId,
      floorId,
      notes,
      companyId: resolvedCompanyId,
      brandId: resolvedBrandId,
      branchId: resolvedBranchId,
    });

    return SendSuccess(res, 'Room created successfully', room, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
        ? 404
        : 500;
    return SendError(res, 'Error creating room', statusCode, error);
  }
};

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const branchId = req.query.branchId as string | undefined;

    const result = await roomService.getAllRoomsPaginated(page, limit, search, branchId);

    return SendSuccess(res, 'Rooms retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving rooms', statusCode, error);
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await roomService.getRoomById(id);

    return SendSuccess(res, 'Room retrieved successfully', room);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving room', statusCode, error);
  }
};

export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      roomNumber,
      roomTypeId,
      floorId,
      notes,
      companyId,
      brandId,
      branchId,
      isActive,
    } = req.body;

    const room = await roomService.updateRoom(id, {
      roomNumber,
      roomTypeId,
      floorId,
      notes,
      companyId,
      brandId,
      branchId,
      isActive,
    });

    return SendSuccess(res, 'Room updated successfully', room);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : 500;
    return SendError(res, 'Error updating room', statusCode, error);
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await roomService.deleteRoom(id);

    return SendSuccess(res, 'Room deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting room', statusCode, error);
  }
};

export const getActiveRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getActiveRooms();

    return SendSuccess(res, 'Active rooms retrieved successfully', rooms);
  } catch (error: any) {
    return SendError(res, 'Error retrieving active rooms', 500, error);
  }
};

export const toggleRoomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await roomService.toggleRoomStatus(id);

    return SendSuccess(res, 'Room status toggled successfully', room);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling room status', statusCode, error);
  }
};

export const changeRoomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return SendError(res, 'Status is required', 400);
    }

    const room = await roomService.changeRoomStatus(id, status);

    return SendSuccess(res, 'Room status changed successfully', room);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error changing room status', statusCode, error);
  }
};

export const getRoomStatusHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const history = await roomService.getRoomStatusHistory(id);

    return SendSuccess(res, 'Room status history retrieved successfully', history);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving room status history', statusCode, error);
  }
};

export const createRoomsBulk = async (req: Request, res: Response) => {
  try {
    const { rooms, branchId } = req.body;

    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return SendError(res, 'At least one room is required', 400);
    }

    const resolvedBranchId = branchId || (req as any).user?.branchId;
    if (!resolvedBranchId) {
      return SendError(res, 'Branch ID is required (not found in request or user profile context)', 400);
    }

    const branch = await AppDataSource.getRepository(Branch).findOne({
      where: { id: resolvedBranchId },
      relations: ['brand'],
    });

    if (!branch) {
      return SendError(res, 'Branch not found', 404);
    }

    const resolvedBrandId = branch.brandId;
    const resolvedCompanyId = branch.brand?.companyId;

    if (!resolvedBrandId || !resolvedCompanyId) {
      return SendError(res, 'Could not resolve brand or company for user branch context', 400);
    }

    // Map through rooms and attach resolved branchId, brandId, and companyId
    const processedRooms = rooms.map((room: any) => ({
      ...room,
      branchId: resolvedBranchId,
      brandId: resolvedBrandId,
      companyId: resolvedCompanyId,
    }));

    const createdRooms = await roomService.createRoomsBulk(processedRooms);

    return SendSuccess(
      res,
      'Rooms created successfully in bulk',
      createdRooms,
      201
    );
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
        ? 404
        : 500;
    return SendError(res, 'Error creating rooms in bulk', statusCode, error);
  }
};

export const getRoomsByFloor = async (req: Request, res: Response) => {
  try {
    const branchId = (req as any).user?.branchId;
    if (!branchId) {
      return SendError(res, 'User branch context not found', 400);
    }

    const result = await roomService.getRoomsByFloor(branchId);
    return SendSuccess(res, 'Rooms by floor retrieved successfully', result, 200);
  } catch (error: any) {
    return SendError(res, 'Error retrieving rooms by floor', 500, error);
  }
};

