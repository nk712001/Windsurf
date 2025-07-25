import { DataSource } from "typeorm";
import { User } from "../models/User";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: false,
  logging: false,
  migrations: [__dirname + "/../migrations/*.{ts,js}"],
});
