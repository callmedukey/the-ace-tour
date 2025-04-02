"use server";

import { getDB } from "@/db";
import { newsletter } from "@/db/schemas/newsletter";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types/actions";
import { CreateNewsletterSchema } from "@/db/schemas/newsletter";

// Subscribe to newsletter
export async function subscribeToNewsletter(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get("email") as string;
    
    // Validate email
    const validatedFields = CreateNewsletterSchema.safeParse({
      email,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Please enter a valid email address",
      };
    }

    const db = await getDB();
    
    // Check if email already exists
    const existingSubscription = await db.query.newsletter.findFirst({
      where: eq(newsletter.email, email),
    });

    if (existingSubscription) {
      return {
        success: true,
        message: "You're already subscribed to our newsletter!",
      };
    }

    // Add new subscription
    await db.insert(newsletter).values({
      email,
    });

    return {
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Failed to subscribe. Please try again later.",
    };
  }
}

// Define result types
interface NewsletterResult {
  success: boolean;
  error?: string;
}

// Delete a newsletter subscription
export async function deleteNewsletter(id: number): Promise<NewsletterResult> {
  try {
    const db = await getDB();

    await db.delete(newsletter).where(eq(newsletter.id, id));

    // Revalidate the newsletters page to show the updated data
    revalidatePath("/[locale]/admin/newsletters", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting newsletter subscription:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
