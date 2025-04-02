import React from "react";
import { getDB } from "@/db";
import { format } from "date-fns";
import Link from "next/link";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { sql } from "drizzle-orm";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Inquiries",
  description: "Manage customer inquiries",
};

const InquiriesPage = async ({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const searchParamsData = await searchParams;
  const currentPage = Number(searchParamsData.page) || 1;
  const pageSize = 20; // Show 20 items per page
  const db = await getDB();

  // Get total count for pagination
  const countResult = await db.execute(
    sql`SELECT COUNT(*) as count FROM inquiries`
  );
  const totalCount = Number(countResult.rows[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  const inquiries = await db.query.inquiries.findMany({
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

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

  // Function to truncate message
  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="admin-title">Customer Inquiries</h1>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Name</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="whitespace-nowrap">Message</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TableCell className="whitespace-nowrap font-medium">
                  <Link
                    href={`/${locale}/admin/inquiries/${inquiry.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {inquiry.id}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/${locale}/admin/inquiries/${inquiry.id}`}>
                    {inquiry.name}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/${locale}/admin/inquiries/${inquiry.id}`}>
                    {inquiry.email}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/${locale}/admin/inquiries/${inquiry.id}`}>
                    {inquiry.type}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link href={`/${locale}/admin/inquiries/${inquiry.id}`}>
                    {truncateMessage(inquiry.message)}
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/${locale}/admin/inquiries/${inquiry.id}`}>
                    <Badge
                      className={getStatusColor(inquiry.status || "Pending")}
                    >
                      {inquiry.status || "Pending"}
                    </Badge>
                  </Link>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Link href={`/${locale}/admin/inquiries/${inquiry.id}`}>
                    {inquiry.createdAt
                      ? format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm")
                      : "N/A"}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`?page=${currentPage - 1}`} />
              </PaginationItem>
            )}

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href={`?page=${pageNum}`}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext href={`?page=${currentPage + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default InquiriesPage;
