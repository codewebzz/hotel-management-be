import { Request, Response } from 'express';
import { HousekeepingLogService } from '../services/housekeepingLogService';
import { SendSuccess, SendError } from '../utils/response';

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

    return SendSuccess(res, 'Housekeeping log created successfully', log, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error creating housekeeping log', statusCode, error);
  }
};

export const getAllHousekeepingLogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await hkService.getAllPaginated(page, limit, search);

    return SendSuccess(res, 'Housekeeping logs retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving housekeeping logs', statusCode, error);
  }
};

export const getHousekeepingLogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const log = await hkService.getById(id);
    return SendSuccess(res, 'Housekeeping log retrieved successfully', log);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving housekeeping log', statusCode, error);
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

    return SendSuccess(res, 'Housekeeping log updated successfully', log);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error updating housekeeping log', statusCode, error);
  }
};

export const deleteHousekeepingLog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await hkService.deleteLog(id);
    return SendSuccess(res, 'Housekeeping log deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting housekeeping log', statusCode, error);
  }
};
