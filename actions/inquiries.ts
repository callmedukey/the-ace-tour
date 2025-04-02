"use server";

import { getDB } from "@/db";
import {
  CreateInquirySchema,
  CreateInquiryType,
  inquiries,
} from "@/db/schemas/inquiries";
import { ActionResponse } from "@/types/actions";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define result types
interface InquiryResult {
  success: boolean;
  error?: string;
}

// Update inquiry status
export async function updateInquiryStatus(
  id: number,
  status: "Pending" | "Resolved" | "Closed"
): Promise<InquiryResult> {
  try {
    const db = await getDB();

    await db
      .update(inquiries)
      .set({
        status,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(inquiries.id, id));

    // Revalidate the inquiries pages to show the updated data
    revalidatePath("/[locale]/admin/inquiries", "page");
    revalidatePath(`/[locale]/admin/inquiries/${id}`, "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete an inquiry
export async function deleteInquiry(id: number): Promise<InquiryResult> {
  try {
    const db = await getDB();

    await db.delete(inquiries).where(eq(inquiries.id, id));

    // Revalidate the inquiries page to show the updated data
    revalidatePath("/[locale]/admin/inquiries", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const createInquiry = async (
  _: ActionResponse<CreateInquiryType & { locale: string }> | null,
  formData: FormData
): Promise<ActionResponse<CreateInquiryType & { locale: string }>> => {
  const db = await getDB();

  const locale = formData.get("locale") as string;

  const inputs = {
    email: formData.get("email"),
    name: formData.get("name"),
    message: formData.get("message"),
    type: formData.get("type"),
    locale,
  } as CreateInquiryType & { locale: string };

  const result = await CreateInquirySchema.safeParseAsync(inputs);

  if (!result.success) {
    return {
      success: false,
      message:
        locale === "ko"
          ? "입력 값을 확인해주세요."
          : "Please double check your input",
      errors: result.error.flatten().fieldErrors,
      inputs,
    };
  }

  const { email, name, message, type } = result.data;

  const inquiry = await db
    .insert(inquiries)
    .values({ email, name, message, type })
    .returning();

  if (!inquiry) {
    return {
      success: false,
      message:
        locale === "ko"
          ? "문의 등록에 실패했습니다."
          : "Failed to create inquiry",
      inputs,
    };
  }

  return {
    success: true,
    message:
      locale === "ko"
        ? "문의 등록에 성공했습니다."
        : "Inquiry submitted successfully",
  };
};
