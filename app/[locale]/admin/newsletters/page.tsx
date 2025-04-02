import React from "react";
import { getDB } from "@/db";
import { format } from "date-fns";
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
import { DownloadCSVButton } from "./components/download-csv-button";
import { DeleteButton } from "./components/delete-button";
import { sql } from "drizzle-orm";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter Subscribers",
  description: "Manage newsletter subscribers",
};

const NewslettersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 50; // Show 50 items per page
  const db = await getDB();

  // Get total count for pagination
  const countResult = await db.execute(
    sql`SELECT COUNT(*) as count FROM newsletter`
  );
  const totalCount = Number(countResult.rows[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  const newsletters = await db.query.newsletter.findMany({
    orderBy: (newsletter, { desc }) => [desc(newsletter.createdAt)],
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="admin-title">Newsletter Subscribers</h1>
        <DownloadCSVButton newsletters={newsletters} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Subscription Date</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {newsletters.map((newsletter) => (
              <TableRow key={newsletter.id}>
                <TableCell className="whitespace-nowrap font-medium">
                  {newsletter.id}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {newsletter.email}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {format(new Date(newsletter.createdAt), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <DeleteButton id={newsletter.id} email={newsletter.email} />
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

export default NewslettersPage;
