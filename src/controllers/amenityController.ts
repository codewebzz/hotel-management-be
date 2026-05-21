import { Request, Response } from 'express';
import { AmenityService } from '../services/amenityService';
import { SendSuccess, SendError } from '../utils/response';

const amenityService = new AmenityService();

// Create a new amenity
export const createAmenity = async (req: Request, res: Response) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return SendError(res, 'Amenity name is required', 400);
    }

    const amenity = await amenityService.createAmenity({
      name,
      description,
      icon,
    });

    return SendSuccess(res, 'Amenity created successfully', amenity, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : 500;
    return SendError(res, 'Error creating amenity', statusCode, error);
  }
};

// Get all amenities with pagination
export const getAllAmenities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate pagination parameters
    if (page < 1) {
      return SendError(res, 'Page number must be greater than 0', 400);
    }

    if (limit < 1 || limit > 100) {
      return SendError(res, 'Limit must be between 1 and 100', 400);
    }

    const result = await amenityService.getAllAmenities({ page, limit });

    return SendSuccess(res, 'Amenities retrieved successfully', result.data, 200, {
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    return SendError(res, 'Error retrieving amenities', 500, error);
  }
};

// Get all amenities without pagination
export const getAllAmenitiesWithoutPagination = async (req: Request, res: Response) => {
  try {
    const amenities = await amenityService.getAllAmenitiesWithoutPagination();

    return SendSuccess(res, 'Amenities retrieved successfully', amenities);
  } catch (error: any) {
    return SendError(res, 'Error retrieving amenities', 500, error);
  }
};

// Get amenity by ID
export const getAmenityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const amenity = await amenityService.getAmenityById(id);

    return SendSuccess(res, 'Amenity retrieved successfully', amenity);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving amenity', statusCode, error);
  }
};

// Update amenity (excluding icon - use separate endpoint for icon)
export const updateAmenity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;

    const amenity = await amenityService.updateAmenity(id, {
      name,
      description,
      isActive,
      icon
    });

    return SendSuccess(res, 'Amenity updated successfully', amenity);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : 500;
    return SendError(res, 'Error updating amenity', statusCode, error);
  }
};

// Delete amenity
export const deleteAmenity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await amenityService.deleteAmenity(id);

    return SendSuccess(res, 'Amenity deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting amenity', statusCode, error);
  }
};
