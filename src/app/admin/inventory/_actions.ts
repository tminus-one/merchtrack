'use server';

import { Category } from "@prisma/client";
import { verifyPermission } from "@/utils/permissions";
import prisma from "@/lib/db";
import { createNewCategorySchema } from "@/schema/category.schema";
import { processActionReturnData, slugify } from "@/utils";
import { CreateProductType } from "@/schema/products.schema";
import { ExtendedProduct } from "@/types/extended";
import { createLog } from "@/actions/logs.actions";

type CategoryParams = {
    userId: string;
    name: string;
    description?: string;
    id?: string;
};

export async function createCategory(params: CategoryParams): Promise<ActionsReturnType<Category>> {
  const result = createNewCategorySchema.safeParse(params);
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message
    };
  }

  const { name, description } = result.data;

  const hasPermission = await verifyPermission({
    userId: params.userId,
    permissions: {
      inventory: { canRead: true, canCreate: true },
    }
  });

  if (!hasPermission) {
    return { 
      success: false,
      message: 'Permission denied'
    };
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        description
      }
    });

    await createLog({
      userId: params.userId,
      createdById: params.userId,
      reason: "Category Created Successfully",
      systemText: `Created new category "${name}" (ID: ${category.id})`,
      userText: `Category "${name}" has been created successfully.`
    });
    
    return { 
      success: true, 
      data: processActionReturnData(category) as Category
    };
  } catch {
    return { success: false, message: 'An error occurred while creating the category' };
  }
}

export async function updateCategory(params: CategoryParams): Promise<ActionsReturnType<Category>> {
  if (!params.id) {
    return {
      success: false,
      message: "Category ID is required"
    };
  }

  const result = createNewCategorySchema.safeParse(params);
  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0].message
    };
  }

  const hasPermission = await verifyPermission({
    userId: params.userId,
    permissions: {
      inventory: { canRead: true, canUpdate: true },
    }
  });

  if (!hasPermission) {
    return { 
      success: false,
      message: 'Permission denied'
    };
  }

  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: params.name,
        description: params.description
      }
    });

    await createLog({
      userId: params.userId,
      createdById: params.userId,
      reason: "Category Updated Successfully",
      systemText: `Updated category "${params.name}" (ID: ${category.id})`,
      userText: `Category "${params.name}" has been updated successfully.`
    });

    return { 
      success: true, 
      data: processActionReturnData(category) as Category
    };
  } catch {
    return { success: false, message: 'An error occurred while updating the category' };
  }
}

export async function deleteCategory(params: { userId: string; id: string }): Promise<ActionsReturnType<Category>> {
  const hasPermission = await verifyPermission({
    userId: params.userId,
    permissions: {
      inventory: { canRead: true, canDelete: true },
    }
  });

  if (!hasPermission) {
    return { 
      success: false,
      message: 'Permission denied'
    };
  }

  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        isDeleted: true
      }
    });

    await createLog({
      userId: params.userId,
      createdById: params.userId,
      reason: "Category Deleted Successfully",
      systemText: `Deleted category (ID: ${category.id})`,
      userText: "Category has been deleted successfully."
    });

    return { 
      success: true, 
      data: processActionReturnData(category) as Category
    };
  } catch {
    return { success: false, message: 'An error occurred while deleting the category' };
  }
}

export async function createProduct(userId: string, data: CreateProductType): Promise<ActionsReturnType<ExtendedProduct>> {
  // ...existing permission checks...

  try {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        inventory: data.inventory,
        inventoryType: data.inventoryType,
        imageUrl: data.imageUrl,
        tags: data.tags,
        categoryId: data.categoryId,
        slug: slugify(data.title),
        postedById: userId,
        variants: {
          create: data.variants.map(variant => ({
            variantName: variant.variantName,
            price: variant.price,
            inventory: variant.inventory,
            rolePricing: variant.rolePricing
          }))
        }
      },
      include: {
        category: true,
        postedBy: true,
        variants: true,
        reviews: true
      }
    });

    return {
      success: true,
      data: processActionReturnData(product) as ExtendedProduct
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while creating the product"
    };
  }
}

export async function updateProduct(
  userId: string,
  productId: string,
  data: CreateProductType
): Promise<ActionsReturnType<ExtendedProduct>> {
  if (!await verifyPermission({
    userId,
    permissions: {
      inventory: { canRead: true, canUpdate: true }
    }
  })) {
    return {
      success: false,
      message: "Permission denied"
    };
  }

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        postedBy: true,
        variants: true,
        reviews: true
      }
    });
    const product = await prisma.$transaction(async (tx) => {
      // Update the main product first
      await tx.product.update({
        where: { id: productId },
        data: {
          title: data.title,
          description: data.description,
          inventory: data.inventory,
          inventoryType: data.inventoryType,
          imageUrl: data.imageUrl,
          tags: data.tags,
          categoryId: data.categoryId,
        },
      });

      // Update existing variants and create new ones if any
      for (const variant of data.variants) {
        if (variant.id) {
          // Update existing variant
          await tx.productVariant.update({
            where: { id: variant.id },
            data: {
              variantName: variant.variantName,
              price: variant.price,
              inventory: variant.inventory,
              rolePricing: variant.rolePricing
            }
          });
        } else {
          // Create new variant if it doesn't have an ID
          await tx.productVariant.create({
            data: {
              productId: productId,
              variantName: variant.variantName,
              price: variant.price,
              inventory: variant.inventory,
              rolePricing: variant.rolePricing
            }
          });
        }
      }

      // Return the updated product with all relations
      return await tx.product.findUnique({
        where: { id: productId },
        include: {
          category: true,
          postedBy: true,
          variants: true,
          reviews: true
        }
      });
    });

    if (!product) {
      throw new Error("Failed to update product");
    }

    
    await createLog({
      userId,
      createdById: userId,
      reason: "Product Updated Successfully",
      // @ts-expect-error - data is not defined in ExtendedProduct
      systemText: `Updated product "${product.title}" (ID: ${product.id}). Changes: ${Object.keys(data).filter(key => data[key] !== existingProduct[key]).join(', ')}`,
      userText: `Product "${product.title}" has been updated successfully.`
    });

    return {
      success: true,
      data: processActionReturnData(product) as ExtendedProduct
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while updating the product"
    };
  }
}

/**
 * Adjusts the inventory quantity of a product variant.
 * 
 * This function allows incrementing or decrementing the inventory count of a specific variant
 * and records the change as a log entry.
 * 
 * @param userId - The ID of the user making the adjustment
 * @param productId - The ID of the product that contains the variant
 * @param variantId - The ID of the variant to be adjusted
 * @param adjustment - The amount to adjust the inventory by (positive for increment, negative for decrement)
 * @param reason - Optional reason for the inventory adjustment
 */
export async function adjustVariantInventory(
  userId: string,
  productId: string,
  variantId: string,
  adjustment: number,
  reason?: string
): Promise<ActionsReturnType<{ newInventory: number }>> {
  if (!userId) {
    return {
      success: false,
      message: "User ID is required"
    };
  }

  if (!productId) {
    return {
      success: false,
      message: "Product ID is required"
    };
  }

  if (!variantId) {
    return {
      success: false,
      message: "Variant ID is required"
    };
  }

  if (!await verifyPermission({
    userId: userId,
    permissions: {
      inventory: { canRead: true, canUpdate: true },
    }
  })) {
    await createLog({
      userId,
      createdById: userId,
      reason: "Inventory Adjustment Failed - Unauthorized",
      systemText: `Unauthorized attempt to adjust inventory for product ${productId}, variant ${variantId}`,
      userText: "You are not authorized to adjust inventory."
    });
    return {
      success: false,
      message: "You are not authorized to adjust inventory."
    };
  }

  try {
    // First get the current variant to check if it exists and get current inventory
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true
      }
    });

    if (!variant) {
      await createLog({
        userId,
        createdById: userId,
        reason: "Inventory Adjustment Failed - Variant Not Found",
        systemText: `Attempted to adjust inventory for non-existent variant ${variantId}`,
        userText: "Variant not found"
      });
      return {
        success: false,
        message: "Variant not found"
      };
    }

    // Check if the variant belongs to the specified product
    if (variant.productId !== productId) {
      await createLog({
        userId,
        createdById: userId,
        reason: "Inventory Adjustment Failed - Variant Mismatch",
        systemText: `Attempted to adjust inventory for variant ${variantId} that doesn't belong to product ${productId}`,
        userText: "Variant doesn't belong to the specified product"
      });
      return {
        success: false,
        message: "Variant doesn't belong to the specified product"
      };
    }

    // Calculate new inventory value (prevent negative inventory)
    const newInventory = Math.max(0, variant.inventory + adjustment);

    // Update the variant with the new inventory
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { inventory: newInventory }
    });

    await createLog({
      userId,
      createdById: userId,
      reason: "Inventory Adjusted Successfully",
      systemText: `Adjusted inventory for variant ${variantId} (${variant.variantName}) of product ${productId} (${variant.product.title}) by ${adjustment}. New inventory: ${newInventory}. Reason: ${reason || 'Not provided'}`,
      userText: `Inventory for "${variant.variantName}" has been ${adjustment > 0 ? 'increased' : 'decreased'} by ${Math.abs(adjustment)}. New inventory: ${newInventory}.`
    });

    return {
      success: true,
      data: { newInventory }
    };
  } catch (error) {
    console.error("Error adjusting inventory:", error);
    await createLog({
      userId,
      createdById: userId,
      reason: "Inventory Adjustment Error",
      systemText: `Error adjusting inventory for variant ${variantId} of product ${productId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      userText: "An error occurred while adjusting the inventory."
    });
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to adjust inventory'
    };
  }
}