"use server";

import { getDB } from "@/db";
import { faqs, faqsInsertSchema } from "@/db/schemas/faqs";
import revalidateLocalePath from "@/lib/utils/revalidateLocalePath";
import { ActionResponse } from "@/types/actions";
import { eq } from "drizzle-orm";

export async function createFaq(_: ActionResponse, formData: FormData) {
  const db = await getDB();

  const result = await faqsInsertSchema.safeParseAsync({
    KOquestion: formData.get("KOquestion"),
    ENGquestion: formData.get("ENGquestion"),
    KOanswer: formData.get("KOanswer"),
    ENGanswer: formData.get("ENGanswer"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "Please enter valid data",
    };
  }

  const { KOquestion, ENGquestion, KOanswer, ENGanswer } = result.data;

  const inserted = await db
    .insert(faqs)
    .values({ KOquestion, ENGquestion, KOanswer, ENGanswer })
    .returning();

  if (!inserted) {
    return {
      success: false,
      message: "Failed to create FAQ",
    };
  }

  revalidateLocalePath("/support");

  return {
    success: true,
    message: "FAQ created successfully",
  };
}

export async function deleteFaq(_: ActionResponse, formData: FormData) {
  const db = await getDB();

  const id = formData.get("id");

  if (!id || typeof id !== "string" || !parseInt(id)) {
    return {
      success: false,
      message: "No ID provided",
    };
  }

  const deleted = await db.delete(faqs).where(eq(faqs.id, parseInt(id)));

  if (!deleted) {
    return {
      success: false,
      message: "Failed to delete FAQ",
    };
  }

  revalidateLocalePath("/support");

  return {
    success: true,
    message: "FAQ deleted successfully",
  };
}

export async function updateFaq(_: ActionResponse, formData: FormData) {
  const db = await getDB();

  const id = formData.get("id");

  if (!id || typeof id !== "string" || !parseInt(id)) {
    return {
      success: false,
      message: "No ID provided",
    };
  }

  const result = await faqsInsertSchema.safeParseAsync({
    KOquestion: formData.get("KOquestion"),
    ENGquestion: formData.get("ENGquestion"),
    KOanswer: formData.get("KOanswer"),
    ENGanswer: formData.get("ENGanswer"),
  });

  if (!result.success) {
    return {
      success: false,
      message: "Please enter valid data",
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { KOquestion, ENGquestion, KOanswer, ENGanswer } = result.data;

  const updated = await db
    .update(faqs)
    .set({ KOquestion, ENGquestion, KOanswer, ENGanswer })
    .where(eq(faqs.id, parseInt(id)));

  if (!updated) {
    return {
      success: false,
      message: "Failed to update FAQ",
    };
  }

  revalidateLocalePath("/support");

  return {
    success: true,
    message: "FAQ updated successfully",
  };
}
