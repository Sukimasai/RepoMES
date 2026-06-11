import { defineConfig } from '@prisma/config';

export default defineConfig({
  migrate: {
    // This tells the CLI where to push your migrations
    databaseUrl: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});