import React from "react";
import { getDB } from "@/db";
import { MiceForm } from "./components/mice-form";
import { PostForm } from "./components/post-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const dynamic = "force-dynamic";

const MiceSettingPage = async () => {
  const db = await getDB();

  // Get the first MICE entry or create a default object if none exists
  const miceEntry = await db.query.mice.findFirst({
    with: {
      posts: true,
    },
  });

  const hasMiceEntry = !!miceEntry;
  const posts = miceEntry?.posts || [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">MICE Solutions Settings</h1>
      <p className="text-gray-600 mb-8">
        Manage your MICE solutions information and posts. Changes will be
        reflected on the MICE solutions page.
      </p>

      <div className="border rounded-lg p-6 mb-8 bg-white shadow-sm">
        <h2 className="text-2xl font-bold mb-6">
          {hasMiceEntry ? "MICE Solution Settings" : "Create MICE Solution"}
        </h2>
        <MiceForm miceData={miceEntry} isNew={!hasMiceEntry} />
      </div>

      {hasMiceEntry && (
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Posts Management</h2>
          <p className="text-gray-600 mb-6">
            Add and manage posts for your MICE solution. Each post will appear
            on the MICE solutions page.
          </p>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Add New Post</h3>
            <PostForm miceId={miceEntry.id} isNew={true} />
          </div>

          <h3 className="text-xl font-semibold mb-4">
            Existing Posts ({posts.length})
          </h3>

          {posts.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {posts.map((post) => (
                <AccordionItem key={post.id} value={post.id}>
                  <AccordionTrigger className="text-lg font-medium">
                    {post.ENGtitle} / {post.KOtitle}
                  </AccordionTrigger>
                  <AccordionContent>
                    <PostForm miceId={miceEntry.id} post={post} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-gray-500 border rounded-lg">
              No posts yet. Use the form above to create your first post.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiceSettingPage;
