import { Request, Response } from 'express';
import { RoomTypeAmenityService } from '../services/roomTypeAmenityService';
import { SendSuccess, SendError } from '../utils/response';

const service = new RoomTypeAmenityService();

export const createRoomTypeAmenity = async (req: Request, res: Response) => {
  try {
    const { roomTypeId, amenityId } = req.body;
    const entity = await service.createRoomTypeAmenity({
      roomTypeId,
      amenityId,
    });

    return SendSuccess(res, 'RoomTypeAmenity created successfully', entity, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
        ? 404
        : 500;
    return SendError(res, 'Error creating RoomTypeAmenity', statusCode, error);
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

    return SendSuccess(res, 'RoomTypeAmenities retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be')
      ? 400
      : 500;
    return SendError(res, 'Error retrieving RoomTypeAmenities', statusCode, error);
  }
};

export const getRoomTypeAmenityById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const entity = await service.getRoomTypeAmenityById(id);
    return SendSuccess(res, 'RoomTypeAmenity retrieved successfully', entity);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving RoomTypeAmenity', statusCode, error);
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
    return SendSuccess(res, 'RoomTypeAmenity updated successfully', entity);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : 500;
    return SendError(res, 'Error updating RoomTypeAmenity', statusCode, error);
  }
};

export const getActiveRoomTypeAmenities = async (
  req: Request,
  res: Response
) => {
  try {
    const list = await service.getActiveRoomTypeAmenities();
    return SendSuccess(res, 'Active RoomTypeAmenities retrieved successfully', list);
  } catch (error: any) {
    return SendError(res, 'Error retrieving active RoomTypeAmenities', 500, error);
  }
};

export const toggleRoomTypeAmenityStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const entity = await service.toggleRoomTypeAmenityStatus(id);
    return SendSuccess(res, 'RoomTypeAmenity status toggled successfully', entity);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling RoomTypeAmenity status', statusCode, error);
  }
};

export const deleteRoomTypeAmenity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    await service.deleteRoomTypeAmenity(id);
    return SendSuccess(res, 'RoomTypeAmenity deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting RoomTypeAmenity', statusCode, error);
  }
};
