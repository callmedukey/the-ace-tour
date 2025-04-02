"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createPost,
  updatePost,
  updatePostImage,
  deletePost,
} from "@/actions/mice";
import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";

interface PostFormProps {
  miceId: string;
  post?: {
    id: string;
    ENGtitle: string;
    KOtitle: string;
    ENGcontent: string;
    KOcontent: string;
    imgPath: string;
    imgENGAlt: string;
    imgKOAlt: string;
  };
  isNew?: boolean;
  onSuccess?: () => void;
}

export function PostForm({
  miceId,
  post,
  isNew = false,
  onSuccess,
}: PostFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [formData, setFormData] = useState({
    ENGtitle: post?.ENGtitle || "",
    KOtitle: post?.KOtitle || "",
    ENGcontent: post?.ENGcontent || "",
    KOcontent: post?.KOcontent || "",
    imgENGAlt: post?.imgENGAlt || "",
    imgKOAlt: post?.imgKOAlt || "",
  });
  const [imagePath, setImagePath] = useState(post?.imgPath || "");

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
      if (isNew) {
        // For new posts, we need to upload the image as part of the form
        const formElement = e.target as HTMLFormElement;
        const formDataObj = new FormData(formElement);
        formDataObj.append("miceId", miceId);

        const result = await createPost(formDataObj);
        if (result.success) {
          // Show success message
          alert("Post created successfully");

          // Reset form
          setFormData({
            ENGtitle: "",
            KOtitle: "",
            ENGcontent: "",
            KOcontent: "",
            imgENGAlt: "",
            imgKOAlt: "",
          });
          setImagePath("");

          // Reset file input
          const fileInput = formElement.querySelector(
            'input[type="file"]'
          ) as HTMLInputElement;
          if (fileInput) fileInput.value = "";

          // Call onSuccess callback if provided or reload the page
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.reload();
          }
        } else {
          // Show error message
          alert(`Failed to create post: ${result.error}`);
        }
      } else if (post) {
        // For existing posts, we update the text content
        const result = await updatePost(post.id, formData);
        if (result.success) {
          // Show success message
          alert("Post updated successfully");

          // Call onSuccess callback if provided or reload the page
          if (onSuccess) {
            onSuccess();
          } else {
            window.location.reload();
          }
        } else {
          // Show error message
          alert(`Failed to update post: ${result.error}`);
        }
      }
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} post:`, error);
      alert(
        `An error occurred while ${isNew ? "creating" : "updating"} the post`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingImage(true);

    try {
      if (!post) return;

      const formElement = e.target as HTMLFormElement;
      const formDataObj = new FormData(formElement);
      formDataObj.append("postId", post.id);

      const result = await updatePostImage(formDataObj);
      if (result.success && result.path) {
        // Update the image path
        setImagePath(result.path);

        // Show success message
        alert("Image updated successfully");

        // Reset file input
        const fileInput = formElement.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // Call onSuccess callback if provided or reload the page
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        // Show error message
        alert(`Failed to update image: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating image:", error);
      alert("An error occurred while updating the image");
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);

    try {
      const result = await deletePost(post.id);
      if (result.success) {
        // Show success message
        alert("Post deleted successfully");

        // Call onSuccess callback if provided or reload the page
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      } else {
        // Show error message
        alert(`Failed to delete post: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4">
        {isNew ? "Create New Post" : "Edit Post"}
      </h3>

      {/* Main form for post content */}
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

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ENGcontent">English Content</Label>
            <Textarea
              id="ENGcontent"
              name="ENGcontent"
              value={formData.ENGcontent}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="KOcontent">Korean Content</Label>
            <Textarea
              id="KOcontent"
              name="KOcontent"
              value={formData.KOcontent}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          {isNew && (
            <>
              <div className="space-y-2">
                <Label htmlFor="imgENGAlt">English Image Alt Text</Label>
                <Input
                  id="imgENGAlt"
                  name="imgENGAlt"
                  value={formData.imgENGAlt}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imgKOAlt">Korean Image Alt Text</Label>
                <Input
                  id="imgKOAlt"
                  name="imgKOAlt"
                  value={formData.imgKOAlt}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="file">Image</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="image/*"
                  required
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 1200x800 pixels. Max file size: 5MB.
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isNew
                ? "Creating..."
                : "Updating..."
              : isNew
              ? "Create Post"
              : "Update Post"}
          </Button>

          {!isNew && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </Button>
          )}
        </div>
      </form>

      {/* Image section for existing posts */}
      {!isNew && post && (
        <div className="mt-8 pt-8 border-t">
          <h4 className="text-lg font-medium mb-4">Post Image</h4>

          <div className="mb-6">
            <div className="aspect-video relative mb-4 max-w-2xl">
              <Image
                src={imagePath || post.imgPath}
                alt={formData.imgENGAlt}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="text-sm mb-1">
              <strong>English Alt:</strong> {formData.imgENGAlt}
            </div>
            <div className="text-sm mb-4">
              <strong>Korean Alt:</strong> {formData.imgKOAlt}
            </div>
          </div>

          <form onSubmit={handleImageUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="update-imgENGAlt">English Image Alt Text</Label>
                <Input
                  id="update-imgENGAlt"
                  name="imgENGAlt"
                  value={formData.imgENGAlt}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-imgKOAlt">Korean Image Alt Text</Label>
                <Input
                  id="update-imgKOAlt"
                  name="imgKOAlt"
                  value={formData.imgKOAlt}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="update-file">New Image</Label>
                <Input
                  id="update-file"
                  name="file"
                  type="file"
                  accept="image/*"
                  required
                />
                <p className="text-xs text-gray-500">
                  Recommended size: 1200x800 pixels. Max file size: 5MB.
                </p>
              </div>
            </div>

            <Button type="submit" disabled={isUpdatingImage}>
              {isUpdatingImage ? "Updating Image..." : "Update Image"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
