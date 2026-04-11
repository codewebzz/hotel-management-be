import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoiceService';

const invoiceService = new InvoiceService();

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const {
      bookingId,
      amount,
      tax,
      discount,
      paymentStatus,
      paymentMethod,
      paidAmount,
    } = req.body;

    const invoice = await invoiceService.createInvoice({
      bookingId,
      amount,
      tax,
      discount,
      paymentStatus,
      paymentMethod,
      paidAmount,
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message,
    });
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await invoiceService.getAllInvoicesPaginated(
      page,
      limit,
      search
    );

    res.status(200).json({
      success: true,
      message: 'Invoices retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving invoices',
      error: error.message,
    });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(id);
    res.status(200).json({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving invoice',
      error: error.message,
    });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      bookingId,
      amount,
      tax,
      discount,
      paymentStatus,
      paymentMethod,
      paidAmount,
    } = req.body;

    const invoice = await invoiceService.updateInvoice(id, {
      bookingId,
      amount,
      tax,
      discount,
      paymentStatus,
      paymentMethod,
      paidAmount,
    });

    res.status(200).json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('must be')
      ? 400
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating invoice',
      error: error.message,
    });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await invoiceService.deleteInvoice(id);
    res.status(200).json({
      success: true,
      message: 'Invoice deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting invoice',
      error: error.message,
    });
  }
};

