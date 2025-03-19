import { FC, useState } from "react";
import { BiCheck, BiX, BiRefresh } from "react-icons/bi";
import { Payment } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { refundPayment } from "./_actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatCurrency, formatDate } from "@/utils/format";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PaymentsTableProps {
  payments: Payment[];
  orderId: string;
  userId: string;
  onRefund?: () => void;
}

export const PaymentsTable: FC<PaymentsTableProps> = ({ payments, orderId, userId, onRefund }) => {
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  
  const { mutate: processRefund, isPending: isRefunding } = useMutation({
    mutationFn: async ({ amount, reason, paymentId }: { amount: number; reason: string; paymentId?: string }) => {
      const result = await refundPayment(orderId, amount, reason, userId, paymentId);
      if (!result.success) {
        throw new Error(result.message);
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("Payment refunded successfully");
      onRefund?.();
      setRefundAmount("");
      setRefundReason("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to refund payment");
    }
  });

  const renderRefundButton = () => {
    const totalPaidAmount = payments
      .filter(p => p.paymentStatus === 'VERIFIED')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    if (totalPaidAmount <= 0) return null;
    
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            disabled={isRefunding}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <BiRefresh className="mr-2 size-4" />
            {isRefunding ? "Processing..." : "Issue Refund"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-neutral-2">
          <AlertDialogHeader>
            <AlertDialogTitle>Issue Refund</AlertDialogTitle>
            <AlertDialogDescription>
              Total paid amount: {formatCurrency(totalPaidAmount)}
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="refund-amount" className="text-sm font-medium">Refund Amount</label>
                  <Input
                    id="refund-amount"
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Enter refund amount"
                    className="mt-1"
                    max={totalPaidAmount}
                    min={0}
                  />
                </div>
                <div>
                  <label htmlFor="refund-reason" className="text-sm font-medium">Reason for Refund</label>
                  <Textarea
                    id="refund-reason"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Enter reason for refund..."
                    className="mt-1"
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setRefundAmount("");
              setRefundReason("");
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const amount = parseFloat(refundAmount);
                if (amount > 0 && amount <= totalPaidAmount && refundReason.trim()) {
                  processRefund({ amount, reason: refundReason });
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={!refundAmount || !refundReason.trim() || parseFloat(refundAmount) <= 0 || parseFloat(refundAmount) > totalPaidAmount}
            >
              Process Refund
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  if (!payments?.length) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">No payment records found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <div className="mb-4 flex justify-end p-4">
        {renderRefundButton()}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.toReversed().map((payment) => (
            <TableRow key={payment.id} className="hover:bg-muted/50">
              <TableCell>{formatDate(payment.createdAt)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {payment.paymentMethod.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(Number(payment.amount) || 0)}
              </TableCell>
              <TableCell>
                <div className={cn(
                  "flex w-fit items-center gap-1.5 rounded-full px-2 py-1",
                  payment.paymentStatus === 'VERIFIED' && "bg-green-50 text-green-700",
                  payment.paymentStatus === 'PENDING' && "bg-yellow-50 text-yellow-700",
                  payment.paymentStatus === 'DECLINED' && "bg-red-50 text-red-700",
                  payment.paymentStatus === 'PROCESSING' && "bg-blue-50 text-blue-700",
                  payment.paymentStatus === 'REFUNDED' && "bg-purple-50 text-purple-700"
                )}>
                  {payment.paymentStatus === 'VERIFIED' && <BiCheck className="size-4" />}
                  {payment.paymentStatus === 'DECLINED' && <BiX className="size-4" />}
                  {payment.paymentStatus === 'REFUNDED' && <BiRefresh className="size-4" />}
                  <span className="text-xs font-medium">{payment.paymentStatus}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {payment.referenceNo || '—'}
              </TableCell>
              <TableCell className="text-right">
                {payment.paymentStatus === 'VERIFIED' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={isRefunding}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <BiRefresh className="mr-2 size-4" />
                        {isRefunding ? "Processing..." : "Refund"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-neutral-2">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Payment Refund</AlertDialogTitle>
                        <AlertDialogDescription>
                          {(() => {
                            const remainingPaymentsCount = payments.filter(p => p.paymentStatus === 'VERIFIED' && p.id !== payment.id).length;
                            return `This action will mark the payment as refunded and change the order status to ${remainingPaymentsCount > 0 ? 'downpayment' : 'pending'}.`;
                          })()}
                          Make sure you have processed the refund in your payment system first.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => processRefund({
                            amount: Number(payment.amount),
                            reason: refundReason,
                            paymentId: payment.id
                          })}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Confirm Refund
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};