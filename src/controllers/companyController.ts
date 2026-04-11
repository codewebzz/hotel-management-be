import { Request, Response } from "express";
import { CompanyService } from "../services/companyService";
import { AppDataSource } from "../config/database";
import { Address } from "../entities/Address";

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

    res.status(201).json({
      success: true,
      message: "Company created successfully",
    });
  } catch (error: any) {
    const statusCode = error.message.includes("already exists") ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error creating company",
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    const statusCode = error.message.includes("must be") ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error retrieving companies",
      error: error.message,
    });
  }
};

// Get company by ID
export const getCompanyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await companyService.getCompanyById(id);

    res.status(200).json({
      success: true,
      message: "Company retrieved successfully",
      data: company,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error retrieving company",
      error: error.message,
    });
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
        return res.status(400).json({ message: "Invalid email format" });
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

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("already exists")
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error updating company",
      error: error.message,
    });
  }
};

// Delete company
export const deleteCompany = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await companyService.deleteCompany(id);

    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error deleting company",
      error: error.message,
    });
  }
};

// Get active companies
export const getActiveCompanies = async (req: Request, res: Response) => {
  try {
    const companies = await companyService.getActiveCompanies();

    res.status(200).json({
      success: true,
      message: "Active companies retrieved successfully",
      data: companies,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving active companies",
      error: error.message,
    });
  }
};

// Toggle company status
export const toggleCompanyStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const company = await companyService.toggleCompanyStatus(id);

    res.status(200).json({
      success: true,
      message: `Company ${company.isActive ? "activated" : "deactivated"} successfully`,
      data: company,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error changing company status",
      error: error.message,
    });
  }
};
