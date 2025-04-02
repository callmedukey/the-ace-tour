"use client";

import { BookingStatus, updateBookingStatus } from "@/actions/booking-status";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface StatusDropdownProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

export function StatusDropdown({ bookingId, currentStatus }: StatusDropdownProps) {
  const [status, setStatus] = useState<BookingStatus>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    if (newStatus === status) return;
    
    setIsLoading(true);
    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      if (result.success) {
        setStatus(newStatus);
      } else {
        console.error("Failed to update status:", result.error);
        // You could add toast notification here
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Define status colors
  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-[130px] justify-between",
            getStatusColor(status),
            isLoading && "opacity-50 cursor-not-allowed"
          )}
          disabled={isLoading}
        >
          {status}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[130px]">
        <DropdownMenuItem
          onClick={() => handleStatusChange("CONFIRMED")}
          className={cn(
            "cursor-pointer justify-between",
            status === "CONFIRMED" && "font-medium"
          )}
        >
          CONFIRMED
          {status === "CONFIRMED" && <CheckIcon className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange("CANCELLED")}
          className={cn(
            "cursor-pointer justify-between",
            status === "CANCELLED" && "font-medium"
          )}
        >
          CANCELLED
          {status === "CANCELLED" && <CheckIcon className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}