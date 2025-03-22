"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

const MessagesPagination = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = Number(searchParams.get("messagesPageNumber")) || 0;

  const handlePageChange = (increment: number) => {
    const newPage = Math.max(0, currentPage + increment); // Ensure page doesn't go below 0
    const params = new URLSearchParams(searchParams);
    params.set("messagesPageNumber", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <button
        className={`border rounded-md p-1  ${
          currentPage === 0
            ? "text-gray-200 border-gray-100 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        }`} // Adjust styles based on disabled state
        onClick={() => handlePageChange(-5)} // Go to previous page
        disabled={currentPage === 0} // Disable if on the first page
      >
        <ChevronLeft size={20} className="rtl:rotate-180 ltr:rotate-0" />
      </button>
      <button
        className="border rounded-md p-1 hover:bg-gray-100 cursor-pointer"
        onClick={() => handlePageChange(5)} // Go to next page
      >
        <ChevronRight size={20} className="rtl:rotate-180 ltr:rotate-0" />
      </button>
    </div>
  );
};

export default MessagesPagination;
