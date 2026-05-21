import { Request, Response } from 'express';
import { StaffService } from '../services/staffService';
import { SendSuccess, SendError } from '../utils/response';

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

    return SendSuccess(res, 'Staff created successfully', staff, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
        ? 404
        : 500;
    return SendError(res, 'Error creating staff', statusCode, error);
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await staffService.getAllStaffPaginated(page, limit, search);

    return SendSuccess(res, 'Staff retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving staff', statusCode, error);
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const staff = await staffService.getStaffById(id);

    return SendSuccess(res, 'Staff retrieved successfully', staff);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving staff', statusCode, error);
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

    return SendSuccess(res, 'Staff updated successfully', staff);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : 500;
    return SendError(res, 'Error updating staff', statusCode, error);
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await staffService.deleteStaff(id);

    return SendSuccess(res, 'Staff deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting staff', statusCode, error);
  }
};

export const getActiveStaff = async (req: Request, res: Response) => {
  try {
    const list = await staffService.getActiveStaff();
    return SendSuccess(res, 'Active staff retrieved successfully', list);
  } catch (error: any) {
    return SendError(res, 'Error retrieving active staff', 500, error);
  }
};

export const toggleStaffStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await staffService.toggleStaffStatus(id);
    return SendSuccess(res, 'Staff status toggled successfully', staff);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling staff status', statusCode, error);
  }
};
