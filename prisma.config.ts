import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    // FIX: Add '!' (non-null assertion) or a fallback string
    url: process.env.DATABASE_URL!, 
  },
});