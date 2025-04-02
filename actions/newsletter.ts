"use server";
import { getDB } from "@/db";
import { CreateNewsletterSchema, newsletter } from "@/db/schemas/newsletter";
import { ActionResponse } from "@/types/actions";

export const subscribeToNewsletter = async (
  _: ActionResponse,
  formData: FormData
) => {
  const db = await getDB();

  const data = {
    email: formData.get("email"),
  };

  const validatedFields = await CreateNewsletterSchema.safeParseAsync(data);

  if (!validatedFields.success) {
    return {
      message: "Invalid fields",
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  const created = await db.insert(newsletter).values({ email });

  if (!created) {
    return {
      message: "Failed to subscribe",
      success: false,
    };
  }

  return {
    message: "Thank you for subscribing to our newsletter!",
    success: true,
  };
};
