import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';

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

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('must be before')
      ? 400
      : error.message.includes('not available')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await bookingService.getAllBookingsPaginated(
      page,
      limit,
      search
    );

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('must be') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving bookings',
      error: error.message,
    });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await bookingService.getBookingById(id);

    res.status(200).json({
      success: true,
      message: 'Booking retrieved successfully',
      data: booking,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving booking',
      error: error.message,
    });
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

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('must be before')
      ? 400
      : error.message.includes('not available')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating booking',
      error: error.message,
    });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await bookingService.deleteBooking(id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting booking',
      error: error.message,
    });
  }
};

export const getConfirmedBooking = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getConfirmedBookings();

    res.status(200).json({
      success: true,
      message: 'Confirmed bookings retrieved successfully',
      data: bookings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving confirmed bookings',
      error: error.message,
    });
  }
};