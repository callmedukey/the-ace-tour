import { getDB } from "@/db";
import React from "react";
import { ReviewForm } from "./components/review-form";
import { ReviewList } from "./components/review-list";

export const dynamic = "force-dynamic";
const ReviewsSettingPage = async () => {
  const db = await getDB();
  const reviews = await db.query.reviews.findMany({
    orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Reviews Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage customer reviews that appear on your website. Add, edit, or
        remove reviews as needed.
      </p>

      <div className="border rounded-lg p-6 mb-12 bg-white shadow-sm">
        <h2 className="text-2xl font-bold mb-6">Add New Review</h2>
        <ReviewForm isNew={true} />
      </div>

      <ReviewList reviews={reviews} />
    </div>
  );
};

export default ReviewsSettingPage;
