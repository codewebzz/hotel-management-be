import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import { User, UserRole } from "../entities/User";
import { Customer } from "../entities/Customer";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Create a new user
   */
  async createUser(userData: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
    companyId?: string;
  }): Promise<User> {
    // Check if user email already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    console.log({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.USER,
    });
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.USER,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.findAll();
    // Remove passwords from response
    return users.map(({ password, ...user }) => user as User);
  }

  async getAllUsersPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }
    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    const result = await this.userRepository.findAllPaginated(
      page,
      limit,
      search,
    );
    return { ...result, totalPages: Math.ceil(result.total / limit) };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Update user
   */
  async updateUser(
    id: string,
    updateData: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      companyId?: string;
      isActive?: boolean;
    },
  ): Promise<User> {
    // Check if user exists
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    // If email is being updated, check if new email already exists
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await this.userRepository.existsByEmail(
        updateData.email,
      );
      if (emailExists) {
        throw new Error("User with this email already exists");
      }
    }

    // Hash password if being updated
    if (updateData.password) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await this.userRepository.delete(id);
  }

  /**
   * Authenticate user (login)
   */
  async authenticateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  /**
   * Get users by company ID
   */
  async getUsersByCompanyId(companyId: string): Promise<User[]> {
    const users = await this.userRepository.findByCompanyId(companyId);
    return users.map(({ password, ...user }) => user as User);
  }

  async toggleUserStatus(id: string): Promise<User> {
    return await this.userRepository.toggleStatus(id);
  }

  async getActiveUsers(): Promise<Pick<User, "id" | "name">[]> {
    return await this.userRepository.findActive();
  }
}
