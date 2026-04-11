import { Request, Response } from 'express';
import { RoomTypeAmenityService } from '../services/roomTypeAmenityService';

const service = new RoomTypeAmenityService();

export const createRoomTypeAmenity = async (req: Request, res: Response) => {
  try {
    const { roomTypeId, amenityId } = req.body;
    const entity = await service.createRoomTypeAmenity({
      roomTypeId,
      amenityId,
    });

    res.status(201).json({
      success: true,
      message: 'RoomTypeAmenity created successfully',
      data: entity,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
      ? 404
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating RoomTypeAmenity',
      error: error.message,
    });
  }
};

export const getAllRoomTypeAmenities = async (
  req: Request,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await service.getAllRoomTypeAmenitiesPaginated(
      page,
      limit,
      search
    );

    res.status(200).json({
      success: true,
      message: 'RoomTypeAmenities retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be')
      ? 400
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving RoomTypeAmenities',
      error: error.message,
    });
  }
};

export const getRoomTypeAmenityById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const entity = await service.getRoomTypeAmenityById(id);
    res.status(200).json({
      success: true,
      message: 'RoomTypeAmenity retrieved successfully',
      data: entity,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving RoomTypeAmenity',
      error: error.message,
    });
  }
};

export const updateRoomTypeAmenity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { roomTypeId, amenityId, isActive } = req.body;
    const entity = await service.updateRoomTypeAmenity(id, {
      roomTypeId,
      amenityId,
      isActive,
    });
    res.status(200).json({
      success: true,
      message: 'RoomTypeAmenity updated successfully',
      data: entity,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating RoomTypeAmenity',
      error: error.message,
    });
  }
};

export const getActiveRoomTypeAmenities = async (
  req: Request,
  res: Response
) => {
  try {
    const list = await service.getActiveRoomTypeAmenities();
    res.status(200).json({
      success: true,
      message: 'Active RoomTypeAmenities retrieved successfully',
      data: list,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active RoomTypeAmenities',
      error: error.message,
    });
  }
};

export const toggleRoomTypeAmenityStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const entity = await service.toggleRoomTypeAmenityStatus(id);
    res.status(200).json({
      success: true,
      message: 'RoomTypeAmenity status toggled successfully',
      data: entity,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error toggling RoomTypeAmenity status',
      error: error.message,
    });
  }
};

export const deleteRoomTypeAmenity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await service.deleteRoomTypeAmenity(id);
    res.status(200).json({
      success: true,
      message: 'RoomTypeAmenity deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting RoomTypeAmenity',
      error: error.message,
    });
  }
};
