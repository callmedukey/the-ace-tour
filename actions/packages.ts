"use server";

import { getDB } from "@/db";
import { packages, images } from "@/db/schemas/packages";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

// Define result types
interface PackageResult {
  success: boolean;
  error?: string;
}

interface ImageUploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

// Update package details
export async function updatePackage(
  id: string,
  packageData: {
    ENGaccentText: string;
    KOaccentText: string;
    ENGfirstPoint: string;
    KOfirstPoint: string;
    ENGsecondPoint: string;
    KOsecondPoint: string;
    ENGthirdPoint: string;
    KOthirdPoint: string;
    ENGprice: string;
    KOprice: string;
    ENGbuttonText: string;
    KObuttonText: string;
    buttonLink: string;
    mostPopular: boolean;
  }
): Promise<PackageResult> {
  try {
    const db = await getDB();

    await db
      .update(packages)
      .set(packageData)
      .where(eq(packages.id, id));

    // Revalidate the packages page to show the updated data
    revalidatePath("/[locale]/admin/packages-setting", "page");
    revalidatePath("/[locale]/travel-packages", "page");

    return { success: true };
  } catch (error) {
    console.error("Error updating package:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Upload image and associate with a package
export async function uploadPackageImage(
  formData: FormData
): Promise<ImageUploadResult> {
  try {
    const packageId = formData.get("packageId") as string;
    const ENGalt = formData.get("ENGalt") as string;
    const KOalt = formData.get("KOalt") as string;
    const file = formData.get("file") as File;

    if (!packageId || !ENGalt || !KOalt || !file) {
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
    const filename = `${packageId}-${uuidv4()}.${extension}`;
    const imagePath = `/travel-packages/${filename}`;
    const fullPath = join(process.cwd(), "public", "travel-packages", filename);

    // Write the file to the public directory
    await writeFile(fullPath, buffer);

    // Save image reference in the database
    const db = await getDB();
    await db.insert(images).values({
      path: imagePath,
      ENGalt,
      KOalt,
      packageId,
    });

    // Revalidate the packages page to show the updated data
    revalidatePath("/[locale]/admin/packages-setting", "page");
    revalidatePath("/[locale]/travel-packages", "page");

    return { 
      success: true,
      path: imagePath
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Delete an image
export async function deletePackageImage(
  imageId: string
): Promise<PackageResult> {
  try {
    const db = await getDB();

    await db
      .delete(images)
      .where(eq(images.id, imageId));

    // Revalidate the packages page to show the updated data
    revalidatePath("/[locale]/admin/packages-setting", "page");
    revalidatePath("/[locale]/travel-packages", "page");

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Get all packages with their images
export async function getPackagesWithImages() {
  try {
    const db = await getDB();
    
    const allPackages = await db.query.packages.findMany({
      with: {
        images: true,
      },
    });
    
    return { 
      success: true,
      packages: allPackages
    };
  } catch (error) {
    console.error("Error fetching packages:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      packages: []
    };
  }
}