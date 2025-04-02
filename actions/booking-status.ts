"use server";

import { getDB } from "@/db";
import { booking } from "@/db/schemas/booking";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export async function updateBookingStatus(id: string, status: BookingStatus) {
  try {
    const db = await getDB();
    
    await db.update(booking)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(booking.id, id));
    
    // Revalidate the bookings page to show the updated status
    revalidatePath("/[locale]/admin/shuttle-bookings");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}