"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMice, createMice } from "@/actions/mice";
import { useState } from "react";

interface MiceFormProps {
  miceData?: {
    id: string;
    ENGtitle: string;
    KOtitle: string;
    firstValue: number;
    firstValueENGText: string;
    firstValueKOText: string;
    secondValue: number;
    secondValueENGText: string;
    secondValueKOText: string;
    thirdValue: number;
    thirdValueENGText: string;
    thirdValueKOText: string;
  };
  isNew?: boolean;
}

export function MiceForm({ miceData, isNew = false }: MiceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ENGtitle: miceData?.ENGtitle || "",
    KOtitle: miceData?.KOtitle || "",
    firstValue: miceData?.firstValue || 0,
    firstValueENGText: miceData?.firstValueENGText || "",
    firstValueKOText: miceData?.firstValueKOText || "",
    secondValue: miceData?.secondValue || 0,
    secondValueENGText: miceData?.secondValueENGText || "",
    secondValueKOText: miceData?.secondValueKOText || "",
    thirdValue: miceData?.thirdValue || 0,
    thirdValueENGText: miceData?.thirdValueENGText || "",
    thirdValueKOText: miceData?.thirdValueKOText || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name.includes("Value") && !name.includes("Text") 
        ? parseInt(value) || 0 
        : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      
      if (isNew) {
        result = await createMice(formData);
        
        // Reload the page to show the newly created MICE
        if (result.success) {
          window.location.reload();
        }
      } else if (miceData) {
        result = await updateMice(miceData.id, formData);
      }

      if (result?.success) {
        // Show success message
        alert(isNew ? "MICE created successfully" : "MICE updated successfully");
        
        // Reset form if creating new
        if (isNew) {
          setFormData({
            ENGtitle: "",
            KOtitle: "",
            firstValue: 0,
            firstValueENGText: "",
            firstValueKOText: "",
            secondValue: 0,
            secondValueENGText: "",
            secondValueKOText: "",
            thirdValue: 0,
            thirdValueENGText: "",
            thirdValueKOText: "",
          });
        }
      } else {
        // Show error message
        alert(`Failed to ${isNew ? "create" : "update"} MICE: ${result?.error}`);
      }
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} MICE:`, error);
      alert(`An error occurred while ${isNew ? "creating" : "updating"} the MICE`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ENGtitle">English Title</Label>
          <Input
            id="ENGtitle"
            name="ENGtitle"
            value={formData.ENGtitle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOtitle">Korean Title</Label>
          <Input
            id="KOtitle"
            name="KOtitle"
            value={formData.KOtitle}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* First Value */}
        <div className="space-y-2">
          <Label htmlFor="firstValue">First Value</Label>
          <Input
            id="firstValue"
            name="firstValue"
            type="number"
            min="1"
            max="100"
            value={formData.firstValue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstValueENGText">First Value English Text</Label>
          <Input
            id="firstValueENGText"
            name="firstValueENGText"
            value={formData.firstValueENGText}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstValueKOText">First Value Korean Text</Label>
          <Input
            id="firstValueKOText"
            name="firstValueKOText"
            value={formData.firstValueKOText}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Second Value */}
        <div className="space-y-2">
          <Label htmlFor="secondValue">Second Value</Label>
          <Input
            id="secondValue"
            name="secondValue"
            type="number"
            min="1"
            max="100"
            value={formData.secondValue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondValueENGText">Second Value English Text</Label>
          <Input
            id="secondValueENGText"
            name="secondValueENGText"
            value={formData.secondValueENGText}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondValueKOText">Second Value Korean Text</Label>
          <Input
            id="secondValueKOText"
            name="secondValueKOText"
            value={formData.secondValueKOText}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Third Value */}
        <div className="space-y-2">
          <Label htmlFor="thirdValue">Third Value</Label>
          <Input
            id="thirdValue"
            name="thirdValue"
            type="number"
            min="1"
            max="100"
            value={formData.thirdValue}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thirdValueENGText">Third Value English Text</Label>
          <Input
            id="thirdValueENGText"
            name="thirdValueENGText"
            value={formData.thirdValueENGText}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thirdValueKOText">Third Value Korean Text</Label>
          <Input
            id="thirdValueKOText"
            name="thirdValueKOText"
            value={formData.thirdValueKOText}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (isNew ? "Creating..." : "Updating...") : (isNew ? "Create MICE" : "Update MICE")}
      </Button>
    </form>
  );
}