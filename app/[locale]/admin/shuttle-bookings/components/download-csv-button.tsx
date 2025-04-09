"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { format } from "date-fns";

// Define a more flexible booking type to match the database structure
type Booking = {
  id: string;
  [key: string]: string | number | boolean | null | undefined | Date | object;
};

// Define a mapping of database column names to human-readable headers
const headerMapping: Record<string, string> = {
  id: "Booking ID",
  stripeId: "Stripe ID",
  customerEmail: "Customer Email",
  customerName: "Customer Name",
  tripType: "Trip Type",
  from: "From",
  to: "To",
  departingDate: "Departing Date",
  returningDate: "Returning Date",
  departureTime: "Departure Time",
  returnTime: "Return Time",
  passengers: "Passengers",
  pickUpaddress: "Pick Up Address",
  dropOffaddress: "Drop Off Address",
  price: "Price (USD)",
  status: "Booking Status",
  paymentStatus: "Payment Status",
  paymentId: "Payment ID",
  paymentMethod: "Payment Method",
  paidAt: "Paid At",
  luggage: "Luggage",
  createdAt: "Created At",
  updatedAt: "Updated At"
};

// Function to convert bookings to CSV
const convertToCSV = (bookings: Booking[]) => {
  if (bookings.length === 0) return '';
  
  // Get all keys from the first booking
  const keys = Object.keys(bookings[0]);
  
  // Create human-readable headers
  const headers = keys.map(key => headerMapping[key] || key).join(',');
  
  // Map each booking to a CSV row
  const rows = bookings.map(booking => {
    return keys.map(key => {
      const value = booking[key];
      // Handle special cases like dates, nulls, etc.
      if (value === null || value === undefined) return '';
      if (value instanceof Date) {
        return format(value, 'yyyy-MM-dd HH:mm:ss');
      }
      // Format price with dollar sign
      if (key === 'price' && typeof value === 'number') {
        return `$${value.toFixed(2)}`;
      }
      // Escape commas and quotes in string values
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  }).join('\n');
  
  return `${headers}\n${rows}`;
};

export function DownloadCSVButton({ bookings }: { bookings: Booking[] }) {
  const handleDownload = () => {
    const csvContent = convertToCSV(bookings);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a timestamp for the filename
    const now = new Date();
    const timestamp = format(now, 'yyyy-MM-dd_HH-mm-ss');
    const filename = `shuttle-bookings_${timestamp}.csv`;
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={handleDownload} className="flex items-center gap-2">
      <DownloadIcon className="h-4 w-4" />
      Download CSV
    </Button>
  );
}