import { Request, Response } from 'express';
import { RoomService } from '../services/roomService';

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
      return res.status(400).json({ message: 'Room number is required' });
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

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
      ? 404
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating room',
      error: error.message,
    });
  }
};

export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await roomService.getAllRoomsPaginated(page, limit, search);

    res.status(200).json({
      success: true,
      message: 'Rooms retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving rooms',
      error: error.message,
    });
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await roomService.getRoomById(id);

    res.status(200).json({
      success: true,
      message: 'Room retrieved successfully',
      data: room,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving room',
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating room',
      error: error.message,
    });
  }
};

export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await roomService.deleteRoom(id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting room',
      error: error.message,
    });
  }
};

export const getActiveRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await roomService.getActiveRooms();

    res.status(200).json({
      success: true,
      message: 'Active rooms retrieved successfully',
      data: rooms,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active rooms',
      error: error.message,
    });
  }
};

export const toggleRoomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await roomService.toggleRoomStatus(id);

    res.status(200).json({
      success: true,
      message: 'Room status toggled successfully',
      data: room,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error toggling room status',
      error: error.message,
    });
  }
};

