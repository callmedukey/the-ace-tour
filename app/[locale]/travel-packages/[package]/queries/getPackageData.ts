"server only";

import { getDB } from "@/db";
import { packages } from "@/db/schemas/packages";
import { eq } from "drizzle-orm";
import { cache } from "react";

async function getData(
  packageType: "la-departure" | "las-vegas-departure" | "semi-package"
) {
  const db = await getDB();

  const packageData = await db.query.packages.findFirst({
    where: eq(packages.id, packageType),
    with: {
      images: true,
    },
  });

  return packageData;
}

const getPackageData = cache(getData);

export default getPackageData;
