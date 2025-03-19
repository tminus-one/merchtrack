import { z } from "zod";

export const paymentReminderSchema = z.object({
  orderIds: z.array(z.string()),
  dueDate: z.coerce.date().min(new Date(), { message: "Due date must be in the future" }),
});

export type PaymentReminderFormData = z.infer<typeof paymentReminderSchema>;