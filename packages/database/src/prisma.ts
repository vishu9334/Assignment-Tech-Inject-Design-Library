import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://inject_design_component_user:ZqhrsDDiielQ89YU5iMXUea6kq61AQaw@dpg-dapu8es9v7es739urv1g-a.singapore-postgres.render.com/inject_design_component?sslmode=require";

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

export const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
