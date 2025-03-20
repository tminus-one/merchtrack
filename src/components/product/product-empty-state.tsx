import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductEmptyStateProps {
  message?: string;
  showResetButton?: boolean;
  onReset?: () => void;
}

export default function ProductEmptyState({
  message = "No products found",
  showResetButton = true,
  onReset
}: Readonly<ProductEmptyStateProps>) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <div className="rounded-full bg-primary/10 p-6">
        <Package className="size-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{message}</h3>
      <p className="mt-2 text-sm text-gray-500">
        Try adjusting your search or filter criteria
      </p>
      <div className="mt-6 flex gap-4">
        {showResetButton && (
          <Button
            variant="outline"
            onClick={onReset}
          >
            Reset Filters
          </Button>
        )}
        <Button asChild>
          <Link href="/products">
            Browse All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}