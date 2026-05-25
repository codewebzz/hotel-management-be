import "reflect-metadata";
import { DataSource } from "typeorm";
import { Brand } from "../entities/Brand";
import { Branch } from "../entities/Branch";
import { Amenity } from "../entities/Amenity";
import { RoomType } from "../entities/RoomType";
import { RoomTypeAmenity } from "../entities/RoomTypeAmenity";
import { Company } from "../entities/Company";
import { User } from "../entities/User";
import { Address } from "../entities/Address";
import { Room } from "../entities/Room";
import { Floor } from "../entities/Floor";
import { Pricing } from "../entities/Pricing";
import { Customer } from "../entities/Customer";
import { Booking } from "../entities/Booking";
import { Invoice } from "../entities/Invoice";
import { Staff } from "../entities/Staff";
import { HousekeepingLog } from "../entities/HousekeepingLog";
import { RoomStatusHistory } from "../entities/RoomStatusHistory";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "hello_db",
  synchronize: false,
  logging: false,
  entities: [
    User,
    Brand,
    Branch,
    Amenity,
    RoomType,
    RoomTypeAmenity,
    Company,
    Address,
    Floor,
    Room,
    Pricing,
    Customer,
    Booking,
    Invoice,
    Staff,
    HousekeepingLog,
    RoomStatusHistory,
  ],
  migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
  subscribers: [],
});
