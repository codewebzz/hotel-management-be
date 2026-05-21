import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';
import { SendSuccess, SendError } from '../utils/response';

const roomService = new RoomService();

export const createRoom = async (req: Request, res: Response) => {
  try {
    const {
      roomNumber,
      roomTypeId,
      floor,
      notes,
      companyId,
      brandId,
      branchId,
    } = req.body;

    if (!roomNumber) {
      return SendError(res, 'Room number is required', 400);
    }

    const room = await roomService.createRoom({
      roomNumber,
      roomTypeId,
      floor,
      notes,
      companyId,
      brandId,
      branchId,
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

    const result = await roomService.getAllRoomsPaginated(page, limit, search);

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
      floor,
      notes,
      companyId,
      brandId,
      branchId,
      isActive,
    } = req.body;

    const room = await roomService.updateRoom(id, {
      roomNumber,
      roomTypeId,
      floor,
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
