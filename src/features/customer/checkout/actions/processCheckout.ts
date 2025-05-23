"use server";

import { revalidatePath } from "next/cache";
import { Order, OrderPaymentStatus, OrderStatus, Prisma } from "@prisma/client";
import { createLog } from "../../../../actions/logs.actions";
import prisma from "@/lib/db";
import { validateCartItems } from "@/lib/cart";
import { processActionReturnData } from "@/utils";
import { sendOrderConfirmationEmail } from "@/lib/email-service";
import { calculateRoleBasedPrice, RolePricing } from "@/utils/pricing";
import serverSideEffect from "@/utils/serverSideEffect";
import { CheckoutInput, checkoutSchema } from "@/features/customer/checkout/checkout.schema";



export async function processCheckout(
  input: CheckoutInput
): Promise<ActionsReturnType<Order>> {
  try {
    // Validate input
    const validatedInput = checkoutSchema.parse(input);

    // Get user details for role-based pricing
    const user = await prisma.user.findUnique({
      where: { id: validatedInput.userId },
      select: {
        role: true,
        college: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Get variants with product and seller info for pricing
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: validatedInput.items.map((item) => item.variantId) },
      },
      include: {
        product: {
          select: {
            title: true,
            imageUrl: true,
            inventoryType: true,
            postedBy: {
              select: {
                college: true,
              },
            },
          },
        },
      },
    });

    // Calculate correct prices based on role and college
    const itemsWithPricing = validatedInput.items.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) throw new Error(`Variant ${item.variantId} not found`);

      const { price, appliedRole } = calculateRoleBasedPrice({
        basePrice: Number(variant.price),
        rolePricing: variant.rolePricing as RolePricing,
        customerInfo: {
          role: user.role,
          college: user.college,
        },
        productCollege: variant.product.postedBy.college,
      });

      return {
        ...item,
        variant,
        price, // Use calculated price
        appliedRole,
      };
    });

    // Calculate total with role-based pricing
    const totalAmount = itemsWithPricing.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const cartItems = itemsWithPricing.map((item) => ({
      variantId: item.variantId,
      selected: true,
      variant: {
        ...item.variant,
        product: {
          ...item.variant.product,
          inventoryType: item.variant.product.inventoryType,
          postedBy: item.variant.product.postedBy,
        },
        rolePricing:
          typeof item.variant.rolePricing === "object"
            ? {
              price: item.price,

              roleId:
                  (item.variant.rolePricing as {roleId: string})?.roleId ||
                  item.appliedRole ||
                  "default",
            }
            : null,
      },
      quantity: item.quantity,
      note: item.note,
    }));

    // @ts-expect-error - cartItems is not a CartItem type
    const validation = validateCartItems(cartItems);
    if (!validation.valid) {
      return {
        success: false,
        message: validation.error!,
      };
    }

    // Create order and payment in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          customerId: validatedInput.userId,
          totalAmount,
          status: OrderStatus.PENDING,
          paymentStatus: OrderPaymentStatus.PENDING,
          estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          customerNotes: validatedInput.customerNotes,
          orderItems: {
            create: itemsWithPricing.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price: new Prisma.Decimal(item.price),
              originalPrice: new Prisma.Decimal(item.variant.price),
              appliedRole: item.appliedRole,
              customerNote: item.note,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      title: true,
                      imageUrl: true,
                      inventoryType: true,
                    },
                  },
                },
              },
            },
          },
          customer: true,
          processedBy: true,
          payments: true,
        },
      });

      // Update inventory only for STOCK items
      await Promise.all(
        itemsWithPricing.map(async (item) => {
          if (item.variant.product.inventoryType === "STOCK") {
            return tx.productVariant.update({
              where: { id: item.variantId },
              data: {
                inventory: {
                  decrement: item.quantity,
                },
              },
            });
          }
          return Promise.resolve();
        })
      );

      serverSideEffect(() =>
        sendOrderConfirmationEmail({
          // @ts-expect-error - no need for other fields
          order,
          customerName: `${user.firstName} ${user.lastName}`,
          customerEmail: user.email,
        })
      );

      return order;
    });

    // Create log entry
    await createLog({
      userId: validatedInput.userId,
      createdById: validatedInput.userId,
      reason: "Order Created",
      systemText: `Order ${result.id} created by ${user.firstName}`,
      userText: "Order created successfully",
    });

    revalidatePath("/my-account/orders");
    revalidatePath("/checkout");

    return {
      success: true,
      data: processActionReturnData(result) as Order,
    };
  } catch (error) {
    console.error("Checkout error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to process checkout",
    };
  }
}
