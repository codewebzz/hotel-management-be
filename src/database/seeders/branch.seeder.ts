import { AppDataSource } from '../../config/database'
import { Branch } from '../../entities/Branch'
import { Brand } from '../../entities/Brand'
import { Address } from '../../entities/Address'
import { faker } from '@faker-js/faker'

export async function seedBranches(count = 8) {
  const branchRepo = AppDataSource.getRepository(Branch)
  const brandRepo = AppDataSource.getRepository(Brand)
  const addressRepo = AppDataSource.getRepository(Address)

  const existingCount = await branchRepo.count()
  if (existingCount >= count) {
    console.log('⚠️ Branches already seeded')
    return
  }

  const brands = await brandRepo.find({ take: 1, order: { createdAt: 'ASC' } })
  if (brands.length === 0) {
    throw new Error('Seed brands before branches (brandId is required)')
  }

  const defaultBrandId = brands[0].id
  const branches: Branch[] = []

  for (let i = 0; i < count; i++) {
    const address = addressRepo.create({
      address: faker.location.streetAddress(),
      lat: Number(faker.location.latitude()),
      long: Number(faker.location.longitude()),
    })

    const savedAddress = await addressRepo.save(address)

    const branch = branchRepo.create({
      name: `${faker.company.name()} - Branch ${i + 1}`,
      addressId: savedAddress.id,
      brandId: defaultBrandId,
      isActive: true,
    })

    branches.push(branch)
  }

  await branchRepo.save(branches)

  console.log(`✅ ${count} branches seeded successfully`)
}
