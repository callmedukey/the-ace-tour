"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { format } from "date-fns";

// Define a more flexible booking type to match the database structure
type Booking = {
  id: string;
  [key: string]: string | number | boolean | null | undefined | Date | object;
};

// Function to convert bookings to CSV
const convertToCSV = (bookings: Booking[]) => {
  if (bookings.length === 0) return '';
  
  // Get headers from the first booking
  const headers = Object.keys(bookings[0]).join(',');
  
  // Map each booking to a CSV row
  const rows = bookings.map(booking => {
    return Object.values(booking).map(value => {
      // Handle special cases like dates, nulls, etc.
      if (value === null || value === undefined) return '';
      if (value instanceof Date) {
        return format(value, 'yyyy-MM-dd');
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
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'shuttle-bookings.csv');
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