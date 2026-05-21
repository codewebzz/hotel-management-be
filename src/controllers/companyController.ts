import { Request, Response } from "express";
import { CompanyService } from "../services/companyService";
import { AppDataSource } from "../config/database";
import { Address } from "../entities/Address";
import { SendSuccess, SendError } from "../utils/response";

const companyService = new CompanyService();

// Create a new company
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, lat, long } = req.body;

    // If raw address + lat/long provided, create Address record first
    const addressRepo = AppDataSource.getRepository(Address);
    const addressEntity = addressRepo.create({
      address,
      lat: Number(lat),
      long: Number(long),
    });
    const savedAddress = await addressRepo.save(addressEntity);
    const finalAddressId = savedAddress.id;

    const company = await companyService.createCompany({
      name,
      email,
      phone,
      addressId: finalAddressId,
    });

    return SendSuccess(res, "Company created successfully", undefined, 201);
  } catch (error: any) {
    const statusCode = error.message.includes("already exists") ? 409 : 500;
    return SendError(res, "Error creating company", statusCode, error);
  }
};

// Get all companies
export const getAllCompanies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const result = await companyService.getAllCompaniesPaginated(
      page,
      limit,
      search
    );

    return SendSuccess(res, "Companies retrieved successfully", result.data, 200, {
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    const statusCode = error.message.includes("must be") ? 400 : 500;
    return SendError(res, "Error retrieving companies", statusCode, error);
  }
};

// Get company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await companyService.getCompanyById(id);

    return SendSuccess(res, "Company retrieved successfully", company);
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return SendError(res, "Error retrieving company", statusCode, error);
  }
};

// Update company
export const updateCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, lat, long, isActive } = req.body;

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return SendError(res, "Invalid email format", 400);
      }
    }

    const company = await companyService.updateCompany(
      id,
      {
        name,
        email,
        phone,
        address,
        lat,
        long,
        isActive,
      },
      AppDataSource
    );

    return SendSuccess(res, "Company updated successfully", company);
  } catch (error: any) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("already exists")
        ? 409
        : 500;
    return SendError(res, "Error updating company", statusCode, error);
  }
};

// Delete company
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await companyService.deleteCompany(id);

    return SendSuccess(res, "Company deleted successfully", { id });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return SendError(res, "Error deleting company", statusCode, error);
  }
};

// Get active companies
export const getActiveCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await companyService.getActiveCompanies();

    return SendSuccess(res, "Active companies retrieved successfully", companies);
  } catch (error: any) {
    return SendError(res, "Error retrieving active companies", 500, error);
  }
};

// Toggle company status
export const toggleCompanyStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await companyService.toggleCompanyStatus(id);

    return SendSuccess(res, `Company ${company.isActive ? "activated" : "deactivated"} successfully`, company);
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    return SendError(res, "Error changing company status", statusCode, error);
  }
};
