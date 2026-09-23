import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"] || "postgresql://inject_design_component_user:ZqhrsDDiielQ89YU5iMXUea6kq61AQaw@dpg-dapu8es9v7es739urv1g-a.singapore-postgres.render.com/inject_design_component?sslmode=require",
  },
});
