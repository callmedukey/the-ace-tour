import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { getDB } from "@/db";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DownloadCSVButton } from "./components/download-csv-button";
import { StatusDropdown } from "./components/status-dropdown";
import { sql } from "drizzle-orm";
import { BookingStatus } from "@/actions/booking-status";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shuttle Bookings",
  description: "Shuttle Bookings",
};

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const pageSize = 1000; // Show 1000 items per page
  const db = await getDB();

  // Get total count for pagination
  const countResult = await db.execute(
    sql`SELECT COUNT(*) as count FROM booking`
  );
  const totalCount = Number(countResult.rows[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  const bookings = await db.query.booking.findMany({
    orderBy: (booking, { desc }) => [desc(booking.createdAt)],
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="admin-title">Shuttle Bookings</h1>
        <DownloadCSVButton bookings={bookings} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">ID</TableHead>
              <TableHead className="whitespace-nowrap">Stripe ID</TableHead>
              <TableHead className="whitespace-nowrap">
                Customer Email
              </TableHead>
              <TableHead className="whitespace-nowrap">Customer Name</TableHead>
              <TableHead className="whitespace-nowrap">Trip Type</TableHead>
              <TableHead className="whitespace-nowrap">From</TableHead>
              <TableHead className="whitespace-nowrap">To</TableHead>
              <TableHead className="whitespace-nowrap">
                Departing Date
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Returning Date
              </TableHead>
              <TableHead className="whitespace-nowrap">
                Departure Time
              </TableHead>
              <TableHead className="whitespace-nowrap">Return Time</TableHead>
              <TableHead className="whitespace-nowrap">Passengers</TableHead>
              <TableHead className="whitespace-nowrap">Address</TableHead>
              <TableHead className="whitespace-nowrap">Price</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">
                Payment Status
              </TableHead>
              <TableHead className="whitespace-nowrap">Payment ID</TableHead>
              <TableHead className="whitespace-nowrap">
                Payment Method
              </TableHead>
              <TableHead className="whitespace-nowrap">Paid At</TableHead>

              <TableHead className="whitespace-nowrap">Luggage</TableHead>
              <TableHead className="whitespace-nowrap">Created At</TableHead>
              <TableHead className="whitespace-nowrap">Updated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="whitespace-nowrap font-medium">
                  {booking.id}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.stripeId}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.customerEmail}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.customerName}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.tripType}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.from}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.to}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.departingDate
                    ? format(new Date(booking.departingDate), "yyyy-MM-dd")
                    : "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.returningDate
                    ? format(new Date(booking.returningDate), "yyyy-MM-dd")
                    : "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.departureTime}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.returnTime || "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.passengers}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.address}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  ${booking.price}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <StatusDropdown
                    bookingId={booking.id}
                    currentStatus={booking.status as BookingStatus}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.paymentStatus}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.paymentId}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.paymentMethod}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.paidAt
                    ? format(new Date(booking.paidAt), "yyyy-MM-dd")
                    : "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.luggage || "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.createdAt
                    ? format(new Date(booking.createdAt), "yyyy-MM-dd HH:mm:ss")
                    : "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {booking.updatedAt
                    ? format(new Date(booking.updatedAt), "yyyy-MM-dd HH:mm:ss")
                    : "-"}
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

export default page;
