"use client";

import { PackageType, ImageType } from "@/db/schemas/packages";
import { PackageForm } from "./package-form";
import { ImageUpload } from "./image-upload";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PackageCardProps {
  packageData: PackageType & { images: ImageType[] };
}

export function PackageCard({ packageData }: PackageCardProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
      <h2 className="text-2xl font-bold mb-4">{packageData.ENGaccentText} / {packageData.KOaccentText}</h2>
      <p className="text-gray-500 mb-6">ID: {packageData.id}</p>
      
      <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">Package Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <PackageForm packageData={packageData} />
        </TabsContent>
        
        <TabsContent value="images">
          <ImageUpload 
            packageId={packageData.id} 
            existingImages={packageData.images} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}