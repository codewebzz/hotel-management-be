import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { generateToken } from '../utils/jwt';
import { UserRole } from '../entities/User';

const userService = new UserService();

// Register a new user
export const saveUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role, companyId } = req.body;
    console.log("Akshita",  req.body)
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, name, and password are required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const user = await userService.createUser({
      email,
      name,
      password,
      role: role as UserRole,
      companyId,
    });

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: {
        user,
        token,
      },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('already exists') ? 409 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await userService.authenticateUser(email, password);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token,
      },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('Invalid') || error.message.includes('inactive') ? 401 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await userService.getAllUsersPaginated(page, limit, search);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });

   
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message,
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, companyId, isActive } = req.body;

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
    }

    // Validate password if provided
    if (password && password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const user = await userService.updateUser(id, {
      name,
      email,
      password,
      role: role as UserRole,
      companyId,
      isActive,
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found')
      ? 404
      : error.message.includes('already exists')
      ? 409
      : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: { id },
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

// Get current user profile
export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const user = await userService.getUserById(userId);

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error retrieving user profile',
      error: error.message,
    });
  }
};

// Get users by company ID
export const getUsersByCompanyId = async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    const users = await userService.getUsersByCompanyId(companyId);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      total: users.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.toggleUserStatus(id);
    res.status(200).json({
      success: true,
      message: 'User status toggled successfully',
      data: user,
    });
  } catch (error: any) {
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error toggling staff status',
      error: error.message,
    });
  }
};

export const getActiveUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getActiveUsers();

    res.status(200).json({
      success: true,
      message: 'Active users retrieved successfully',
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving active users',
      error: error.message,
    });
  }
};