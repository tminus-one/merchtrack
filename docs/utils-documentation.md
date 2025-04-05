# MerchTrack Utils Documentation

<div align="center">
  <h1>🛠️ Utility Functions</h1>
  <p>Helper functions and utility methods for MerchTrack application</p>
</div>

## Overview

The `src/utils` directory contains utility functions and helper methods that are used throughout the MerchTrack application. These utilities handle common operations like formatting, data processing, permissions, and more to provide consistent functionality across the application.

## Utility Categories

### 💱 Formatting Utilities

#### `formatCurrency.ts`

Utilities for formatting monetary values with proper currency symbols and localization.

```typescript
import { formatCurrency } from '@/utils/formatCurrency';

// In your component
function PriceDisplay({ amount, currency = 'PHP' }) {
  return <div>Price: {formatCurrency(amount, currency)}</div>;
}

// Output: Price: ₱1,299.00
```

#### `formatTime.ts`

Date and time formatting utilities with various format options.

```typescript
import { formatDate, formatDateTime, timeAgo } from '@/utils/formatTime';

// Basic date formatting
const formattedDate = formatDate(new Date()); // April 2, 2025

// Date with time
const formattedDateTime = formatDateTime(new Date()); // April 2, 2025, 14:30

// Relative time
const relative = timeAgo(new Date(Date.now() - 3600000)); // 1 hour ago
```

#### `format.ts`

General formatting utilities for strings, numbers, and other data types.

```typescript
import { formatPhoneNumber, truncateText, capitalize } from '@/utils/format';

// Format a phone number
formatPhoneNumber('09123456789'); // (0912) 345-6789

// Truncate long text
truncateText('This is a very long text that needs truncation', 20); // This is a very long...

// Capitalize text
capitalize('hello world'); // Hello world
```

### 🔄 Data Transformation

#### `convertDecimalToNumbers.ts`

Utilities for safely converting Decimal types (from Prisma) to JavaScript numbers.

```typescript
import { convertDecimalToNumber } from '@/utils/convertDecimalToNumbers';

// Convert Prisma Decimal to number
const price = convertDecimalToNumber(product.price); // 99.99
```

#### `fetchImageUrl.ts`

Utilities for resolving image URLs with fallbacks and transformations.

```typescript
import { getImageUrl } from '@/utils/fetchImageUrl';

// Get an image with fallback
const imageUrl = getImageUrl(product.imageUrl[0], '/placeholder.jpg');

// With transformation options
const thumbnailUrl = getImageUrl(product.imageUrl[0], '/placeholder.jpg', {
  width: 100,
  height: 100,
  format: 'webp'
});
```

#### `slug.utils.ts`

Utilities for generating and validating URL slugs.

```typescript
import { generateSlug, generateUniqueSlug } from '@/utils/slug.utils';

// Generate a basic slug
const slug = generateSlug('Premium T-Shirt Blue XXL'); // premium-t-shirt-blue-xxl

// Generate a unique slug with collision handling
const uniqueSlug = await generateUniqueSlug(
  'Premium T-Shirt',
  async (slug) => {
    // Check if slug exists in database
    const existing = await prisma.product.findUnique({ where: { slug } });
    return !!existing;
  }
); // premium-t-shirt-2 (if premium-t-shirt already exists)
```

### 🔒 Authorization and Security

#### `permissions.ts`

Utilities for checking user permissions and access control.

```typescript
import { verifyPermission, hasAccess } from '@/utils/permissions';

// Check user permission in server action
const canEditProduct = await verifyPermission({
  userId,
  permissions: { inventory: { canUpdate: true } }
});

if (!canEditProduct) {
  return {
    success: false,
    message: "You don't have permission to edit products"
  };
}

// Check permission in client component
function EditButton({ resource }) {
  const { permissions } = useUserStore();
  const canEdit = hasAccess(permissions, resource, 'update');

  return canEdit ? (
    <button>Edit</button>
  ) : null;
}
```

#### `roles.ts`

Role-based access control utilities.

```typescript
import { getRolePermissions, isAuthorizedRole } from '@/utils/roles';

// Get default permissions for a role
const studentPermissions = getRolePermissions(Role.STUDENT);

// Check if role is authorized for an action
const canManageUsers = isAuthorizedRole(userRole, 'manageUsers');
```

### 💲 Business Logic

#### `pricing.ts`

Utilities for calculating prices, discounts, and role-based pricing.

```typescript
import { 
  calculateRoleBasedPrice, 
  calculateDiscount 
} from '@/utils/pricing';

// Calculate price based on user role
const price = calculateRoleBasedPrice({
  basePrice: 1000,
  rolePricing: {
    STUDENT: 800,
    STAFF_FACULTY: 900
  },
  role: 'STUDENT'
}); // 800

// Calculate discount
const finalPrice = calculateDiscount({
  originalPrice: 1000,
  discountPercentage: 20
}); // 800
```

### 🔍 Query Utilities

#### `query.utils.ts`

Utilities for building and transforming database queries.

```typescript
import { buildWhereClause, parseQueryParams } from '@/utils/query.utils';

// Parse query parameters from request
const queryParams = parseQueryParams(request.url);

// Build a structured where clause for Prisma
const whereClause = buildWhereClause({
  search: queryParams.search,
  filters: {
    categoryId: queryParams.category,
    price: { gte: queryParams.minPrice, lte: queryParams.maxPrice }
  },
  isDeleted: false
});

const products = await prisma.product.findMany({
  where: whereClause,
  // Other query options...
});
```

### 🔄 Response Processing

#### `processActionReturnData.ts`

Utilities for formatting and sanitizing data returned from server actions.

```typescript
import { processActionReturnData } from '@/utils/processActionReturnData';

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, category: true }
  });
  
  if (!product) {
    return {
      success: false,
      message: 'Product not found'
    };
  }
  
  // Sanitize and transform data before returning
  return {
    success: true,
    data: processActionReturnData(product)
  };
}
```

### 🎨 UI Utilities

#### `index.ts` (main utils)

Common UI utilities including class name merging with Tailwind.

```typescript
import { cn } from '@/utils';

function Button({ className, variant, ...props }) {
  // Merge classes based on conditional logic
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800',
        className
      )}
      {...props}
    />
  );
}
```

## Best Practices

### Pure Functions

Most utility functions are designed as pure functions with no side effects:

```typescript
// Good - pure function
export function formatCurrency(amount: number, currency = 'PHP'): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Avoid - impure function with side effects
export function formatAndStoreCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
  
  localStorage.setItem('lastFormatted', formatted); // Side effect!
  return formatted;
}
```

### Error Handling

Utilities implement robust error handling:

```typescript
export function safelyParseJson<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
}
```

### Composition

Utilities are designed for composition and reuse:

```typescript
// Small utilities that can be composed
export function padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function formatTimeOnly(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${padZero(hours)}:${padZero(minutes)}`;
}

export function formatDateOnly(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${padZero(day)}/${padZero(month)}/${year}`;
}

// Composed utility
export function formatDateTime(date: Date): string {
  return `${formatDateOnly(date)} ${formatTimeOnly(date)}`;
}
```

## Usage Patterns

### Importing Utilities

```typescript
// Import a specific function
import { formatCurrency } from '@/utils/formatCurrency';

// Import from index for common utilities
import { cn, debounce, wait } from '@/utils';
```

### Server and Client Utilities

Some utilities are designed specifically for server or client use:

```typescript
// Server-only utility (uses database)
// Place in a file with 'use server' directive if needed
export async function verifyPermission({ userId, permissions }) {
  // Database query to check permissions
}

// Client-safe utility
export function formatDateForDisplay(date: string | Date) {
  // Safe to use in client components
}
```

### Testing Utilities

Utilities are designed to be easily testable:

```typescript
// utils/formatCurrency.ts
export function formatCurrency(amount: number, currency = 'PHP'): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '—';
  }
  
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency,
  }).format(amount);
}

// utils/formatCurrency.test.ts
describe('formatCurrency', () => {
  it('formats valid amounts correctly', () => {
    expect(formatCurrency(1000)).toBe('₱1,000.00');
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00');
  });
  
  it('handles invalid inputs', () => {
    expect(formatCurrency(NaN)).toBe('—');
    expect(formatCurrency(undefined as any)).toBe('—');
  });
});
```

## Advanced Usage

### With React Hooks

Creating custom hooks based on utilities:

```typescript
// Custom hook based on format utility
function useFormattedPrice(amount: number, currency?: string) {
  const [formattedPrice, setFormattedPrice] = useState('');
  
  useEffect(() => {
    setFormattedPrice(formatCurrency(amount, currency));
  }, [amount, currency]);
  
  return formattedPrice;
}

// Usage
function PriceDisplay({ product }) {
  const formattedPrice = useFormattedPrice(product.price);
  return <div>{formattedPrice}</div>;
}
```

### Memoization

For expensive utilities, leverage memoization:

```typescript
import { memoize } from 'lodash';

// Memoized version of a complex calculation
export const calculateTotalWithTax = memoize(
  (subtotal: number, taxRate: number) => {
    // Complex tax calculation
    const tax = subtotal * (taxRate / 100);
    return subtotal + tax;
  }
);
```

The utility functions in MerchTrack are an essential part of maintaining consistent behavior and eliminating code duplication across the application. By centralizing these common operations, we ensure better maintainability and more consistent user experiences.