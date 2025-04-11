"server only";

import { getDB } from "@/db";
import { cache } from "react";

async function fetchData() {
  const db = await getDB();

  return await db.query.mice.findFirst({
    with: {
      posts: {
        columns: {
          id: true,
          ENGtitle: true,
          KOtitle: true,
          ENGcontent: true,
          KOcontent: true,
          mainENGContent: true,
          mainKOContent: true,
          imgPath: true,
          imgENGAlt: true,
          imgKOAlt: true,
          createdAt: true,
        },
        with: {
          postImageImages: {
            columns: {
              id: true,
              imgPath: true,
              imgENGAlt: true,
              imgKOAlt: true,
            }
          }
        }
      },
    },
  });
}

export const getMiceData = cache(fetchData);
