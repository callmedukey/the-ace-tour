import { defineConfig } from "drizzle-kit";
// import fs from "node:fs";
// import path from "node:path";

// function getLocalD1DB() {
//   try {
//     const basePath = path.resolve(".wrangler/state/v3/d1");
//     const dbFile = fs
//       .readdirSync(basePath, { encoding: "utf-8", recursive: true })
//       .find((f) => f.endsWith(".sqlite"));

//     if (!dbFile) {
//       throw new Error(`.sqlite file not found in ${basePath}`);
//     }

//     const url = path.resolve(basePath, dbFile);
//     return url;
//   } catch (err) {
//     console.error(err);

//     return null;
//   }
// }

export default defineConfig({
  out: "./db/migrations",
  schema: "./db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
