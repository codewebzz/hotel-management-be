import { Request, Response } from 'express';
import { BrandService } from '../services/brandService';
import { AppDataSource } from '../config/database';
import { SendSuccess, SendError } from '../utils/response';

const brandService = new BrandService();

// Get brands by company ID (for lazy nested table)
export const getBrandsByCompany = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await brandService.getBrandsByCompanyId(companyId, page, limit);

    return SendSuccess(res, 'Brands retrieved successfully', result.data, 200, {
      total: result.total,
    });
  } catch (error: any) {
    return SendError(res, 'Error retrieving brands by company', 500, error);
  }
};

// Create a new brand
export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, lat, long, companyId } = req.body;

    if (!name) {
      return SendError(res, 'Brand name is required', 400);
    }
    if (!companyId) {
      return SendError(res, 'Company ID is required', 400);
    }

    const brand = await brandService.createBrand({
      name,
      email,
      phone,
      address,
      lat,
      long,
      companyId,
    }, AppDataSource);

    return SendSuccess(res, 'Brand created successfully', brand, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error creating brand', statusCode, error);
  }
};

// Get all brands with pagination
export const getAllBrands = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await brandService.getAllBrandsPaginated(page, limit, search);

    return SendSuccess(res, 'Brands retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    return SendError(res, 'Error retrieving brands', 500, error);
  }
};

// Get brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const brand = await brandService.getBrandById(id);

    return SendSuccess(res, 'Brand retrieved successfully', brand);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving brand', statusCode, error);
  }
};

// Update brand
export const updateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, lat, long, isActive, companyId } = req.body;

    const brand = await brandService.updateBrand(id, {
      name,
      email,
      phone,
      address,
      lat,
      long,
      isActive,
      companyId,
    }, AppDataSource);

    return SendSuccess(res, 'Brand updated successfully', brand);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : 500;
    return SendError(res, 'Error updating brand', statusCode, error);
  }
};

// Delete brand
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await brandService.deleteBrand(id);

    return SendSuccess(res, 'Brand deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting brand', statusCode, error);
  }
};

// Get active brands (for dropdown)
export const getActiveBrands = async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getActiveBrands();

    return SendSuccess(res, 'Active brands retrieved successfully', brands);
  } catch (error: any) {
    return SendError(res, 'Error retrieving active brands', 500, error);
  }
};

// Toggle brand status
export const toggleBrandStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const brand = await brandService.toggleBrandStatus(id);

    return SendSuccess(res, 'Brand status toggled successfully', brand);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling brand status', statusCode, error);
  }
};
