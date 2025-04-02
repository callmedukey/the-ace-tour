"use server";

import { getDB } from "@/db";
import { faqs } from "@/db/schemas/faqs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define result types
interface FaqResult {
  success: boolean;
  error?: string;
}

// Create a new FAQ
export async function createFaq(
  faqData: {
    KOquestion: string;
    ENGquestion: string;
    KOanswer: string;
    ENGanswer: string;
  }
): Promise<FaqResult> {
  try {
    const db = await getDB();

    await db.insert(faqs).values({
      ...faqData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Revalidate the FAQ pages to show the updated data
    revalidatePath("/[locale]/admin/faq-setting", "page");
    revalidatePath("/[locale]/support", "page");

    return { success: true };
  } catch (error) {
    console.error("Error creating FAQ:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update an existing FAQ
export async function updateFaq(
  id: number,
  faqData: {
    KOquestion: string;
    ENGquestion: string;
    KOanswer: string;
    ENGanswer: string;
  }
): Promise<FaqResult> {
  try {
    const db = await getDB();

    await db
      .update(faqs)
      .set({
        ...faqData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(faqs.id, id));

    // Revalidate the FAQ pages to show the updated data
    revalidatePath("/[locale]/admin/faq-setting", "page");
    revalidatePath("/[locale]/support", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating FAQ:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete an FAQ
export async function deleteFaq(id: number): Promise<FaqResult> {
  try {
    const db = await getDB();

    await db.delete(faqs).where(eq(faqs.id, id));

    // Revalidate the FAQ pages to show the updated data
    revalidatePath("/[locale]/admin/faq-setting", "page");
    revalidatePath("/[locale]/support", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get all FAQs
export async function getAllFaqs() {
  try {
    const db = await getDB();
    
    const allFaqs = await db.query.faqs.findMany({
      orderBy: (faqs, { asc }) => [asc(faqs.id)],
    });
    
    return { 
      success: true,
      faqs: allFaqs
    };
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      faqs: []
    };
  }
}
