import "reflect-metadata";
import { seedAdminUser } from "./seeders/admin.user.seeder";
import { seedCompanies } from "./seeders/company.seeder";
import { seedBranches } from "./seeders/branch.seeder";
import { AppDataSource } from "../config/database";

async function runSeeders() {
  try {
    await AppDataSource.initialize();
    console.log("📦 Database connected");

    await seedAdminUser();
    await seedCompanies(4);
    await seedBranches(8);
    console.log("🌱 Seeders executed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeder failed:", error);
    process.exit(1);
  }
}

runSeeders();
