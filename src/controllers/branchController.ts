import { Request, Response } from "express";
import { BranchService } from "../services/branchService";
import { AppDataSource } from "../config/database";
import { Address } from "../entities/Address";
import { SendSuccess, SendError } from "../utils/response";

const branchService = new BranchService();

// Get branches by brand ID (for lazy nested table)
export const getBranchesByBrand = async (req: Request, res: Response) => {
  try {
    const { brandId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await branchService.getBranchesByBrandId(brandId, page, limit);

    return SendSuccess(res, 'Branches retrieved successfully', result.data, 200, {
      total: result.total,
    });
  } catch (error: any) {
    return SendError(res, 'Error retrieving branches by brand', 500, error);
  }
};

// Create a new branch
export const createBranch = async (req: Request, res: Response) => {
  try {
    const { name, brandId, address, lat, long } = req.body;

    // If raw address + lat/long provided, create Address record first
    let finalAddressId = undefined;
    if (address || lat || long) {
      const addressRepo = AppDataSource.getRepository(Address);
      const addressEntity = addressRepo.create({
        address,
        lat: Number(lat) || 0,
        long: Number(long) || 0,
      });
      const savedAddress = await addressRepo.save(addressEntity);
      finalAddressId = savedAddress.id;
    }

    const branch = await branchService.createBranch({
      name,
      brandId,
      addressId: finalAddressId,
    });

    return SendSuccess(res, "Branch created successfully", branch, 201);
  } catch (error: any) {
    const statusCode = error.message.includes("already exists") ? 409 : 500;
    return SendError(res, "Error creating branch", statusCode, error);
  }
};

// Get all branches with pagination
export const getAllBranches = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await branchService.getAllBranchesPaginated(page, limit, search);

    return SendSuccess(res, "Branches retrieved successfully", result.data, 200, {
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    const statusCode = error.message.includes("must be") ? 400 : 500;
    return SendError(res, "Error retrieving branches", statusCode, error);
  }
};

// Get branch by ID
export const getBranchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const branch = await branchService.getBranchById(id);

    return SendSuccess(res, "Branch retrieved successfully", branch);
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return SendError(res, "Error retrieving branch", statusCode, error);
  }
};

// Update branch
export const updateBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, brandId, address, lat, long, isActive } = req.body;

    const branch = await branchService.updateBranch(
      id,
      {
        name,
        brandId,
        address,
        lat,
        long,
        isActive,
      },
      AppDataSource
    );

    return SendSuccess(res, "Branch updated successfully", branch);
  } catch (error: any) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("already exists")
        ? 409
        : 500;
    return SendError(res, "Error updating branch", statusCode, error);
  }
};

// Delete branch
export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await branchService.deleteBranch(id);

    return SendSuccess(res, "Branch deleted successfully", { id });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return SendError(res, "Error deleting branch", statusCode, error);
  }
};

// Get active branches
export const getActiveBranches = async (req: Request, res: Response) => {
  try {
    const branches = await branchService.getActiveBranches();

    return SendSuccess(res, "Active branches retrieved successfully", branches);
  } catch (error: any) {
    return SendError(res, "Error retrieving active branches", 500, error);
  }
};

// Toggle branch status
export const toggleBranchStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const branch = await branchService.toggleBranchStatus(id);

    return SendSuccess(res, `Branch ${branch.isActive ? "activated" : "deactivated"} successfully`, branch);
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return SendError(res, "Error changing branch status", statusCode, error);
  }
};
