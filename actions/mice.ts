"use server";

import { getDB } from "@/db";
import { mice, posts, postImageImages } from "@/db/schemas/mice";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { existsSync } from "fs";

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
    ENGaccentText: string;
    KOaccentText: string;

    KOSuccessfulProjectsTitle: string;
    KOSuccessfulProjectsNumber: string;
    KOSuccessfulProjectsSuffix: string;

    ENGsuccessfulProjectsTitle: string;
    ENGsuccessfulProjectsNumber: string;
    ENGsuccessfulProjectsSuffix: string;

    KOTotalProjectsValueTitle: string;
    KOTotalProjectsValueNumber: string;
    KOTotalProjectsValueSuffix: string;

    ENGtotalProjectsValueTitle: string;
    ENGtotalProjectsValueNumber: string;
    ENGtotalProjectsValueSuffix: string;

    KOTotalParticipantsTitle: string;
    KOTotalParticipantsNumber: string;
    KOTotalParticipantsSuffix: string;

    ENGtotalParticipantsTitle: string;
    ENGtotalParticipantsNumber: string;
    ENGtotalParticipantsSuffix: string;
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
  ENGaccentText: string;
  KOaccentText: string;

  KOSuccessfulProjectsTitle: string;
  KOSuccessfulProjectsNumber: string;
  KOSuccessfulProjectsSuffix: string;

  ENGsuccessfulProjectsTitle: string;
  ENGsuccessfulProjectsNumber: string;
  ENGsuccessfulProjectsSuffix: string;

  KOTotalProjectsValueTitle: string;
  KOTotalProjectsValueNumber: string;
  KOTotalProjectsValueSuffix: string;

  ENGtotalProjectsValueTitle: string;
  ENGtotalProjectsValueNumber: string;
  ENGtotalProjectsValueSuffix: string;

  KOTotalParticipantsTitle: string;
  KOTotalParticipantsNumber: string;
  KOTotalParticipantsSuffix: string;

  ENGtotalParticipantsTitle: string;
  ENGtotalParticipantsNumber: string;
  ENGtotalParticipantsSuffix: string;
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

    // Get all posts associated with this MICE with their images
    const postsToDelete = await db.query.posts.findMany({
      where: eq(posts.miceId, id),
      with: {
        postImageImages: true,
      },
    });

    // Delete all files and database records for each post
    for (const post of postsToDelete) {
      // Delete the main post image from filesystem
      if (post.imgPath) {
        try {
          const imagePath = post.imgPath.startsWith("/")
            ? post.imgPath.substring(1)
            : post.imgPath;
          const fullPath = join(process.cwd(), "public", imagePath);

          if (existsSync(fullPath)) {
            await unlink(fullPath);
          }
        } catch (err) {
          console.error("Error deleting post main image file:", err);
          // Continue with deletion even if file removal fails
        }
      }

      // Delete all postImageImages files from filesystem
      if (post.postImageImages && post.postImageImages.length > 0) {
        for (const image of post.postImageImages) {
          try {
            const imagePath = image.imgPath.startsWith("/")
              ? image.imgPath.substring(1)
              : image.imgPath;
            const fullPath = join(process.cwd(), "public", imagePath);

            if (existsSync(fullPath)) {
              await unlink(fullPath);
            }
          } catch (err) {
            console.error("Error deleting post image file:", err);
            // Continue with deletion even if file removal fails
          }
        }
      }

      // Delete all postImageImages from database
      await db
        .delete(postImageImages)
        .where(eq(postImageImages.postId, post.id));
    }

    // Then delete all posts associated with this MICE
    await db.delete(posts).where(eq(posts.miceId, id));

    // Finally delete the MICE itself
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
    const mainENGContent = formData.get("mainENGContent") as string;
    const mainKOContent = formData.get("mainKOContent") as string;
    const ENGaccentContent = formData.get("ENGaccentContent") as string;
    const KOaccentContent = formData.get("KOaccentContent") as string;
    const imgENGAlt = formData.get("imgENGAlt") as string;
    const imgKOAlt = formData.get("imgKOAlt") as string;
    const file = formData.get("file") as File;

    // Get postImageImages files
    const postImageFiles = formData.getAll("postImageFiles") as File[];
    const postImageENGAlts = formData.getAll("postImageENGAlts") as string[];
    const postImageKOAlts = formData.getAll("postImageKOAlts") as string[];

    if (
      !miceId ||
      !ENGtitle ||
      !KOtitle ||
      !ENGcontent ||
      !KOcontent ||
      !mainENGContent ||
      !mainKOContent ||
      !ENGaccentContent ||
      !KOaccentContent ||
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
    const imagePath = `/uploads/mice-solutions/${filename}`;
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
    const [newPost] = await db
      .insert(posts)
      .values({
        ENGtitle,
        KOtitle,
        ENGcontent,
        KOcontent,
        ENGaccentContent,
        KOaccentContent,
        mainENGContent,
        mainKOContent,
        imgPath: imagePath,
        imgENGAlt,
        imgKOAlt,
        miceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning({ id: posts.id });

    // Process and save postImageImages if any
    if (postImageFiles.length > 0 && newPost) {
      for (let i = 0; i < postImageFiles.length; i++) {
        const imageFile = postImageFiles[i];
        const imgENGAlt = postImageENGAlts[i] || "";
        const imgKOAlt = postImageKOAlts[i] || "";

        if (imageFile) {
          // Create unique filename for each image
          const imageBytes = await imageFile.arrayBuffer();
          const imageBuffer = Buffer.from(imageBytes);

          // Get file extension
          const imageOriginalName = imageFile.name;
          const imageExtension = imageOriginalName.split(".").pop();

          // Create a unique filename with the original extension
          const imageFilename = `mice-post-image-${uuidv4()}.${imageExtension}`;
          const imageImagePath = `/uploads/mice-solutions/${imageFilename}`;
          const imageFullPath = join(
            process.cwd(),
            "public",
            "uploads",
            "mice-solutions",
            imageFilename
          );

          // Write the file to the public directory
          await writeFile(imageFullPath, imageBuffer);

          // Save postImageImage in the database
          await db.insert(postImageImages).values({
            imgPath: imageImagePath,
            imgENGAlt,
            imgKOAlt,
            postId: newPost.id,
          });
        }
      }
    }

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
    mainENGContent: string;
    mainKOContent: string;
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
    revalidatePath("/[locale]/mice-solutions/[id]", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Add images to an existing post
export async function addPostImages(
  formData: FormData
): Promise<ImageUploadResult> {
  try {
    const postId = formData.get("postId") as string;
    const files = formData.getAll("files") as File[];
    const imgENGAlts = formData.getAll("imgENGAlts") as string[];
    const imgKOAlts = formData.getAll("imgKOAlts") as string[];

    if (!postId || files.length === 0) {
      return {
        success: false,
        error: "Missing required fields",
      };
    }

    const db = await getDB();

    // Process each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imgENGAlt = imgENGAlts[i] || "";
      const imgKOAlt = imgKOAlts[i] || "";

      // Create unique filename
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Get file extension
      const originalName = file.name;
      const extension = originalName.split(".").pop();

      // Create a unique filename with the original extension
      const filename = `mice-post-image-${uuidv4()}.${extension}`;
      const imagePath = `/uploads/mice-solutions/${filename}`;
      const fullPath = join(
        process.cwd(),
        "public",
        "uploads",
        "mice-solutions",
        filename
      );

      // Write the file to the public directory
      await writeFile(fullPath, buffer);

      // Save postImageImage in the database
      await db.insert(postImageImages).values({
        imgPath: imagePath,
        imgENGAlt,
        imgKOAlt,
        postId,
      });
    }

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");
    revalidatePath("/[locale]/mice-solutions/[id]", "page");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error adding post images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete a post image
export async function deletePostImage(id: string): Promise<MiceResult> {
  try {
    const db = await getDB();

    // Get the image data to access the image path
    const imageData = await db.query.postImageImages.findFirst({
      where: eq(postImageImages.id, id),
    });

    if (!imageData) {
      return {
        success: false,
        error: "Image not found",
      };
    }

    // Delete the image file from filesystem
    if (imageData.imgPath) {
      try {
        const imagePath = imageData.imgPath.startsWith("/")
          ? imageData.imgPath.substring(1)
          : imageData.imgPath;
        const fullPath = join(process.cwd(), "public", imagePath);

        if (existsSync(fullPath)) {
          await unlink(fullPath);
        }
      } catch (err) {
        console.error("Error deleting image file:", err);
        // Continue with deletion even if file removal fails
      }
    }

    // Delete the image from the database
    await db.delete(postImageImages).where(eq(postImageImages.id, id));

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");
    revalidatePath("/[locale]/mice-solutions/[id]", "page");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post image:", error);
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

    // Get the post data to access image paths
    const postData = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        postImageImages: true,
      },
    });

    if (!postData) {
      return {
        success: false,
        error: "Post not found",
      };
    }

    // Delete the main post image from filesystem
    if (postData.imgPath) {
      try {
        const imagePath = postData.imgPath.startsWith("/")
          ? postData.imgPath.substring(1)
          : postData.imgPath;
        const fullPath = join(process.cwd(), "public", imagePath);

        if (existsSync(fullPath)) {
          await unlink(fullPath);
        }
      } catch (err) {
        console.error("Error deleting post main image file:", err);
        // Continue with deletion even if file removal fails
      }
    }

    // Delete all postImageImages files from filesystem
    if (postData.postImageImages && postData.postImageImages.length > 0) {
      for (const image of postData.postImageImages) {
        try {
          const imagePath = image.imgPath.startsWith("/")
            ? image.imgPath.substring(1)
            : image.imgPath;
          const fullPath = join(process.cwd(), "public", imagePath);

          if (existsSync(fullPath)) {
            await unlink(fullPath);
          }
        } catch (err) {
          console.error("Error deleting post image file:", err);
          // Continue with deletion even if file removal fails
        }
      }
    }

    // First delete all postImageImages associated with this post from database
    await db.delete(postImageImages).where(eq(postImageImages.postId, id));

    // Then delete the post itself from database
    await db.delete(posts).where(eq(posts.id, id));

    // Revalidate the mice pages to show the updated data
    revalidatePath("/[locale]/admin/mice-setting", "page");
    revalidatePath("/[locale]/mice-solutions", "page");
    revalidatePath("/[locale]/mice-solutions/[id]", "page");

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
    const imagePath = `/uploads/mice-solutions/${filename}`;
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
    revalidatePath("/[locale]/mice-solutions/[id]", "page");
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
