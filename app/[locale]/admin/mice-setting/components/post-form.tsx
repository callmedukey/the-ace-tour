"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  createPost,
  updatePost,
  updatePostImage,
  deletePost,
  addPostImages,
  deletePostImage,
} from "@/actions/mice";
import { useState } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { TipTapEditor } from "./tiptap-editor";
import { Plus, X } from "lucide-react";

interface PostImageImage {
  id: string;
  imgPath: string;
  imgENGAlt: string;
  imgKOAlt: string;
}

interface PostFormProps {
  miceId: string;
  post?: {
    id: string;
    ENGtitle: string;
    KOtitle: string;
    ENGcontent: string;
    KOcontent: string;
    mainENGContent: string;
    mainKOContent: string;
    imgPath: string;
    imgENGAlt: string;
    imgKOAlt: string;
    postImageImages?: PostImageImage[];
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
    mainENGContent: post?.mainENGContent || "",
    mainKOContent: post?.mainKOContent || "",
    imgENGAlt: post?.imgENGAlt || "",
    imgKOAlt: post?.imgKOAlt || "",
  });
  const [imagePath, setImagePath] = useState(post?.imgPath || "");
  const [isAddingImages, setIsAddingImages] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState<string | null>(null);
  const [postImages, setPostImages] = useState<
    Array<{ file?: File; ENGAlt: string; KOAlt: string }>
  >([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTipTapChange = (name: string, html: string) => {
    setFormData((prev) => ({ ...prev, [name]: html }));
  };

  const addPostImage = () => {
    setPostImages([...postImages, { ENGAlt: "", KOAlt: "" }]);
  };

  const removePostImage = (index: number) => {
    const newPostImages = [...postImages];
    newPostImages.splice(index, 1);
    setPostImages(newPostImages);
  };

  const handlePostImageChange = (
    index: number,
    field: string,
    value: string | File
  ) => {
    const newPostImages = [...postImages];
    if (field === "file" && value instanceof File) {
      newPostImages[index] = { ...newPostImages[index], file: value };
    } else if (typeof value === "string") {
      newPostImages[index] = { ...newPostImages[index], [field]: value };
    }
    setPostImages(newPostImages);
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

        // Add the TipTap editor content
        formDataObj.append("mainENGContent", formData.mainENGContent);
        formDataObj.append("mainKOContent", formData.mainKOContent);

        // Add post images if any
        postImages.forEach((image) => {
          if (image.file) {
            formDataObj.append("postImageFiles", image.file);
            formDataObj.append("postImageENGAlts", image.ENGAlt);
            formDataObj.append("postImageKOAlts", image.KOAlt);
          }
        });

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
            mainENGContent: "",
            mainKOContent: "",
            imgENGAlt: "",
            imgKOAlt: "",
          });
          setImagePath("");
          setPostImages([]);

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
            <Label htmlFor="ENGcontent">English Content (Short)</Label>
            <Textarea
              id="ENGcontent"
              name="ENGcontent"
              value={formData.ENGcontent}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="KOcontent">Korean Content (Short)</Label>
            <Textarea
              id="KOcontent"
              name="KOcontent"
              value={formData.KOcontent}
              onChange={handleChange}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="mainENGContent">English Main Content</Label>
            <TipTapEditor
              content={formData.mainENGContent}
              onChange={(html) => handleTipTapChange("mainENGContent", html)}
              placeholder="Enter detailed English content here..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="mainKOContent">Korean Main Content</Label>
            <TipTapEditor
              content={formData.mainKOContent}
              onChange={(html) => handleTipTapChange("mainKOContent", html)}
              placeholder="Enter detailed Korean content here..."
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
                <Label htmlFor="file">Thumbnail Image</Label>
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

        {isNew && (
          <div className="space-y-4 mt-6 border-t pt-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium">Main Carousel Images</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPostImage}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Image
              </Button>
            </div>

            {postImages.map((image, index) => (
              <div
                key={index}
                className="border rounded-md p-4 space-y-4 relative"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removePostImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`postImage-${index}-ENGAlt`}>
                      English Image Alt Text
                    </Label>
                    <Input
                      id={`postImage-${index}-ENGAlt`}
                      value={image.ENGAlt}
                      onChange={(e) =>
                        handlePostImageChange(index, "ENGAlt", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`postImage-${index}-KOAlt`}>
                      Korean Image Alt Text
                    </Label>
                    <Input
                      id={`postImage-${index}-KOAlt`}
                      value={image.KOAlt}
                      onChange={(e) =>
                        handlePostImageChange(index, "KOAlt", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`postImage-${index}-file`}>Image</Label>
                  <Input
                    id={`postImage-${index}-file`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePostImageChange(
                          index,
                          "file",
                          e.target.files[0]
                        );
                      }
                    }}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        )}

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
                quality={100}
                unoptimized
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

      {/* Additional Images section for existing posts */}
      {!isNew && post && (
        <div className="mt-8 pt-8 border-t">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Main Carousel Images</h4>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addPostImage}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Image
            </Button>
          </div>
          
          {/* Display existing post images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {post.postImageImages && post.postImageImages.map((image) => (
              <div key={image.id} className="border rounded-md p-4 space-y-4 relative">
                <div className="aspect-video relative mb-4">
                  <Image
                    src={image.imgPath}
                    alt={image.imgENGAlt}
                    fill
                    className="object-cover rounded-md"
                    quality={100}
                    unoptimized
                  />
                </div>
                <div className="text-sm mb-1">
                  <strong>English Alt:</strong> {image.imgENGAlt}
                </div>
                <div className="text-sm mb-4">
                  <strong>Korean Alt:</strong> {image.imgKOAlt}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  disabled={isDeletingImage === image.id}
                  onClick={async () => {
                    if (!confirm("Are you sure you want to delete this image?")) return;
                    
                    setIsDeletingImage(image.id);
                    try {
                      const result = await deletePostImage(image.id);
                      
                      if (result.success) {
                        alert("Image deleted successfully");
                        
                        // Reload the page to show the updated data
                        if (onSuccess) {
                          onSuccess();
                        } else {
                          window.location.reload();
                        }
                      } else {
                        alert(`Failed to delete image: ${result.error}`);
                      }
                    } catch (error) {
                      console.error("Error deleting image:", error);
                      alert("An error occurred while deleting the image");
                    } finally {
                      setIsDeletingImage(null);
                    }
                  }}
                >
                  {isDeletingImage === image.id ? "Deleting..." : "Delete Image"}
                </Button>
              </div>
            ))}
          </div>
          
          {/* Add new images */}
          {postImages.length > 0 && (
            <div className="space-y-4 mb-6">
              <h5 className="text-md font-medium">New Images to Add</h5>
              {postImages.map((image, index) => (
                <div key={index} className="border rounded-md p-4 space-y-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removePostImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`postImage-${index}-ENGAlt`}>English Image Alt Text</Label>
                      <Input
                        id={`postImage-${index}-ENGAlt`}
                        value={image.ENGAlt}
                        onChange={(e) => handlePostImageChange(index, 'ENGAlt', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`postImage-${index}-KOAlt`}>Korean Image Alt Text</Label>
                      <Input
                        id={`postImage-${index}-KOAlt`}
                        value={image.KOAlt}
                        onChange={(e) => handlePostImageChange(index, 'KOAlt', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`postImage-${index}-file`}>Image</Label>
                    <Input
                      id={`postImage-${index}-file`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handlePostImageChange(index, 'file', e.target.files[0]);
                        }
                      }}
                      required
                    />
                  </div>
                </div>
              ))}
              
              <Button 
                type="button" 
                disabled={isAddingImages}
                onClick={async () => {
                  if (!post || postImages.length === 0) return;
                  
                  setIsAddingImages(true);
                  try {
                    // Create FormData to upload the images
                    const formData = new FormData();
                    formData.append("postId", post.id);
                    
                    // Add all images to the FormData
                    postImages.forEach((image) => {
                      if (image.file) {
                        formData.append("files", image.file);
                        formData.append("imgENGAlts", image.ENGAlt);
                        formData.append("imgKOAlts", image.KOAlt);
                      }
                    });
                    
                    const result = await addPostImages(formData);
                    
                    if (result.success) {
                      alert("Images added successfully");
                      
                      // Reset the postImages array
                      setPostImages([]);
                      
                      // Reload the page to show the updated data
                      if (onSuccess) {
                        onSuccess();
                      } else {
                        window.location.reload();
                      }
                    } else {
                      alert(`Failed to add images: ${result.error}`);
                    }
                  } catch (error) {
                    console.error("Error adding images:", error);
                    alert("An error occurred while adding the images");
                  } finally {
                    setIsAddingImages(false);
                  }
                }}
              >
                {isAddingImages ? "Saving..." : "Save New Images"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
