"use server";

import { revalidatePath } from "next/cache";

export default function revalidateLocalePath(path: string) {
  const locales = ["en", "ko"];

  for (const locale of locales) {
    revalidatePath(`/${locale}${path}`);
  }
}
