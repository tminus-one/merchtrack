import { FC, useState } from "react";
import Image from "next/image";
import { BiTrash } from "react-icons/bi";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { removeOrderItem } from "./_actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { ExtendedOrderItem } from "@/types/orders";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface OrderItemsTableProps {
  items?: ExtendedOrderItem[];
  orderId: string;
  userId: string;
  onRemoveItem?: () => void;
  orderStatus: string;
}

export const OrderItemsTable: FC<OrderItemsTableProps> = ({ 
  items = [], 
  orderId,
  userId,
  onRemoveItem,
  orderStatus
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [removalReason, setRemovalReason] = useState("");

  const { mutate: removeItem, isPending: isRemoving } = useMutation({
    mutationFn: async (itemId: string) => {
      if (!removalReason.trim()) {
        throw new Error("Reason is required");
      }
      
      const result = await removeOrderItem(orderId, itemId, removalReason, userId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Item removed successfully");
      setSelectedItemId(null);
      setRemovalReason("");
      onRemoveItem?.();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove item");
    }
  });

  if (!items?.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">No items found</p>
      </div>
    );
  }

  // Hide remove button if there's only one item in the order
  const showRemoveButton = items.length > 1 && orderStatus !== 'CANCELLED' && orderStatus !== 'DELIVERED';

  const renderRemoveButton = (itemId: string) => {
    if (!showRemoveButton) return null;

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedItemId(itemId)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <BiTrash className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove the item from the order and restore its inventory. Please provide a reason:
            </AlertDialogDescription>
            <Textarea
              value={removalReason}
              onChange={(e) => setRemovalReason(e.target.value)}
              placeholder="Enter reason for removal..."
              className="mt-2"
              required
            />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setSelectedItemId(null);
              setRemovalReason("");
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (removalReason.trim() && selectedItemId) {
                  removeItem(selectedItemId);
                } else {
                  toast.error("Please provide a reason for removal");
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={!removalReason.trim() || isRemoving}
            >
              {isRemoving ? "Removing..." : "Remove Item"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="relative size-16 overflow-hidden rounded-lg border bg-white shadow-sm">
                  <Image
                    src={item.variant.product.imageUrl?.[0] ?? '/img/profile-placeholder-img.png'}
                    alt={item.variant.product.title ?? 'Product image'}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="line-clamp-1 font-medium">{item.variant.product.title ?? 'Unknown Product'}</p>
                  <p className="text-muted-foreground line-clamp-1 text-sm">{item.variant.variantName ?? 'Unknown Variant'}</p>
                </div>
              </TableCell>
              <TableCell>
                {item.customerNote ? (
                  <Badge variant="outline" className="w-10 justify-center">
                    {item.customerNote}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="w-12 justify-center">
                  ×{item.quantity}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(Number(item.price) || 0)}
              </TableCell>
              <TableCell className="font-medium tabular-nums">
                {formatCurrency((Number(item.price) || 0) * (item.quantity || 1))}
              </TableCell>
              <TableCell>
                {renderRemoveButton(item.id)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};