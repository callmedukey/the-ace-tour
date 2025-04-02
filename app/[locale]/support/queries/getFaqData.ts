"server only";

import { getDB } from "@/db";
import { cache } from "react";

async function getData() {
  const db = await getDB();

  return await db.query.faqs.findMany({
    columns: {
      id: true,
      KOquestion: true,
      ENGquestion: true,
      KOanswer: true,
      ENGanswer: true,
    },
  });
}

const getFaqData = cache(getData);

export default getFaqData;
