import { Request, Response } from 'express';
import { BrandService } from '../services/brandService';
import { AppDataSource } from '../config/database';

const brandService = new BrandService();

// Create a new brand
export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, lat, long, branchId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required' });
    }

    const brand = await brandService.createBrand({
      name,
      email,
      phone,
      address,
      lat,
      long,
      branchId,
    }, AppDataSource);

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: brand,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating brand',
      error: error.message,
    });
  }
};

// Get all brands with pagination
export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await brandService.getAllBrandsPaginated(page, limit, search);

    res.status(200).json({
      success: true,
      message: 'Brands retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving brands',
      error: error.message,
    });
  }
};

// Get brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const brand = await brandService.getBrandById(id);

    res.status(200).json({
      success: true,
      message: 'Brand retrieved successfully',
      data: brand,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving brand',
      error: error.message,
    });
  }
};

// Update brand
export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, lat, long, branchId, isActive } = req.body;

    const brand = await brandService.updateBrand(id, {
      name,
      email,
      phone,
      address,
      lat,
      long,
      branchId,
      isActive,
    }, AppDataSource);

    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating brand',
      error: error.message,
    });
  }
};

// Delete brand
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await brandService.deleteBrand(id);

    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting brand',
      error: error.message,
    });
  }
};

// Get active brands (for dropdown)
export const getActiveBrands = async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getActiveBrands();

    res.status(200).json({
      success: true,
      message: 'Active brands retrieved successfully',
      data: brands,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active brands',
      error: error.message,
    });
  }
};

// Toggle brand status
export const toggleBrandStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const brand = await brandService.toggleBrandStatus(id);

    res.status(200).json({
      success: true,
      message: `Brand status toggled successfully`,
      data: brand,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error toggling brand status',
      error: error.message,
    });
  }
};
