// import { drizzle } from "drizzle-orm/d1";
// import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schemas from "./schemas";
import { drizzle } from "drizzle-orm/neon-http";

// export const db: DrizzleD1Database<typeof schemas> | null = null;

export const db = drizzle(process.env.DATABASE_URL as string, {
  schema: schemas,
  logger: true,
});

export const getDB = async () => {
  if (db) {
    return db;
  }

  // This is for D1 DB
  // const { env } = await getCloudflareContext({ async: true });

  // if (!env.NEXT_TAG_CACHE_D1) {
  //   throw new Error("D1 database not found");
  // }

  // db = drizzle(env.NEXT_TAG_CACHE_D1, { schema: schemas, logger: true });

  // return db;

  return drizzle(process.env.DATABASE_URL as string, {
    schema: schemas,
    logger: true,
  });
};
