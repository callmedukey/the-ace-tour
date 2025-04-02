import { getDB } from "@/db";
import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import { ActionButtons } from "./components/action-buttons";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ inquiry: string }>;
}): Promise<Metadata> {
  const { inquiry } = await params;
  return {
    title: `Inquiry #${inquiry}`,
    description: "View inquiry details",
  };
}

const InquiryPage = async ({
  params,
}: {
  params: Promise<{ inquiry: string; locale: string }>;
}) => {
  const { inquiry, locale } = await params;
  const db = await getDB();
  const inquiryData = await db.query.inquiries.findFirst({
    where: (inquiries, { eq }) => eq(inquiries.id, Number(inquiry)),
  });

  if (!inquiryData) {
    notFound();
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href={`/${locale}/admin/inquiries`}
            className="text-blue-600 hover:underline mb-2 inline-block"
          >
            ← Back to Inquiries
          </Link>
          <h1 className="text-2xl font-bold">
            Inquiry #{inquiryData.id} - {inquiryData.name}
          </h1>
        </div>
        <Badge className={getStatusColor(inquiryData.status || "Pending")}>
          {inquiryData.status || "Pending"}
        </Badge>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Name</h2>
            <p className="mt-1 text-lg">{inquiryData.name}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Email</h2>
            <p className="mt-1 text-lg">
              <a
                href={`mailto:${inquiryData.email}`}
                className="text-blue-600 hover:underline"
              >
                {inquiryData.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Type</h2>
            <p className="mt-1 text-lg">{inquiryData.type}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500">Date</h2>
            <p className="mt-1 text-lg">
              {inquiryData.createdAt
                ? format(new Date(inquiryData.createdAt), "PPP 'at' p")
                : "N/A"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-2">Message</h2>
          <div className="mt-1 p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
            {inquiryData.message}
          </div>
        </div>
      </div>

      <ActionButtons
        inquiryId={inquiryData.id}
        currentStatus={inquiryData.status || "Pending"}
        locale={locale}
      />
    </div>
  );
};

export default InquiryPage;
