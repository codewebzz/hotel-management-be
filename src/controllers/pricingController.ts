import { Request, Response } from 'express';
import { PricingService } from '../services/pricingService';

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

    res.status(201).json({
      success: true,
      message: 'Pricing created successfully',
      data: pricing,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found') ||
        error.message.includes('before or equal')
      ? 400
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating pricing',
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: 'Pricings retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving pricings',
      error: error.message,
    });
  }
};

export const getPricingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pricing = await pricingService.getPricingById(id);

    res.status(200).json({
      success: true,
      message: 'Pricing retrieved successfully',
      data: pricing,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving pricing',
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: 'Pricing updated successfully',
      data: pricing,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists') ||
        error.message.includes('before or equal')
      ? 400
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating pricing',
      error: error.message,
    });
  }
};

export const deletePricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pricingService.deletePricing(id);

    res.status(200).json({
      success: true,
      message: 'Pricing deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting pricing',
      error: error.message,
    });
  }
};

export const getActivePricings = async (req: Request, res: Response) => {
  try {
    const list = await pricingService.getActivePricings();

    res.status(200).json({
      success: true,
      message: 'Active pricings retrieved successfully',
      data: list,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active pricings',
      error: error.message,
    });
  }
};

export const togglePricingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pricing = await pricingService.togglePricingStatus(id);

    res.status(200).json({
      success: true,
      message: 'Pricing status toggled successfully',
      data: pricing,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error toggling pricing status',
      error: error.message,
    });
  }
};

