import { Request, Response } from 'express';
import { AmenityService } from '../services/amenityService';

const amenityService = new AmenityService();

// Create a new amenity
export const createAmenity = async (req: Request, res: Response) => {
  try {
    const { name, description, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Amenity name is required' });
    }

    const amenity = await amenityService.createAmenity({
      name,
      description,
      icon,
    });

    res.status(201).json({
      success: true,
      message: 'Amenity created successfully',
      data: amenity,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating amenity',
      error: error.message,
    });
  }
};

// Get all amenities with pagination
export const getAllAmenities = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Page number must be greater than 0',
      });
    }

    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100',
      });
    }

    const result = await amenityService.getAllAmenities({ page, limit });

    res.status(200).json({
      success: true,
      message: 'Amenities retrieved successfully',
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving amenities',
      error: error.message,
    });
  }
};

// Get all amenities without pagination
export const getAllAmenitiesWithoutPagination = async (req: Request, res: Response) => {
  try {
    const amenities = await amenityService.getAllAmenitiesWithoutPagination();

    res.status(200).json({
      success: true,
      message: 'Amenities retrieved successfully',
      data: amenities,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving amenities',
      error: error.message,
    });
  }
};

// Get amenity by ID
export const getAmenityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const amenity = await amenityService.getAmenityById(id);

    res.status(200).json({
      success: true,
      message: 'Amenity retrieved successfully',
      data: amenity,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving amenity',
      error: error.message,
    });
  }
};

// Update amenity (excluding icon - use separate endpoint for icon)
export const updateAmenity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, icon,isActive } = req.body;

    const amenity = await amenityService.updateAmenity(id, {
      name,
      description,
      isActive,
      icon
    });

    res.status(200).json({
      success: true,
      message: 'Amenity updated successfully',
      data: amenity,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating amenity',
      error: error.message,
    });
  }
};


// Delete amenity
export const deleteAmenity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await amenityService.deleteAmenity(id);

    res.status(200).json({
      success: true,
      message: 'Amenity deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting amenity',
      error: error.message,
    });
  }
};



