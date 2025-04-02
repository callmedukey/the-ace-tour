"use server";

import { getDB } from "@/db";
import { CreateMiceSchema, mice } from "@/db/schemas/mice";
import revalidateLocalePath from "@/lib/utils/revalidateLocalePath";
import { ActionResponse } from "@/types/actions";

export const createMicePageData = async (
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> => {
  const db = await getDB();

  const result = await CreateMiceSchema.safeParseAsync({
    ENGtitle: formData.get("ENGtitle"),
    KOtitle: formData.get("KOtitle"),
    firstValue: formData.get("firstValue"),
    secondValue: formData.get("secondValue"),
    thirdValue: formData.get("thirdValue"),
    firstValueENGText: formData.get("firstValueENGText"),
    firstValueKOText: formData.get("firstValueKOText"),
    secondValueENGText: formData.get("secondValueENGText"),
    secondValueKOText: formData.get("secondValueKOText"),
    thirdValueENGText: formData.get("thirdValueENGText"),
    thirdValueKOText: formData.get("thirdValueKOText"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
      message: "Please enter valid data",
    };
  }

  const {
    ENGtitle,
    KOtitle,
    firstValue,
    firstValueENGText,
    firstValueKOText,
    secondValue,
    secondValueENGText,
    secondValueKOText,
    thirdValue,
    thirdValueENGText,
    thirdValueKOText,
  } = result.data;

  const isExistingMice = await db.query.mice.findFirst();

  if (isExistingMice) {
    const updated = await db
      .update(mice)
      .set({
        ENGtitle,
        KOtitle,
        firstValue,
        firstValueENGText,
        firstValueKOText,
        secondValue,
        secondValueENGText,
        secondValueKOText,
        thirdValue,
        thirdValueENGText,
        thirdValueKOText,
      })
      .returning();

    if (!updated) {
      return {
        success: false,
        message: "Failed to update mice in DB.",
      };
    }

    revalidateLocalePath("/mice-solutions");
    revalidateLocalePath("/admin/mice-solutions");
    return {
      success: true,
      message: "Mice updated successfully.",
    };
  }

  const created = await db.insert(mice).values({
    ENGtitle,
    KOtitle,
    firstValue,
    firstValueENGText,
    firstValueKOText,
    secondValue,
    secondValueENGText,
    secondValueKOText,
    thirdValue,
    thirdValueENGText,
    thirdValueKOText,
  });

  if (!created) {
    return {
      success: false,
      message: "Failed to create mice in DB.",
    };
  }
  revalidateLocalePath("/mice-solutions");
  revalidateLocalePath("/admin/mice-solutions");

  return {
    success: true,
    message: "Mice created successfully.",
  };
};
