import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { AppDataSource } from '../config/database';
import { Address } from '../entities/Address';

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

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customer,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists')
      ? 409
      : error.message.includes('not found')
      ? 404
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating customer',
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving customers',
      error: error.message,
    });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await customerService.getCustomerById(id);

    res.status(200).json({
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving customer',
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : error.message.includes('must be')
      ? 400
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating customer',
      error: error.message,
    });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await customerService.deleteCustomer(id);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting customer',
      error: error.message,
    });
  }
};

export const getActiveCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerService.getActiveCustomers();

    res.status(200).json({
      success: true,
      message: 'Active customers retrieved successfully',
      data: customers,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active customers',
      error: error.message,
    });
  }
};

export const toggleCustomerStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const customer = await customerService.toggleCustomerStatus(id);

    res.status(200).json({
      success: true,
      message: 'Customer status toggled successfully',
      data: customer,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error toggling customer status',
      error: error.message,
    });
  }
};
