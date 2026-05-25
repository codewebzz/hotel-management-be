import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { SendSuccess, SendError } from '../utils/response';

const bookingService = new BookingService();

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      customerId,
      roomId,
      branchId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalAmount,
      discount,
      tax,
      status,
      specialRequests,
    } = req.body;

    const booking = await bookingService.createBooking({
      customerId,
      roomId,
      branchId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalAmount,
      discount,
      tax,
      status,
      specialRequests,
    });

    return SendSuccess(res, 'Booking created successfully', booking, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('must be before')
        ? 400
        : error.message.includes('not available')
          ? 409
          : 500;
    return SendError(res, 'Error creating booking', statusCode, error);
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const branchId = req.query.branchId as string | undefined;

    const result = await bookingService.getAllBookingsPaginated(
      page,
      limit,
      search,
      branchId
    );

    return SendSuccess(res, 'Bookings retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    return SendError(res, 'Error retrieving bookings', statusCode, error);
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await bookingService.getBookingById(id);

    return SendSuccess(res, 'Booking retrieved successfully', booking);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving booking', statusCode, error);
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      customerId,
      roomId,
      branchId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalAmount,
      discount,
      tax,
      status,
      specialRequests,
    } = req.body;

    const booking = await bookingService.updateBooking(id, {
      customerId,
      roomId,
      branchId,
      checkInDate,
      checkOutDate,
      adults,
      children,
      totalAmount,
      discount,
      tax,
      status,
      specialRequests,
    });

    return SendSuccess(res, 'Booking updated successfully', booking);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('must be before')
        ? 400
        : error.message.includes('not available')
          ? 409
          : 500;
    return SendError(res, 'Error updating booking', statusCode, error);
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await bookingService.deleteBooking(id);

    return SendSuccess(res, 'Booking deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting booking', statusCode, error);
  }
};

export const getConfirmedBooking = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getConfirmedBookings();

    return SendSuccess(res, 'Confirmed bookings retrieved successfully', bookings);
  } catch (error: any) {
    return SendError(res, 'Error retrieving confirmed bookings', 500, error);
  }
};