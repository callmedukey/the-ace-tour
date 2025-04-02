"use server";

import { getDB } from "@/db";
import { mice, posts } from "@/db/schemas/mice";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// Define result types
interface MiceResult {
  success: boolean;
  error?: string;
}

interface ImageUploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

// Update MICE details
export async function updateMice(
  id: string,
  miceData: {
    ENGtitle: string;
    KOtitle: string;
    firstValue: number;
    firstValueENGText: string;
    firstValueKOText: string;
    secondValue: number;
    secondValueENGText: string;
    secondValueKOText: string;
    thirdValue: number;
    thirdValueENGText: string;
    thirdValueKOText: string;
  }
): Promise<MiceResult> {
  try {
    const db = await getDB();

    await db
      .update(mice)
      .set({
        ...miceData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(mice.id, id));

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating MICE:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Create a new MICE entry
export async function createMice(miceData: {
  ENGtitle: string;
  KOtitle: string;
  firstValue: number;
  firstValueENGText: string;
  firstValueKOText: string;
  secondValue: number;
  secondValueENGText: string;
  secondValueKOText: string;
  thirdValue: number;
  thirdValueENGText: string;
  thirdValueKOText: string;
}): Promise<MiceResult> {
  try {
    const db = await getDB();

    await db.insert(mice).values({
      ...miceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");

    return { success: true };
  } catch (error) {
    console.error("Error creating MICE:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete a MICE entry
export async function deleteMice(id: string): Promise<MiceResult> {
  try {
    const db = await getDB();

    // First delete all posts associated with this MICE
    await db.delete(posts).where(eq(posts.miceId, id));

    // Then delete the MICE itself
    await db.delete(mice).where(eq(mice.id, id));

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting MICE:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Create a new post
export async function createPost(formData: FormData): Promise<MiceResult> {
  try {
    const miceId = formData.get("miceId") as string;
    const ENGtitle = formData.get("ENGtitle") as string;
    const KOtitle = formData.get("KOtitle") as string;
    const ENGcontent = formData.get("ENGcontent") as string;
    const KOcontent = formData.get("KOcontent") as string;
    const imgENGAlt = formData.get("imgENGAlt") as string;
    const imgKOAlt = formData.get("imgKOAlt") as string;
    const file = formData.get("file") as File;

    if (
      !miceId ||
      !ENGtitle ||
      !KOtitle ||
      !ENGcontent ||
      !KOcontent ||
      !imgENGAlt ||
      !imgKOAlt ||
      !file
    ) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalName = file.name;
    const extension = originalName.split(".").pop();

    // Create a unique filename with the original extension
    const filename = `mice-${uuidv4()}.${extension}`;
    const imagePath = `/mice-solutions/${filename}`;
    const fullPath = join(
      process.cwd(),
      "public",
      "uploads",
      "mice-solutions",
      filename
    );

    // Write the file to the public directory
    await writeFile(fullPath, buffer);

    // Save post in the database
    const db = await getDB();
    await db.insert(posts).values({
      ENGtitle,
      KOtitle,
      ENGcontent,
      KOcontent,
      imgPath: imagePath,
      imgENGAlt,
      imgKOAlt,
      miceId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");

    return { success: true };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update a post
export async function updatePost(
  id: string,
  postData: {
    ENGtitle: string;
    KOtitle: string;
    ENGcontent: string;
    KOcontent: string;
    imgENGAlt: string;
    imgKOAlt: string;
  }
): Promise<MiceResult> {
  try {
    const db = await getDB();

    await db
      .update(posts)
      .set({
        ...postData,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, id));

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete a post
export async function deletePost(id: string): Promise<MiceResult> {
  try {
    const db = await getDB();

    await db.delete(posts).where(eq(posts.id, id));

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Update post image
export async function updatePostImage(
  formData: FormData
): Promise<ImageUploadResult> {
  try {
    const postId = formData.get("postId") as string;
    const imgENGAlt = formData.get("imgENGAlt") as string;
    const imgKOAlt = formData.get("imgKOAlt") as string;
    const file = formData.get("file") as File;

    if (!postId || !imgENGAlt || !imgKOAlt || !file) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    // Create unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalName = file.name;
    const extension = originalName.split(".").pop();

    // Create a unique filename with the original extension
    const filename = `mice-${uuidv4()}.${extension}`;
    const imagePath = `/mice-solutions/${filename}`;
    const fullPath = join(
      process.cwd(),
      "public",
      "uploads",
      "mice-solutions",
      filename
    );

    // Write the file to the public directory
    await writeFile(fullPath, buffer);

    // Update post in the database
    const db = await getDB();
    await db
      .update(posts)
      .set({
        imgPath: imagePath,
        imgENGAlt,
        imgKOAlt,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, postId));

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");

    return {
      success: true,
      path: imagePath,
    };
  } catch (error) {
    console.error("Error updating post image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get all MICE with their posts
export async function getMiceWithPosts() {
  try {
    const db = await getDB();

    const allMice = await db.query.mice.findMany({
      with: {
        posts: true,
      },
    });

    return {
      success: true,
      mice: allMice,
    };
  } catch (error) {
    console.error("Error fetching MICE:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      mice: [],
    };
  }
}
