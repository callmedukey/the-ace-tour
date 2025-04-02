"use server";

import { getDB } from "@/db";
import { admin } from "@/db/schemas/admin";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/utils/hashPassword";
import createSalt from "@/lib/utils/createSalt";
import { z } from "zod";

// Define password schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Define result type
interface AdminResult {
  success: boolean;
  message: string;
}

// Update admin password
export async function updateAdminPassword(
  formData: FormData
): Promise<AdminResult> {
  try {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords
    const validationResult = passwordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      const errorMessage = 
        errors.password?.[0] || 
        errors.confirmPassword?.[0] || 
        "Invalid password";
      
      return {
        success: false,
        message: errorMessage,
      };
    }

    const db = await getDB();

    // Get the admin user (assuming there's only one admin user with username 'admin')
    const adminUser = await db.query.admin.findFirst({
      where: eq(admin.username, "admin"),
    });

    if (!adminUser) {
      return {
        success: false,
        message: "Admin user not found",
      };
    }

    // Generate new salt and hash the password
    const saltBytes = createSalt();
    const { hash, salt } = await hashPassword(password, saltBytes);

    // Update the admin password
    await db
      .update(admin)
      .set({
        password: hash,
        salt,
      })
      .where(eq(admin.username, "admin"));

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error updating admin password:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}