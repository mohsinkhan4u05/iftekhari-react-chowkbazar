import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];

    // Always show first 1–2 pages
    pages.push(1);
    if (totalPages > 1) pages.push(2);

    // Add ellipsis if currentPage > 4
    if (currentPage > 4) pages.push("...");

    // Show 2 pages before and after currentPage
    for (
      let i = Math.max(3, currentPage - 1);
      i <= Math.min(totalPages - 2, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) pages.push(i);
    }

    // Add ellipsis if currentPage < totalPages - 3
    if (currentPage < totalPages - 3) pages.push("...");

    // Always show last 2 pages
    if (totalPages > 3) pages.push(totalPages - 1);
    if (totalPages > 2) pages.push(totalPages);

    // Filter and return unique sorted pages

    const uniqueSortedPages = Array.from(new Set<number | string>(pages)).sort(
      (a, b) => {
        if (typeof a === "number" && typeof b === "number") return a - b;
        return 0;
      }
    );

    return uniqueSortedPages;

    // return [...new Set(pages)].sort((a: any, b: any) =>
    //   typeof a === "number" && typeof b === "number" ? a - b : 0
    // );
  };

  const pagesToRender = getPages();

  return (
    <div className="flex items-center justify-center mt-8 space-x-2">
      {pagesToRender.map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 border rounded ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {page}
          </button>
        )
      )}
    </div>
  );
};

export default Pagination;
