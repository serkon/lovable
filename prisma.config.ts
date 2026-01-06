// // prisma.config.ts
// import { defineConfig } from "prisma/config";
//
// export default defineConfig({
//   datasource: {
//     url: "file:./prisma/dev.db",
//   },
// });

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
