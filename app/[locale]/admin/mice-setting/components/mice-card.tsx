"use client";

import { MiceForm } from "./mice-form";
import { PostForm } from "./post-form";
import { deleteMice } from "@/actions/mice";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface MiceCardProps {
  miceData: {
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
    posts: {
      id: string;
      ENGtitle: string;
      KOtitle: string;
      ENGcontent: string;
      KOcontent: string;
      imgPath: string;
      imgENGAlt: string;
      imgKOAlt: string;
    }[];
  };
  onDelete?: () => void;
}

export function MiceCard({ miceData, onDelete }: MiceCardProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${miceData.ENGtitle}"? This will also delete all associated posts.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteMice(miceData.id);
      if (result.success) {
        alert("MICE deleted successfully");
        if (onDelete) onDelete();
      } else {
        alert(`Failed to delete MICE: ${result.error}`);
      }
    } catch (error) {
      console.error("Error deleting MICE:", error);
      alert("An error occurred while deleting the MICE");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePostSuccess = () => {
    // Hide the new post form after successful creation
    setShowNewPostForm(false);
    // Refresh the page to show the new post
    window.location.reload();
  };

  return (
    <div className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {miceData.ENGtitle} / {miceData.KOtitle}
        </h2>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete MICE"}
        </Button>
      </div>
      
      <p className="text-gray-500 mb-6">ID: {miceData.id}</p>
      
      <Tabs defaultValue="details" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="details">MICE Details</TabsTrigger>
          <TabsTrigger value="posts">Posts ({miceData.posts.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <MiceForm miceData={miceData} />
        </TabsContent>
        
        <TabsContent value="posts">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Posts</h3>
              <Button 
                onClick={() => setShowNewPostForm(!showNewPostForm)}
              >
                {showNewPostForm ? "Cancel" : "Add New Post"}
              </Button>
            </div>
            
            {showNewPostForm && (
              <PostForm 
                miceId={miceData.id} 
                isNew={true} 
                onSuccess={handlePostSuccess}
              />
            )}
            
            {miceData.posts.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {miceData.posts.map((post) => (
                  <AccordionItem key={post.id} value={post.id}>
                    <AccordionTrigger className="text-lg font-medium">
                      {post.ENGtitle} / {post.KOtitle}
                    </AccordionTrigger>
                    <AccordionContent>
                      <PostForm 
                        miceId={miceData.id} 
                        post={post} 
                        onSuccess={() => window.location.reload()}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No posts yet. Click &quot;Add New Post&quot; to create one.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}