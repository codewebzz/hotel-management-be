import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { generateToken } from '../utils/jwt';
import { UserRole } from '../entities/User';
import { SendSuccess, SendError } from '../utils/response';

const userService = new UserService();

// Register a new user
export const saveUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role, companyId, branchId } = req.body;
    console.log("Akshita", req.body)
    if (!email || !name || !password) {
      return SendError(res, 'Email, name, and password are required', 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return SendError(res, 'Invalid email format', 400);
    }

    // Password validation
    if (password.length < 6) {
      return SendError(res, 'Password must be at least 6 characters long', 400);
    }

    const user = await userService.createUser({
      email,
      name,
      password,
      role: role as UserRole,
      companyId,
      branchId,
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId,
    });

    return SendSuccess(res, 'User added successfully', {
      user,
      token,
    }, 201);
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : 500;
    return SendError(res, 'Error registering user', statusCode, error);
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return SendError(res, 'Email and password are required', 400);
    }

    const user = await userService.authenticateUser(email, password);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      branchId: user.branchId,
    });

    return SendSuccess(res, 'Login successful', {
      user,
      token,
    });
  } catch (error: any) {
    // Keep 200 status code as per original implementation
    return SendError(res, 'Error logging in', 200, error);
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await userService.getAllUsersPaginated(page, limit, search);

    return SendSuccess(res, 'Users retrieved successfully', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  } catch (error: any) {
    return SendError(res, 'Error retrieving users', 500, error);
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    return SendSuccess(res, 'User retrieved successfully', user);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving user', statusCode, error);
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, companyId, branchId, isActive } = req.body;

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return SendError(res, 'Invalid email format', 400);
      }
    }

    // Validate password if provided
    if (password && password.length < 6) {
      return SendError(res, 'Password must be at least 6 characters long', 400);
    }

    const user = await userService.updateUser(id, {
      name,
      email,
      password,
      role: role as UserRole,
      companyId,
      branchId,
      isActive,
    });

    return SendSuccess(res, 'User updated successfully', user);
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
        ? 409
        : 500;
    return SendError(res, 'Error updating user', statusCode, error);
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await userService.deleteUser(id);

    return SendSuccess(res, 'User deleted successfully', { id });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error deleting user', statusCode, error);
  }
};

// Get current user profile
export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return SendError(res, 'User not authenticated', 401);
    }

    const user = await userService.getUserById(userId);

    return SendSuccess(res, 'User profile retrieved successfully', user);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error retrieving user profile', statusCode, error);
  }
};

// Get users by company ID
export const getUsersByCompanyId = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    const users = await userService.getUsersByCompanyId(companyId);

    return SendSuccess(res, 'Users retrieved successfully', users, 200, {
      total: users.length,
    });
  } catch (error: any) {
    return SendError(res, 'Error retrieving users', 500, error);
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.toggleUserStatus(id);
    return SendSuccess(res, 'User status toggled successfully', user);
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    return SendError(res, 'Error toggling user status', statusCode, error);
  }
};

export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getActiveUsers();

    return SendSuccess(res, 'Active users retrieved successfully', users);
  } catch (error: any) {
    return SendError(res, 'Error retrieving active users', 500, error);
  }
};