"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createReview, updateReview, deleteReview } from "@/actions/reviews";
import { useState } from "react";

interface ReviewFormProps {
  reviewData?: {
    id: number;
    initial: string;
    name: string;
    content: string;
  };
  isNew?: boolean;
  onSuccess?: () => void;
}

export function ReviewForm({
  reviewData,
  isNew = false,
  onSuccess,
}: ReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    initial: reviewData?.initial || "",
    name: reviewData?.name || "",
    content: reviewData?.content || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.initial) {
      newErrors.initial = "Initial is required";
    } else if (formData.initial.length > 10) {
      newErrors.initial = "Initial must be less than 10 characters";
    }

    if (!formData.name) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.length > 10) {
      newErrors.name = "Name must be less than 10 characters";
    }

    if (!formData.content) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 3) {
      newErrors.content = "Content must be at least 3 characters";
    } else if (formData.content.length > 200) {
      newErrors.content = "Content must be less than 200 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (isNew) {
        result = await createReview(formData);
      } else if (reviewData) {
        result = await updateReview(reviewData.id, formData);
      }

      if (result?.success) {
        // Show success message
        alert(
          isNew ? "Review created successfully" : "Review updated successfully"
        );

        // Reset form if creating new
        if (isNew) {
          setFormData({
            initial: "",
            name: "",
            content: "",
          });
        }

        // Call onSuccess callback if provided or reload the page
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        // Show error message
        alert(
          `Failed to ${isNew ? "create" : "update"} review: ${result?.error}`
        );
      }
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} review:`, error);
      alert(
        `An error occurred while ${isNew ? "creating" : "updating"} the review`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewData || !confirm("Are you sure you want to delete this review?"))
      return;

    setIsDeleting(true);

    try {
      const result = await deleteReview(reviewData.id);
      if (result.success) {
        // Show success message
        alert("Review deleted successfully");

        // Call onSuccess callback if provided or reload the page
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        // Show error message
        alert(`Failed to delete review: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("An error occurred while deleting the review");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="initial">Initial</Label>
          <Input
            id="initial"
            name="initial"
            value={formData.initial}
            onChange={handleChange}
            maxLength={1}
            required
            className={errors.initial ? "border-red-500" : ""}
          />
          {errors.initial && (
            <p className="text-red-500 text-sm">{errors.initial}</p>
          )}
          <p className="text-xs text-gray-500">
            The initial(s) of the reviewer (1-10 characters)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={10}
            required
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          <p className="text-xs text-gray-500">
            The name of the reviewer (3-10 characters)
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="content">Review Content</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            maxLength={200}
            required
            className={errors.content ? "border-red-500" : ""}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content}</p>
          )}
          <div className="flex justify-between">
            <p className="text-xs text-gray-500">
              The review content (3-200 characters)
            </p>
            <p className="text-xs text-gray-500">
              {formData.content.length}/200
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? isNew
              ? "Creating..."
              : "Updating..."
            : isNew
            ? "Create Review"
            : "Update Review"}
        </Button>

        {!isNew && reviewData && (
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Review"}
          </Button>
        )}
      </div>
    </form>
  );
}
