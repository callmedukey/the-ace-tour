"use client";

import { Button } from "@/components/ui/button";
import { updateInquiryStatus, deleteInquiry } from "@/actions/inquiries";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  inquiryId: number;
  currentStatus: string;
  locale: string;
}

export function ActionButtons({ inquiryId, currentStatus, locale }: ActionButtonsProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (status: "Pending" | "Resolved" | "Closed") => {
    if (status === currentStatus) return;
    
    setIsUpdating(status);

    try {
      const result = await updateInquiryStatus(inquiryId, status);
      
      if (result.success) {
        // Show success message
        alert(`Inquiry marked as ${status}`);
        // Refresh the page to show the updated status
        window.location.reload();
      } else {
        // Show error message
        alert(`Failed to update status: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the status");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteInquiry(inquiryId);
      
      if (result.success) {
        // Show success message
        alert("Inquiry deleted successfully");
        // Navigate back to the inquiries list
        router.push(`/${locale}/admin/inquiries`);
      } else {
        // Show error message
        alert(`Failed to delete inquiry: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert("An error occurred while deleting the inquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button 
        variant="outline"
        onClick={() => handleStatusUpdate("Resolved")}
        disabled={isUpdating !== null || isDeleting || currentStatus === "Resolved"}
        className={currentStatus === "Resolved" ? "bg-green-100" : ""}
      >
        {isUpdating === "Resolved" ? "Updating..." : "Mark as Resolved"}
      </Button>
      <Button 
        variant="outline"
        onClick={() => handleStatusUpdate("Closed")}
        disabled={isUpdating !== null || isDeleting || currentStatus === "Closed"}
        className={currentStatus === "Closed" ? "bg-gray-100" : ""}
      >
        {isUpdating === "Closed" ? "Updating..." : "Mark as Closed"}
      </Button>
      <Button 
        variant="destructive"
        onClick={handleDelete}
        disabled={isUpdating !== null || isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete Inquiry"}
      </Button>
    </div>
  );
}