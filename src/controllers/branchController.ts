import { Request, Response } from "express";
import { BranchService } from "../services/branchService";
import { AppDataSource } from "../config/database";
import { Address } from "../entities/Address";

const branchService = new BranchService();

// Create a new branch
export const createBranch = async (req: Request, res: Response) => {
  try {
    const { name, address, lat, long } = req.body;

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
      addressId: finalAddressId,
    });

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: branch,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("already exists") ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error creating branch",
      error: error.message,
    });
  }
};

// Get all branches with pagination
export const getAllBranches = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await branchService.getAllBranchesPaginated(page, limit, search);

    res.status(200).json({
      success: true,
      message: "Branches retrieved successfully",
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
      message: "Error retrieving branches",
      error: error.message,
    });
  }
};

// Get branch by ID
export const getBranchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const branch = await branchService.getBranchById(id);

    res.status(200).json({
      success: true,
      message: "Branch retrieved successfully",
      data: branch,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error retrieving branch",
      error: error.message,
    });
  }
};

// Update branch
export const updateBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, lat, long, isActive } = req.body;

    const branch = await branchService.updateBranch(
      id,
      {
        name,
        address,
        lat,
        long,
        isActive,
      },
      AppDataSource
    );

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: branch,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("already exists")
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error updating branch",
      error: error.message,
    });
  }
};

// Delete branch
export const deleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await branchService.deleteBranch(id);

    res.status(200).json({
      success: true,
      message: "Branch deleted successfully",
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error deleting branch",
      error: error.message,
    });
  }
};

// Get active branches
export const getActiveBranches = async (req: Request, res: Response) => {
  try {
    const branches = await branchService.getActiveBranches();

    res.status(200).json({
      success: true,
      message: "Active branches retrieved successfully",
      data: branches,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error retrieving active branches",
      error: error.message,
    });
  }
};

// Toggle branch status
export const toggleBranchStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const branch = await branchService.toggleBranchStatus(id);

    res.status(200).json({
      success: true,
      message: `Branch ${branch.isActive ? "activated" : "deactivated"} successfully`,
      data: branch,
    });
  } catch (error: any) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: "Error changing branch status",
      error: error.message,
    });
  }
};

// // Create a new branch
// export const createBranch = async (req: Request, res: Response) => {
//   try {
//     const { name, description, address, phone, email, city, state, zipCode, country } = req.body;

//     if (!name) {
//       return res.status(400).json({ message: 'Branch name is required' });
//     }

//     const branch = await branchService.createBranch({
//       name,
//       description,
//       address,
//       phone,
//       email,
//       city,
//       state,
//       zipCode,
//       country,
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Branch created successfully',
//       data: branch,
//     });
//   } catch (error: any) {
//     const statusCode = error.message.includes('already exists') ? 409 : 500;
//     res.status(statusCode).json({
//       success: false,
//       message: 'Error creating branch',
//       error: error.message,
//     });
//   }
// };

// // Get all branches
// export const getAllBranches = async (req: Request, res: Response) => {
//   try {
//     const branches = await branchService.getAllBranches();

//     res.status(200).json({
//       success: true,
//       message: 'Branches retrieved successfully',
//       data: branches,
//       total: branches.length,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving branches',
//       error: error.message,
//     });
//   }
// };

// // Get branch by ID
// export const getBranchById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     const branch = await branchService.getBranchById(id);

//     res.status(200).json({
//       success: true,
//       message: 'Branch retrieved successfully',
//       data: branch,
//     });
//   } catch (error: any) {
//     const statusCode = error.message.includes('not found') ? 404 : 500;
//     res.status(statusCode).json({
//       success: false,
//       message: 'Error retrieving branch',
//       error: error.message,
//     });
//   }
// };

// // Update branch
// export const updateBranch = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, description, address, phone, email, city, state, zipCode, country, isActive } = req.body;

//     const branch = await branchService.updateBranch(id, {
//       name,
//       description,
//       address,
//       phone,
//       email,
//       city,
//       state,
//       zipCode,
//       country,
//       isActive,
//     });

//     res.status(200).json({
//       success: true,
//       message: 'Branch updated successfully',
//       data: branch,
//     });
//   } catch (error: any) {
//     const statusCode = error.message.includes('not found')
//       ? 404
//       : error.message.includes('already exists')
//       ? 409
//       : 500;
//     res.status(statusCode).json({
//       success: false,
//       message: 'Error updating branch',
//       error: error.message,
//     });
//   }
// };

// // Delete branch
// export const deleteBranch = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     await branchService.deleteBranch(id);

//     res.status(200).json({
//       success: true,
//       message: 'Branch deleted successfully',
//       data: { id },
//     });
//   } catch (error: any) {
//     const statusCode = error.message.includes('not found') ? 404 : 500;
//     res.status(statusCode).json({
//       success: false,
//       message: 'Error deleting branch',
//       error: error.message,
//     });
//   }
// };

// // Search branches
// export const searchBranches = async (req: Request, res: Response) => {
//   try {
//     const { query } = req.query;

//     if (!query) {
//       return res.status(400).json({
//         success: false,
//         message: 'Search query is required',
//       });
//     }

//     const branches = await branchService.searchBranches(query as string);

//     res.status(200).json({
//       success: true,
//       message: 'Search completed',
//       data: branches,
//       total: branches.length,
//     });
//   } catch (error: any) {
//     const statusCode = error.message.includes('required') ? 400 : 500;
//     res.status(statusCode).json({
//       success: false,
//       message: 'Error searching branches',
//       error: error.message,
//     });
//   }
// };

// // Get active branches
// export const getActiveBranches = async (req: Request, res: Response) => {
//   try {
//     const branches = await branchService.getActiveBranches();

//     res.status(200).json({
//       success: true,
//       message: 'Active branches retrieved successfully',
//       data: branches,
//       total: branches.length,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving active branches',
//       error: error.message,
//     });
//   }
// };

// // Get branches by city
// export const getBranchesByCity = async (req: Request, res: Response) => {
//   try {
//     const { city } = req.params;

//     const branches = await branchService.getBranchesByCity(city);

//     res.status(200).json({
//       success: true,
//       message: 'Branches retrieved successfully',
//       data: branches,
//       total: branches.length,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving branches by city',
//       error: error.message,
//     });
//   }
// };

// // Get branches by state
// export const getBranchesByState = async (req: Request, res: Response) => {
//   try {
//     const { state } = req.params;

//     const branches = await branchService.getBranchesByState(state);

//     res.status(200).json({
//       success: true,
//       message: 'Branches retrieved successfully',
//       data: branches,
//       total: branches.length,
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: 'Error retrieving branches by state',
//       error: error.message,
//     });
//   }
// };

