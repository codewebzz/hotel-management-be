import { AppDataSource } from '../../config/database'
import { Brand } from '../../entities/Brand'
import { Address } from '../../entities/Address'
import { faker } from '@faker-js/faker'

export async function seedBrands(count = 4) {
  const brandRepo = AppDataSource.getRepository(Brand)
  const addressRepo = AppDataSource.getRepository(Address)

  const existingCount = await brandRepo.count()
  if (existingCount >= count) {
    console.log('⚠️ Brands already seeded')
    return
  }

  const brands: Brand[] = []

  for (let i = 0; i < count; i++) {
    const address = addressRepo.create({
      address: faker.location.streetAddress(),
      lat: Number(faker.location.latitude()),
      long: Number(faker.location.longitude()),
    })

    const savedAddress = await addressRepo.save(address)

    const brand = brandRepo.create({
      name: `${faker.company.name()} Brand`,
      email: faker.internet.email(),
      phone: faker.phone.number(),
      addressId: savedAddress.id,
      isActive: true,
    })

    brands.push(brand)
  }

  await brandRepo.save(brands)

  console.log(`✅ ${count} brands seeded successfully`)
}
