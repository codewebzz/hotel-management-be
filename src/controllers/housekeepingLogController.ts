import { Request, Response } from 'express';
import { HousekeepingLogService } from '../services/housekeepingLogService';

const hkService = new HousekeepingLogService();

export const createHousekeepingLog = async (req: Request, res: Response) => {
  try {
    const {
      roomId,
      staffId,
      branchId,
      shift,
      status,
      assignedAt,
      startTime,
      completedAt,
      notes,
    } = req.body;

    const log = await hkService.createLog({
      roomId,
      staffId,
      branchId,
      shift,
      status,
      assignedAt,
      startTime,
      completedAt,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Housekeeping log created successfully',
      data: log,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating housekeeping log',
      error: error.message,
    });
  }
};

export const getAllHousekeepingLogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await hkService.getAllPaginated(page, limit, search);

    res.status(200).json({
      success: true,
      message: 'Housekeeping logs retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving housekeeping logs',
      error: error.message,
    });
  }
};

export const getHousekeepingLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const log = await hkService.getById(id);
    res.status(200).json({
      success: true,
      message: 'Housekeeping log retrieved successfully',
      data: log,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving housekeeping log',
      error: error.message,
    });
  }
};

export const updateHousekeepingLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      roomId,
      staffId,
      branchId,
      shift,
      status,
      assignedAt,
      startTime,
      completedAt,
      notes,
    } = req.body;

    const log = await hkService.updateLog(id, {
      roomId,
      staffId,
      branchId,
      shift,
      status,
      assignedAt,
      startTime,
      completedAt,
      notes,
    });

    res.status(200).json({
      success: true,
      message: 'Housekeeping log updated successfully',
      data: log,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating housekeeping log',
      error: error.message,
    });
  }
};

export const deleteHousekeepingLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await hkService.deleteLog(id);
    res.status(200).json({
      success: true,
      message: 'Housekeeping log deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting housekeeping log',
      error: error.message,
    });
  }
};
