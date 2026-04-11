import { Request, Response } from 'express';
import { StaffService } from '../services/staffService';

const staffService = new StaffService();

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { userId, branchId, position, salary, joinDate, shiftTiming } = req.body;

    const staff = await staffService.createStaff({
      userId,
      branchId,
      position,
      salary,
      joinDate,
      shiftTiming,
    });

    res.status(201).json({
      success: true,
      message: 'Staff created successfully',
      data: staff,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
      ? 404
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating staff',
      error: error.message,
    });
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await staffService.getAllStaffPaginated(page, limit, search);

    res.status(200).json({
      success: true,
      message: 'Staff retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving staff',
      error: error.message,
    });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const staff = await staffService.getStaffById(id);

    res.status(200).json({
      success: true,
      message: 'Staff retrieved successfully',
      data: staff,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving staff',
      error: error.message,
    });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, branchId, position, salary, joinDate, shiftTiming, isActive } = req.body;

    const staff = await staffService.updateStaff(id, {
      userId,
      branchId,
      position,
      salary,
      joinDate,
      shiftTiming,
      isActive,
    });

    res.status(200).json({
      success: true,
      message: 'Staff updated successfully',
      data: staff,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating staff',
      error: error.message,
    });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await staffService.deleteStaff(id);

    res.status(200).json({
      success: true,
      message: 'Staff deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting staff',
      error: error.message,
    });
  }
};

export const getActiveStaff = async (req: Request, res: Response) => {
  try {
    const list = await staffService.getActiveStaff();
    res.status(200).json({
      success: true,
      message: 'Active staff retrieved successfully',
      data: list,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active staff',
      error: error.message,
    });
  }
};

export const toggleStaffStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await staffService.toggleStaffStatus(id);
    res.status(200).json({
      success: true,
      message: 'Staff status toggled successfully',
      data: staff,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error toggling staff status',
      error: error.message,
    });
  }
};

