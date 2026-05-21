import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { AppDataSource } from '../config/database';
import { Address } from '../entities/Address';
import { SendSuccess, SendError } from '../utils/response';

const customerService = new CustomerService();

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      lat,
      long,
      idType,
      idNumber,
      companyId,
    } = req.body;

    const addressRepo = AppDataSource.getRepository(Address);
    const addressEntity = addressRepo.create({
      address,
      lat: Number(lat),
      long: Number(long),
    });
    const savedAddress = await addressRepo.save(addressEntity);
    const finalAddressId = savedAddress.id;

    const customer = await customerService.createCustomer({
      name,
      email,
      phone,
      addressId: finalAddressId,
      idType,
      idNumber,
      companyId,
    });

    return SendSuccess(res, 'Customer created successfully', customer, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
        ? 404
        : 500;
    return SendError(res, 'Error creating customer', statusCode, error);
  }
};

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await customerService.getAllCustomersPaginated(
      page,
      limit,
      search
    );

    return SendSuccess(res, 'Customers retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving customers', statusCode, error);
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await customerService.getCustomerById(id);

    return SendSuccess(res, 'Customer retrieved successfully', customer);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving customer', statusCode, error);
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      lat,
      long,
      idType,
      idNumber,
      companyId,
      isActive,
    } = req.body;

    const customer = await customerService.updateCustomer(
      id,
      {
        name,
        email,
        phone,
        address,
        lat,
        long,
        idType,
        idNumber,
        companyId,
        isActive,
      },
      AppDataSource
    );

    return SendSuccess(res, 'Customer updated successfully', customer);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : error.message.includes('must be')
          ? 400
          : 500;
    return SendError(res, 'Error updating customer', statusCode, error);
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await customerService.deleteCustomer(id);

    return SendSuccess(res, 'Customer deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting customer', statusCode, error);
  }
};

export const getActiveCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerService.getActiveCustomers();

    return SendSuccess(res, 'Active customers retrieved successfully', customers);
  } catch (error: any) {
    return SendError(res, 'Error retrieving active customers', 500, error);
  }
};

export const toggleCustomerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await customerService.toggleCustomerStatus(id);

    return SendSuccess(res, 'Customer status toggled successfully', customer);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling customer status', statusCode, error);
  }
};
