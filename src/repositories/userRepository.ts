import { Not, Repository } from "typeorm";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entities/User";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  /**
   * Create a new user
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    return await this.repository.find({
      where: { role: Not(UserRole.ADMIN), isActive: true },
      relations: ["company"],
      order: { createdAt: "DESC" },
    });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{ data: User[]; total: number; page: number; limit: number }> {
    const offset = (page - 1) * limit;

    let query = this.repository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.company", "company")
      .where("user.role != :role", { role: UserRole.ADMIN }); // ✅ always exclude admin

    if (search && search.trim() !== "") {
      query = query.andWhere("user.name ILIKE :q OR user.email ILIKE :q", {
        q: `%${search}%`,
      });
    }

    const [data, total] = await query
      .orderBy("user.createdAt", "DESC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["company"],
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
      relations: ["company"],
    });
  }

  /**
   * Find users by company ID
   */
  async findByCompanyId(companyId: string): Promise<User[]> {
    return await this.repository.find({
      where: { companyId },
      relations: ["company"],
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Update user
   */
  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, userData);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error("User not found after update");
    }
    return updatedUser;
  }

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await this.repository.remove(user);
  }

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async toggleStatus(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const newStatus = !user.isActive;
    await this.repository.update(id, { isActive: newStatus });

    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error("User not found after status update");
    }
    return updatedUser;
  }

  async findActive(): Promise<Pick<User, "id" | "name">[]> {
    return await this.repository.find({
      where: { isActive: true, role: UserRole.USER },
      order: { createdAt: "DESC" },
      select: ["id", "name"],
      relations: [],
    });
  }
}
