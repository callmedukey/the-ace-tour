"use server";

import { getDB } from "@/db";
import { reviews } from "@/db/schemas/reviews";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Define result types
interface ReviewResult {
  success: boolean;
  error?: string;
}

// Create a new review
export async function createReview(
  reviewData: {
    initial: string;
    name: string;
    content: string;
  }
): Promise<ReviewResult> {
  try {
    const db = await getDB();

    await db.insert(reviews).values({
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Revalidate the review pages to show the updated data
    revalidatePath("/[locale]/admin/reviews-setting", "page");
    revalidatePath("/[locale]", "page"); // Assuming reviews are shown on the homepage

    return { success: true };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update an existing review
export async function updateReview(
  id: number,
  reviewData: {
    initial: string;
    name: string;
    content: string;
  }
): Promise<ReviewResult> {
  try {
    const db = await getDB();

    await db
      .update(reviews)
      .set({
        ...reviewData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(reviews.id, id));

    // Revalidate the review pages to show the updated data
    revalidatePath("/[locale]/admin/reviews-setting", "page");
    revalidatePath("/[locale]", "page"); // Assuming reviews are shown on the homepage

    return { success: true };
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete a review
export async function deleteReview(id: number): Promise<ReviewResult> {
  try {
    const db = await getDB();

    await db.delete(reviews).where(eq(reviews.id, id));

    // Revalidate the review pages to show the updated data
    revalidatePath("/[locale]/admin/reviews-setting", "page");
    revalidatePath("/[locale]", "page"); // Assuming reviews are shown on the homepage

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get all reviews
export async function getAllReviews() {
  try {
    const db = await getDB();
    
    const allReviews = await db.query.reviews.findMany({
      orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
    });
    
    return { 
      success: true,
      reviews: allReviews
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      reviews: []
    };
  }
}