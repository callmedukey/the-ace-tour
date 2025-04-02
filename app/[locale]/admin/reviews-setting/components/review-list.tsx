"use client";

import { useState } from "react";
import { ReviewForm } from "./review-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  reviews: {
    id: number;
    initial: string;
    name: string;
    content: string;
    createdAt: string | null;
    updatedAt: string | null;
  }[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  const [expandedReview, setExpandedReview] = useState<number | null>(null);

  const handleAccordionChange = (value: string) => {
    const reviewId = parseInt(value);
    setExpandedReview(reviewId === expandedReview ? null : reviewId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Existing Reviews ({reviews.length})</h2>
      
      {reviews.length > 0 ? (
        <Accordion 
          type="single" 
          collapsible 
          className="w-full space-y-4"
          value={expandedReview ? expandedReview.toString() : undefined}
          onValueChange={handleAccordionChange}
        >
          {reviews.map((review) => (
            <AccordionItem 
              key={review.id} 
              value={review.id.toString()}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <AccordionTrigger className="text-lg font-medium">
                <div className="text-left flex flex-col w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-800 mr-3">
                        {review.initial}
                      </span>
                      <span>{review.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {review.createdAt
                        ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
                        : "Recently added"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2 line-clamp-1">
                    {review.content}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <ReviewForm 
                  reviewData={review} 
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-white">
          <p className="text-gray-500">No reviews found. Create your first review using the form above.</p>
        </div>
      )}
    </div>
  );
}