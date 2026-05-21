import { Request, Response } from 'express';
import { PricingService } from '../services/pricingService';
import { SendSuccess, SendError } from '../utils/response';

const pricingService = new PricingService();

export const createPricing = async (req: Request, res: Response) => {
  try {
    const { roomTypeId, basePrice, seasonName, startDate, endDate } = req.body;

    const pricing = await pricingService.createPricing({
      roomTypeId,
      basePrice,
      seasonName,
      startDate,
      endDate,
    });

    return SendSuccess(res, 'Pricing created successfully', pricing, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found') ||
        error.message.includes('before or equal')
        ? 400
        : 500;
    return SendError(res, 'Error creating pricing', statusCode, error);
  }
};

export const getAllPricings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await pricingService.getAllPricingsPaginated(
      page,
      limit,
      search
    );

    return SendSuccess(res, 'Pricings retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving pricings', statusCode, error);
  }
};

export const getPricingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pricing = await pricingService.getPricingById(id);

    return SendSuccess(res, 'Pricing retrieved successfully', pricing);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving pricing', statusCode, error);
  }
};

export const updatePricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roomTypeId, basePrice, seasonName, startDate, endDate, isActive } =
      req.body;

    const pricing = await pricingService.updatePricing(id, {
      roomTypeId,
      basePrice,
      seasonName,
      startDate,
      endDate,
      isActive,
    });

    return SendSuccess(res, 'Pricing updated successfully', pricing);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists') ||
        error.message.includes('before or equal')
        ? 400
        : 500;
    return SendError(res, 'Error updating pricing', statusCode, error);
  }
};

export const deletePricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pricingService.deletePricing(id);

    return SendSuccess(res, 'Pricing deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting pricing', statusCode, error);
  }
};

export const getActivePricings = async (req: Request, res: Response) => {
  try {
    const list = await pricingService.getActivePricings();

    return SendSuccess(res, 'Active pricings retrieved successfully', list);
  } catch (error: any) {
    return SendError(res, 'Error retrieving active pricings', 500, error);
  }
};

export const togglePricingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pricing = await pricingService.togglePricingStatus(id);

    return SendSuccess(res, 'Pricing status toggled successfully', pricing);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling pricing status', statusCode, error);
  }
};
