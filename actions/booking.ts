"use server";
import { db } from "@/db";
import { booking } from "@/db/schemas/booking";
import { eq, and, gte, lte } from "drizzle-orm";

// Define the result type for booking count
interface BookingCountResult {
  success: boolean;
  count?: number;
  remainingSpots?: number;
  maxSpots?: number;
  error?: string;
}

// Define the result type for booking operations
interface BookingResult {
  success: boolean;
  bookingId?: string;
  error?: string;
}

export async function getBookingCountForRoute(
  from: string,
  to: string,
  date: Date
): Promise<BookingCountResult> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Format dates as strings in YYYY-MM-DD format for PostgreSQL
    const startDateStr = startOfDay.toISOString().split("T")[0];
    const endDateStr = endOfDay.toISOString().split("T")[0];

    const bookings = await db.query.booking.findMany({
      where: and(
        eq(booking.from, from),
        eq(booking.to, to),
        gte(booking.departingDate, startDateStr),
        lte(booking.departingDate, endDateStr),
        eq(booking.paymentStatus, "Paid")
      ),
    });

    const count = bookings.length;
    const MAX_SPOTS = 30;
    const remainingSpots = MAX_SPOTS - count;

    return {
      success: true,
      count,
      remainingSpots,
      maxSpots: MAX_SPOTS,
    };
  } catch (error) {
    console.error("Error counting bookings:", error);
    return { success: false, error: "Failed to count bookings" };
  }
}

export async function createPendingBooking(bookingData: {
  customerEmail: string;
  customerName: string;
  tripType: "One Way" | "Round Trip";
  from: string;
  to: string;
  departingDate: Date;
  returningDate?: Date;
  departureTime: string;
  returnTime?: string;
  passengers: number;
  address?: string;
  price: number;
  stripeId: string;
  luggage: number;
}): Promise<BookingResult> {
  try {
    // Format dates as strings in YYYY-MM-DD format for PostgreSQL
    const departingDateStr = bookingData.departingDate
      .toISOString()
      .split("T")[0];
    const returningDateStr = bookingData.returningDate
      ? bookingData.returningDate.toISOString().split("T")[0]
      : undefined;

    // Create a new booking with pending payment status
    await db.insert(booking).values({
      stripeId: bookingData.stripeId,
      customerEmail: bookingData.customerEmail,
      customerName: bookingData.customerName,
      tripType: bookingData.tripType === "One Way" ? "One Way" : "Round Trip",
      from: bookingData.from,
      to: bookingData.to,
      departingDate: departingDateStr,
      returningDate: returningDateStr,
      departureTime: bookingData.departureTime,
      returnTime: bookingData.returnTime,
      passengers: bookingData.passengers,
      address: bookingData.address,
      price: bookingData.price,
      luggage: bookingData.luggage,
      status: "CONFIRMED", // Using the enum value
      paymentStatus: "Pending", // Using the enum value
    });

    // Query the created booking to get its ID
    const createdBooking = await db.query.booking.findFirst({
      where: eq(booking.stripeId, bookingData.stripeId),
      columns: {
        id: true,
      },
    });

    return {
      success: true,
      bookingId: createdBooking?.id,
    };
  } catch (error) {
    console.error("Error creating pending booking:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function updateBookingAfterPayment(
  stripeId: string,
  paymentData: {
    paymentId: string;
    paymentMethod: string;
  }
): Promise<BookingResult> {
  try {
    // Find the booking by stripeId
    const existingBooking = await db.query.booking.findFirst({
      where: eq(booking.stripeId, stripeId),
    });

    if (!existingBooking) {
      return { success: false, error: "Booking not found" };
    }

    // Format date as string in YYYY-MM-DD format for PostgreSQL
    const paidAtStr = new Date().toISOString().split("T")[0];

    // Update the booking with payment information
    await db
      .update(booking)
      .set({
        paymentStatus: "Paid", // Using the enum value
        paymentId: paymentData.paymentId,
        paymentMethod: paymentData.paymentMethod,
        paidAt: paidAtStr,
        updatedAt: new Date(),
      })
      .where(eq(booking.stripeId, stripeId));

    return { success: true };
  } catch (error) {
    console.error("Error updating booking after payment:", error);
    return { success: false, error: "Failed to update booking" };
  }
}
