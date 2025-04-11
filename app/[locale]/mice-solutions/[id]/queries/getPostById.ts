"server only";

import { getDB } from "@/db";
import { eq } from "drizzle-orm";
import { posts } from "@/db/schemas/mice";
import { cache } from "react";

async function fetchPostById(id: string) {
  const db = await getDB();

  return await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: {
      postImageImages: {
        columns: {
          id: true,
          imgPath: true,
          imgENGAlt: true,
          imgKOAlt: true,
        }
      }
    },
  });
}

export const getPostById = cache(fetchPostById);