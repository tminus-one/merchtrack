'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  parentId?: string;
}

export default function ProductPagination({
  totalPages,
  currentPage,
  pageSize,
  totalItems,
  parentId = '#',
}: Readonly<ProductPaginationProps>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);

    // Scroll to the component with the id and center it on screen
    if (parentId) {
      // Use setTimeout to ensure the DOM has updated after the router navigation
      setTimeout(() => {
        const element = document.getElementById(parentId);
        if (element) {
          // Calculate position to center element in viewport
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.scrollY;
          const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
          
          // Perform the smooth scroll to the calculated position
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure route change has completed
    }
  };

  // Calculate the range of items being displayed
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-sm text-gray-500">
        Showing {startItem}-{endItem} of {totalItems} items
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous page</span>
        </Button>

        {/* Page numbers */}
        <div className="flex -space-x-px">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => {
              // Show first page, last page, and pages around current page
              const showDirectly = page === 1 || page === totalPages;
              const showAround = Math.abs(page - currentPage) <= 1;
              return showDirectly || showAround;
            })
            .map((page, index, array) => {
              // Add ellipsis between non-consecutive pages
              const showEllipsis = index > 0 && array[index - 1] !== page - 1;

              return (
                <div key={page} className="flex items-center">
                  {showEllipsis && (
                    <span className="px-3 py-2 text-sm text-gray-500">...</span>
                  )}
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    className="min-w-[40px] rounded-none first:rounded-l-md last:rounded-r-md"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                </div>
              );
            })}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Next page</span>
        </Button>
      </div>
    </div>
  );
}