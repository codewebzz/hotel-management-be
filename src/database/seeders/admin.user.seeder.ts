import { AppDataSource } from '../../config/database'
import { User, UserRole } from '../../entities/User'
import bcrypt from 'bcrypt'

export async function seedAdminUser() {
  const userRepo = AppDataSource.getRepository(User)

  const existingAdmin = await userRepo.findOne({
    where: { email: 'admin@hotelmanagement.com' },
  })

  if (existingAdmin) {
    console.log('⚠️ Admin user already exists')
    return
  }

  const hashedPassword = await bcrypt.hash('Admin@1234', 10)

  const adminUser = userRepo.create({
    name: 'Admin',
    email: 'admin@hotelmanagement.com',
    password: hashedPassword,
    role: UserRole.ADMIN,
    isActive: true,
  })

  await userRepo.save(adminUser)

  console.log('✅ Admin user created successfully')
}
