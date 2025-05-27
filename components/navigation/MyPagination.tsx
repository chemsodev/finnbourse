"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

interface MyPaginationProps {
  preserveParams?: string[]; // Parameters to preserve when changing pages
}

const MyPagination = ({ preserveParams = [] }: MyPaginationProps = {}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 0;

  const handlePageChange = (increment: number) => {
    const newPage = Math.max(0, currentPage + increment); // Ensure page doesn't go below 0
    const params = new URLSearchParams(searchParams);

    // Only keep parameters we want to preserve, plus set the new page
    const newParams = new URLSearchParams();

    // Add the parameters we want to preserve
    preserveParams.forEach((param) => {
      const value = params.get(param);
      if (value) {
        newParams.set(param, value);
      }
    });

    // Always set the page parameter
    newParams.set("page", newPage.toString());

    // Add the search query if it exists
    const searchQuery = params.get("searchquery");
    if (searchQuery) {
      newParams.set("searchquery", searchQuery);
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="flex gap-4 justify-center items-center">
      <button
        className={`border rounded-md p-1  ${
          currentPage === 0
            ? "text-gray-200 border-gray-100 cursor-not-allowed"
            : "hover:bg-gray-100 cursor-pointer"
        }`} // Adjust styles based on disabled state
        onClick={() => handlePageChange(-6)} // Go to previous page
        disabled={currentPage === 0} // Disable if on the first page
      >
        <ChevronLeft size={20} className="rtl:rotate-180 ltr:rotate-0" />
      </button>
      <div className="">{currentPage === 0 ? "1" : currentPage / 6 + 1}</div>

      <button
        className="border rounded-md p-1 hover:bg-gray-100 cursor-pointer"
        onClick={() => handlePageChange(6)} // Go to next page
      >
        <ChevronRight size={20} className="rtl:rotate-180 ltr:rotate-0" />
      </button>
    </div>
  );
};

export default MyPagination;
