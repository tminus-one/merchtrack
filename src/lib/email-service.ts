import { render } from "@react-email/components";
import { OrderStatus, OrderPaymentStatus } from "@prisma/client";
import { sendEmail } from "./mailgun";
import { OrderConfirmationEmail } from "@/templates/OrderConfirmationEmail";
import { OrderStatusEmail } from "@/templates/OrderStatusEmail";
import { PaymentStatusEmail } from "@/templates/PaymentStatusEmail";
import { PaymentReminderEmail } from "@/templates/PaymentReminderEmail";
import { ExtendedOrder } from "@/types/orders";

interface OrderConfirmationEmailParams {
  order: ExtendedOrder;
  customerName: string;
  customerEmail: string;
}

interface OrderStatusEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  newStatus: OrderStatus;
  surveyLink?: string;
  order: ExtendedOrder;
  reason?: string;
}

interface PaymentStatusEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'verified' | 'refunded' | 'declined' | 'submitted';
  refundReason?: string;
  refundDetails?: {
    remainingBalance?: number;
    refundMethod?: string;
    estimatedProcessingTime?: string;
  };
}

interface PaymentReminderEmailParams {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentStatus: OrderPaymentStatus;
  dueDate?: Date;
}

export const sendOrderConfirmationEmail = async (params: OrderConfirmationEmailParams) => {
  await sendEmail({
    to: params.customerEmail,
    subject: `Order Confirmation - #${params.order.id}`,
    html: await render(OrderConfirmationEmail({ 
      order: params.order,
      customerName: params.customerName
    })),
    from: 'MerchTrack Orders'
  });
};
export const sendOrderStatusEmail = async (params: OrderStatusEmailParams) => {
  await sendEmail({
    to: params.customerEmail,
    subject: `Order Update - ${params.newStatus} #${params.orderNumber}`,
    html: await render(OrderStatusEmail({ 
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      newStatus: params.newStatus,
      surveyLink: params.surveyLink ?? '',
      order: params.order,
      reason: params.reason
    })),
    from: 'MerchTrack Orders'
  });
};

export const sendPaymentStatusEmail = async (params: PaymentStatusEmailParams) => {
  const getSubject = () => {
    switch (params.status) {
    case 'verified':
      return `Payment Verified - #${params.orderNumber}`;
    case 'refunded':
      return `Payment Refunded - #${params.orderNumber}`;
    case 'declined':
      return `Payment Declined - #${params.orderNumber}`;
    case 'submitted':
      return `Payment Submitted - #${params.orderNumber}`;
    default:
      return '';
    }
  };
  await sendEmail({
    to: params.customerEmail,
    subject: getSubject(),
    html: await render(PaymentStatusEmail({ 
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      amount: params.amount,
      status: params.status,
      refundReason: params.refundReason,
      refundDetails: params.refundDetails
    })),
    from: 'MerchTrack Payments'
  });
};

export const sendPaymentReminderEmail = async (params: PaymentReminderEmailParams) => {
  await sendEmail({
    to: params.customerEmail,
    subject: `Payment Reminder - Order #${params.orderNumber}`,
    html: await render(PaymentReminderEmail({ 
      orderNumber: params.orderNumber,
      customerName: params.customerName,
      amount: params.amount,
      paymentStatus: params.paymentStatus,
      dueDate: params.dueDate
    })),
    from: 'MerchTrack Payments'
  });
};

