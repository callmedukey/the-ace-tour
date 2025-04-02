"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFaq, updateFaq, deleteFaq } from "@/actions/faqs";
import { useState } from "react";

interface FaqFormProps {
  faqData?: {
    id: number;
    KOquestion: string;
    ENGquestion: string;
    KOanswer: string;
    ENGanswer: string;
  };
  isNew?: boolean;
  onSuccess?: () => void;
}

export function FaqForm({ faqData, isNew = false, onSuccess }: FaqFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    KOquestion: faqData?.KOquestion || "",
    ENGquestion: faqData?.ENGquestion || "",
    KOanswer: faqData?.KOanswer || "",
    ENGanswer: faqData?.ENGanswer || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (isNew) {
        result = await createFaq(formData);
      } else if (faqData) {
        result = await updateFaq(faqData.id, formData);
      }

      if (result?.success) {
        // Show success message
        alert(isNew ? "FAQ created successfully" : "FAQ updated successfully");
        
        // Reset form if creating new
        if (isNew) {
          setFormData({
            KOquestion: "",
            ENGquestion: "",
            KOanswer: "",
            ENGanswer: "",
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
        alert(`Failed to ${isNew ? "create" : "update"} FAQ: ${result?.error}`);
      }
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} FAQ:`, error);
      alert(`An error occurred while ${isNew ? "creating" : "updating"} the FAQ`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!faqData || !confirm("Are you sure you want to delete this FAQ?")) return;
    
    setIsDeleting(true);

    try {
      const result = await deleteFaq(faqData.id);
      if (result.success) {
        // Show success message
        alert("FAQ deleted successfully");
        
        // Call onSuccess callback if provided or reload the page
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        // Show error message
        alert(`Failed to delete FAQ: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      alert("An error occurred while deleting the FAQ");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ENGquestion">English Question</Label>
          <Input
            id="ENGquestion"
            name="ENGquestion"
            value={formData.ENGquestion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOquestion">Korean Question</Label>
          <Input
            id="KOquestion"
            name="KOquestion"
            value={formData.KOquestion}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="ENGanswer">English Answer</Label>
          <Textarea
            id="ENGanswer"
            name="ENGanswer"
            value={formData.ENGanswer}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="KOanswer">Korean Answer</Label>
          <Textarea
            id="KOanswer"
            name="KOanswer"
            value={formData.KOanswer}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (isNew ? "Creating..." : "Updating...") : (isNew ? "Create FAQ" : "Update FAQ")}
        </Button>
        
        {!isNew && faqData && (
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete FAQ"}
          </Button>
        )}
      </div>
    </form>
  );
}