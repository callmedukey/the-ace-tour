"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format } from "date-fns";

interface DownloadCSVButtonProps {
  newsletters: {
    id: number;
    email: string;
    createdAt: Date;
  }[];
}

export function DownloadCSVButton({ newsletters }: DownloadCSVButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCSV = () => {
    setIsGenerating(true);
    
    try {
      // Define CSV headers
      const headers = ["ID", "Email", "Subscription Date"];
      
      // Convert newsletter data to CSV rows
      const rows = newsletters.map((newsletter) => [
        newsletter.id.toString(),
        newsletter.email,
        format(new Date(newsletter.createdAt), "yyyy-MM-dd HH:mm:ss"),
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      
      // Create a download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      // Set link properties
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`
      );
      
      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating CSV:", error);
      alert("Failed to generate CSV file");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={generateCSV} 
      disabled={isGenerating || newsletters.length === 0}
      variant="outline"
      size="sm"
    >
      {isGenerating ? "Generating..." : "Download CSV"}
    </Button>
  );
}