import { AppDataSource } from '../../config/database'
import { Branch } from '../../entities/Branch'
import { Address } from '../../entities/Address'
import { faker } from '@faker-js/faker'

export async function seedBranches(count = 8) {
  const branchRepo = AppDataSource.getRepository(Branch)
  const addressRepo = AppDataSource.getRepository(Address)

  const existingCount = await branchRepo.count()
  if (existingCount >= count) {
    console.log('⚠️ Branches already seeded')
    return
  }

  const branches: Branch[] = []

  for (let i = 0; i < count; i++) {
    // Create address first
    const address = addressRepo.create({
      address: faker.location.streetAddress(),
      lat: Number(faker.location.latitude()),
      long: Number(faker.location.longitude()),
    })

    const savedAddress = await addressRepo.save(address)

    // Create branch with address reference
    const branch = branchRepo.create({
      name: `${faker.company.name()} - Branch ${i + 1}`,
      addressId: savedAddress.id,
      isActive: true,
    })

    branches.push(branch)
  }

  await branchRepo.save(branches)

  console.log(`✅ ${count} branches seeded successfully`)
}
