"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePackage } from "@/actions/packages";
import { useState } from "react";
import { PackageType } from "@/db/schemas/packages";
import { Checkbox } from "@/components/ui/checkbox";

interface PackageFormProps {
  packageData: PackageType;
}

export function PackageForm({ packageData }: PackageFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ENGaccentText: packageData.ENGaccentText,
    KOaccentText: packageData.KOaccentText,
    ENGfirstPoint: packageData.ENGfirstPoint,
    KOfirstPoint: packageData.KOfirstPoint,
    ENGsecondPoint: packageData.ENGsecondPoint,
    KOsecondPoint: packageData.KOsecondPoint,
    ENGthirdPoint: packageData.ENGthirdPoint,
    KOthirdPoint: packageData.KOthirdPoint,
    ENGprice: packageData.ENGprice,
    KOprice: packageData.KOprice,
    ENGbuttonText: packageData.ENGbuttonText,
    KObuttonText: packageData.KObuttonText,
    buttonLink: packageData.buttonLink,
    mostPopular: packageData.mostPopular,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, mostPopular: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updatePackage(packageData.id, formData);
      if (result.success) {
        // Show success message
        alert("Package updated successfully");
      } else {
        // Show error message
        alert(`Failed to update package: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert("An error occurred while updating the package");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ENGaccentText">English Accent Text</Label>
          <Input
            id="ENGaccentText"
            name="ENGaccentText"
            value={formData.ENGaccentText}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOaccentText">Korean Accent Text</Label>
          <Input
            id="KOaccentText"
            name="KOaccentText"
            value={formData.KOaccentText}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ENGfirstPoint">English First Point</Label>
          <Input
            id="ENGfirstPoint"
            name="ENGfirstPoint"
            value={formData.ENGfirstPoint}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOfirstPoint">Korean First Point</Label>
          <Input
            id="KOfirstPoint"
            name="KOfirstPoint"
            value={formData.KOfirstPoint}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ENGsecondPoint">English Second Point</Label>
          <Input
            id="ENGsecondPoint"
            name="ENGsecondPoint"
            value={formData.ENGsecondPoint}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOsecondPoint">Korean Second Point</Label>
          <Input
            id="KOsecondPoint"
            name="KOsecondPoint"
            value={formData.KOsecondPoint}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ENGthirdPoint">English Third Point</Label>
          <Input
            id="ENGthirdPoint"
            name="ENGthirdPoint"
            value={formData.ENGthirdPoint}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOthirdPoint">Korean Third Point</Label>
          <Input
            id="KOthirdPoint"
            name="KOthirdPoint"
            value={formData.KOthirdPoint}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ENGprice">English Price</Label>
          <Input
            id="ENGprice"
            name="ENGprice"
            value={formData.ENGprice}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KOprice">Korean Price</Label>
          <Input
            id="KOprice"
            name="KOprice"
            value={formData.KOprice}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ENGbuttonText">English Button Text</Label>
          <Input
            id="ENGbuttonText"
            name="ENGbuttonText"
            value={formData.ENGbuttonText}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="KObuttonText">Korean Button Text</Label>
          <Input
            id="KObuttonText"
            name="KObuttonText"
            value={formData.KObuttonText}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buttonLink">Button Link</Label>
          <Input
            id="buttonLink"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center space-x-2 h-full pt-8">
          <Checkbox
            id="mostPopular"
            checked={formData.mostPopular}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="mostPopular">Most Popular</Label>
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Package"}
      </Button>
    </form>
  );
}
