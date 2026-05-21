import { Request, Response } from 'express';
import { InvoiceService } from '../services/invoiceService';
import { SendSuccess, SendError } from '../utils/response';

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

    return SendSuccess(res, 'Invoice created successfully', invoice, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : 500;
    return SendError(res, 'Error creating invoice', statusCode, error);
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

    return SendSuccess(res, 'Invoices retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving invoices', statusCode, error);
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(id);
    return SendSuccess(res, 'Invoice retrieved successfully', invoice);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving invoice', statusCode, error);
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

    return SendSuccess(res, 'Invoice updated successfully', invoice);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('must be')
        ? 400
        : 500;
    return SendError(res, 'Error updating invoice', statusCode, error);
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await invoiceService.deleteInvoice(id);
    return SendSuccess(res, 'Invoice deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting invoice', statusCode, error);
  }
};
