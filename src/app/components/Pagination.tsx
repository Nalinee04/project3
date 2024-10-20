"use client"; // Make the component a Client Component

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"; // Ensure these components support styling

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationPage: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination className="flex items-center justify-center mt-4">
      <PaginationContent className="flex items-center space-x-2">
        {/* Previous Button */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-12 h-10 text-sm font-medium text-white bg-gray-800 border border-gray-800 rounded-md transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &#8592; {/* Left Arrow */}
          </button>
        </PaginationItem>

        {/* Current Page Indicator */}
        <PaginationItem>
          <PaginationLink className="flex items-center justify-center w-12 h-10 text-sm font-medium text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow transition duration-300 ease-in-out">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Next Button */}
        <PaginationItem>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-12 h-10 text-sm font-medium text-white bg-gray-800 border border-gray-800 rounded-md transition duration-300 ease-in-out transform hover:bg-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &#8594; {/* Right Arrow */}
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationPage;
