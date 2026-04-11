import { AppDataSource } from '../../config/database'
import { Company } from '../../entities/Company'
import { Address } from '../../entities/Address'
import { faker } from '@faker-js/faker'

export async function seedCompanies(count = 4) {
  const companyRepo = AppDataSource.getRepository(Company)
  const addressRepo = AppDataSource.getRepository(Address)

  const existingCount = await companyRepo.count()
  if (existingCount >= count) {
    console.log('⚠️ Companies already seeded')
    return
  }

  const companies: Company[] = []

  for (let i = 0; i < count; i++) {
    // Create address first
    const address = addressRepo.create({
      address: faker.location.streetAddress(),
      lat: Number(faker.location.latitude()),
      long: Number(faker.location.longitude()),
    })

    const savedAddress = await addressRepo.save(address)

    // Create company with address reference
    const company = companyRepo.create({
      name: faker.company.name(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      addressId: savedAddress.id,
      isActive: true,
    })

    companies.push(company)
  }

  await companyRepo.save(companies)

  console.log(`✅ ${count} companies seeded successfully`)
}
