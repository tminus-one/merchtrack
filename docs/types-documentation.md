# MerchTrack Types Documentation

<div align="center">
  <h1>📝 TypeScript Types Library</h1>
  <p>Type definitions for the MerchTrack application</p>
</div>

## Overview

The `src/types` directory contains TypeScript type definitions used throughout the MerchTrack application. These types provide a foundation for type safety, code completion, and documentation, making the codebase more robust and maintainable.

## Core Type Categories

### 🔑 Entity Types

#### `users.ts`

Contains types related to users, authentication, and permissions.

```typescript
import { User, Role } from '@/types/users';

// In your component or server action
function ProfilePage({ user }: { user: User }) {
  const isAdmin = user.role === Role.ADMIN;
  
  // Use strongly typed user properties
  return (
    <div>
      <h1>{user.firstName} {user.lastName}</h1>
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

#### `products.ts`

Contains types for products, product variants, inventory, and related data.

```typescript
import { Product, ProductVariant, InventoryType } from '@/types/products';

// Creating a product
const newProduct: Product = {
  id: '',
  title: 'Premium Hoodie',
  description: 'A comfortable hoodie for all seasons',
  inventoryType: InventoryType.STOCK,
  // Other required properties...
};
```

#### `orders.ts`

Types for orders, order items, order status tracking, and fulfillment.

```typescript
import { Order, OrderStatus, OrderPaymentStatus } from '@/types/orders';

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  // Use the enum for type-safe comparisons
  const getStatusColor = () => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-800';
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return <span className={getStatusColor()}>{status}</span>;
}
```

#### `payments.ts`

Types for payment processing, statuses, and methods.

```typescript
import { Payment, PaymentMethod, PaymentStatus } from '@/types/payments';

// Payment data validation
function validatePayment(payment: Payment): boolean {
  // Type-safe validation with correct property names and types
  if (payment.amount <= 0) {
    throw new Error('Payment amount must be positive');
  }
  
  if (payment.paymentMethod === PaymentMethod.BANK_TRANSFER && !payment.referenceNo) {
    throw new Error('Reference number is required for bank transfers');
  }
  
  return true;
}
```

### 🔗 Extended Types

#### `extended.ts`

Extended types that combine base types with related data.

```typescript
import { ExtendedProduct, ExtendedOrder } from '@/types/extended';

// Type with joined relations
function ProductDetail({ product }: { product: ExtendedProduct }) {
  // Access directly related entities
  return (
    <div>
      <h1>{product.title}</h1>
      <p>Category: {product.category?.name}</p>
      <p>Posted by: {product.postedBy.firstName} {product.postedBy.lastName}</p>
      <div>
        {product.variants.map(variant => (
          <div key={variant.id}>
            {variant.variantName}: ${variant.price}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 🛠️ Utility Types

#### `common.ts`

Common utility types, interfaces, and query parameter types.

```typescript
import { PaginatedResponse, QueryParams, SortDirection } from '@/types/common';

// Define query parameters with strongly typed filters
const queryParams: QueryParams = {
  where: {
    categoryId: selectedCategory,
    price: { gte: minPrice, lte: maxPrice }
  },
  orderBy: {
    createdAt: SortDirection.DESC
  },
  take: 10,
  page: currentPage
};

// Typed response handling
function ProductList({ products }: { products: PaginatedResponse<Product> }) {
  const { data, metadata } = products;
  
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {data.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination 
        currentPage={metadata.page}
        totalPages={metadata.lastPage}
      />
    </div>
  );
}
```

#### `errors.ts`

Custom error types and error handling utilities.

```typescript
import { 
  ValidationError, AuthenticationError, 
  DatabaseError, NotFoundError 
} from '@/types/errors';

// Type-safe error handling
try {
  // Some operation
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation errors
    showFormErrors(error.issues);
  } else if (error instanceof AuthenticationError) {
    // Handle auth errors
    redirectToLogin();
  } else if (error instanceof DatabaseError) {
    // Handle database errors
    logDatabaseError(error);
  } else {
    // Handle unknown errors
    reportToErrorTracking(error);
  }
}
```

#### `logs.ts`

Types for system logging and audit trails.

```typescript
import { LogType, CreateLogParams, ExtendedLogs } from '@/types/logs';

// Create a typed log entry
async function logUserAction(userId: string, action: string) {
  const logParams: CreateLogParams = {
    type: LogType.USER_UPDATED,
    userId,
    description: `User performed action: ${action}`,
    metadata: { actionTime: new Date().toISOString() }
  };
  
  await createLog(logParams);
}
```

### 📏 Schema Types

#### `Misc.ts`

Types for miscellaneous entities, enums, and constants.

```typescript
import { Role, College } from '@/types/Misc';

// Using enums for fixed-value types
function getUserLabel(role: Role): string {
  switch (role) {
    case Role.STUDENT: return 'Student';
    case Role.STAFF_FACULTY: return 'Staff/Faculty';
    case Role.ALUMNI: return 'Alumni';
    default: return 'User';
  }
}

// College-specific display
function CollegeBadge({ college }: { college: College }) {
  const collegeColors: Record<College, string> = {
    [College.NOT_APPLICABLE]: 'bg-gray-100',
    [College.COCS]: 'bg-blue-100',
    [College.STEP]: 'bg-green-100',
    // Other colleges...
  };
  
  return (
    <span className={collegeColors[college]}>
      {college.replace('_', ' ')}
    </span>
  );
}
```

### 🧩 Global Types

#### `global.d.ts`

Global type declarations and augmentations.

```typescript
// These types are available globally without imports
// Example usage anywhere in the codebase:
function processApiResponse(data: ApiResponse<User>) {
  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.message);
  }
}
```

#### `index.d.ts`

Main type definitions entrypoint and module augmentations.

## Best Practices

### Type Definition Structure

Types are structured in a consistent pattern:

```typescript
// Base interface for entity
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Other properties...
}

// Enum for fixed-value types
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED'
}

// Type for creating new entities (omitting generated fields)
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

// Type for updating entities (making fields optional)
export type UpdateUserInput = Partial<CreateUserInput>;

// Extended type with relations
export interface UserWithProfile extends User {
  profile: UserProfile;
}
```

### Using with Zod Schemas

MerchTrack types are designed to work with Zod validation schemas:

```typescript
import { z } from 'zod';
import { Role, College } from '@/types/Misc';

// Define schema with Zod
export const userSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  role: z.nativeEnum(Role, { message: "Invalid role" }),
  college: z.nativeEnum(College, { message: "Invalid college" })
});

// Infer TypeScript type from Zod schema
export type UserFormData = z.infer<typeof userSchema>;

// Use with React Hook Form
const form = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    role: Role.STUDENT,
    college: College.NOT_APPLICABLE
  }
});
```

### Type-Safe API Responses

API responses follow a consistent pattern:

```typescript
import { ActionsReturnType } from '@/types/common';

// In your server action
export async function createUser(data: CreateUserInput): Promise<ActionsReturnType<User>> {
  try {
    const user = await prisma.user.create({ data });
    return {
      success: true,
      data: user,
      message: "User created successfully"
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create user"
    };
  }
}

// In your client component
const { mutate } = useMutation({
  mutationFn: createUser,
  onSuccess: (response) => {
    // TypeScript knows the shape of response
    if (response.success) {
      toast.success(response.message);
      // response.data is typed as User
      navigateToUserProfile(response.data.id);
    } else {
      toast.error(response.message);
    }
  }
});
```

## Integration with Prisma

Many types align with Prisma schema models:

```typescript
import { User } from '@prisma/client';
import { ExtendedUser } from '@/types/extended';

// Extending Prisma types
export async function getUserWithRoles(userId: string): Promise<ExtendedUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userPermissions: true }
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user as ExtendedUser;
}
```

## Working with Relational Types

For handling relationships effectively:

```typescript
import { ProductWithCategory, CategoryWithProducts } from '@/types/extended';

// Typed handling of relationships
function displayProductHierarchy(category: CategoryWithProducts) {
  return (
    <div>
      <h2>{category.name}</h2>
      <div className="grid grid-cols-3 gap-4">
        {category.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

With this types system, MerchTrack maintains type safety throughout the application, reducing runtime errors and making development more efficient through better IDE support and documentation.