import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local for Next.js compatibility
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Pooler URL for serverless runtime (Vercel)
    url: process.env["DATABASE_URL"],
    // Direct URL for migrations
    directUrl: process.env["DIRECT_URL"],
  },
});
