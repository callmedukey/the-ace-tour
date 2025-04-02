"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPackageImage, deletePackageImage } from "@/actions/packages";
import { useState } from "react";
import { ImageType } from "@/db/schemas/packages";
import Image from "next/image";

interface ImageUploadProps {
  packageId: string;
  existingImages: ImageType[];
}

export function ImageUpload({ packageId, existingImages }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [images, setImages] = useState<ImageType[]>(existingImages);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append("packageId", packageId);

      const result = await uploadPackageImage(formData);
      if (result.success && result.path) {
        // Add the new image to the list
        setImages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(), // Temporary ID until page refresh
            path: result.path || "", // Ensure path is always a string
            ENGalt: formData.get("ENGalt") as string,
            KOalt: formData.get("KOalt") as string,
            packageId: packageId,
          },
        ]);

        // Reset the form - safely check if currentTarget exists
        if (e.currentTarget && typeof e.currentTarget.reset === "function") {
          e.currentTarget.reset();
        }

        // Show success message
        alert("Image uploaded successfully");
      } else {
        // Show error message
        alert(`Failed to upload image: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setIsDeleting(imageId);

      try {
        const result = await deletePackageImage(imageId);
        if (result.success) {
          // Remove the deleted image from the list
          setImages((prev) => prev.filter((img) => img.id !== imageId));

          // Show success message
          alert("Image deleted successfully");
        } else {
          // Show error message
          alert(`Failed to delete image: ${result.error}`);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("An error occurred while deleting the image");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Package Images</h3>

      {/* Display existing images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="border rounded-md p-4 relative">
            <div className="aspect-video relative mb-2">
              <Image
                src={image.path}
                alt={image.ENGalt}
                fill
                quality={100}
                unoptimized
                className="object-cover rounded-md"
              />
            </div>
            <div className="text-sm mb-1">
              <strong>English Alt:</strong> {image.ENGalt}
            </div>
            <div className="text-sm mb-2">
              <strong>Korean Alt:</strong> {image.KOalt}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(image.id)}
              disabled={isDeleting === image.id}
              className="w-full"
            >
              {isDeleting === image.id ? "Deleting..." : "Delete Image"}
            </Button>
          </div>
        ))}
      </div>

      {/* Upload new image form */}
      <form onSubmit={handleUpload} className="border rounded-md p-4">
        <h4 className="text-md font-medium mb-4">Upload New Image</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="ENGalt">English Alt Text</Label>
            <Input
              id="ENGalt"
              name="ENGalt"
              placeholder="English alt text for the image"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="KOalt">Korean Alt Text</Label>
            <Input
              id="KOalt"
              name="KOalt"
              placeholder="Korean alt text for the image"
              required
            />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <Label htmlFor="file">Image File</Label>
          <Input id="file" name="file" type="file" accept="image/*" required />
          <p className="text-xs text-gray-500">
            Recommended size: 1200x800 pixels. Max file size: 5MB.
          </p>
        </div>
        <Button type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
      </form>
    </div>
  );
}
