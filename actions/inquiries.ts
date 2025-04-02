"use server";

import { getDB } from "@/db";
import {
  CreateInquirySchema,
  CreateInquiryType,
  inquiries,
} from "@/db/schemas";
import { ActionResponse } from "@/types/actions";

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
