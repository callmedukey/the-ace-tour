"use client";

import { Button } from "@/components/ui/button";
import { deleteNewsletter } from "@/actions/newsletter";
import { useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  id: number;
  email: string;
  onSuccess?: () => void;
}

export function DeleteButton({ id, email, onSuccess }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the subscription for ${email}?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteNewsletter(id);
      
      if (result.success) {
        // Show success message
        alert("Subscription deleted successfully");
        
        // Call onSuccess callback if provided or reload the page
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        // Show error message
        alert(`Failed to delete subscription: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting subscription:", error);
      alert("An error occurred while deleting the subscription");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
      title="Delete subscription"
    >
      {isDeleting ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );
}