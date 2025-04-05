# MerchTrack Library Documentation

<div align="center">
  <h1>📚 Library Module Documentation</h1>
  <p>Core utility libraries and services for the MerchTrack application</p>
</div>

## Overview

The `src/lib` directory contains essential utilities, services, and connection modules that power the MerchTrack application. These modules provide core functionality such as database connections, authentication services, email sending capabilities, file storage integration, and various utility functions.

## Libraries

### 🔐 Authentication

#### `auth.ts`

Provides authentication utilities and helpers for user authorization and session management.

```typescript
// Example usage
import { getCurrentUser, isUserAuthorized } from '@/lib/auth';

const user = await getCurrentUser();
if (await isUserAuthorized(user, 'admin')) {
  // Perform admin-only actions
}
```

#### `clerk.ts`

Singleton pattern implementation for Clerk authentication client to prevent multiple instances.

```typescript
import clerk from '@/lib/clerk';

// Access Clerk client methods
const user = await clerk.users.getUser(userId);
```

### 💾 Data Storage & Retrieval

#### `db.ts`

Provides a singleton Prisma client instance for database operations.

```typescript
import prisma from '@/lib/db';

// Use Prisma client to query the database
const users = await prisma.user.findMany();
```

#### `redis.ts`

Redis client implementation for caching and pubsub operations with utility functions.

```typescript
import { getCache, setCache, invalidateCache } from '@/lib/redis';

// Store data in cache
await setCache('user:123', userData, 3600); // Cache for 1 hour

// Retrieve from cache
const cachedUser = await getCache('user:123');

// Invalidate cache entries
await invalidateCache(['user:123', 'users:list']);
```

#### `s3.ts`

Handles file uploads and storage using Amazon S3 or compatible object storage.

```typescript
import { uploadToR2, deleteFromR2 } from '@/lib/s3';

// Upload a file
const url = await uploadToR2(file, 'products/images');

// Delete a file
await deleteFromR2('products/images/product-123.jpg');
```

### 📧 Communication

#### `email-service.ts`

High-level email sending service that uses templates and adapters.

```typescript
import { sendOrderConfirmationEmail, sendPasswordResetEmail } from '@/lib/email-service';

// Send order confirmation
await sendOrderConfirmationEmail({
  orderNumber: 'ORD-12345',
  customerEmail: 'customer@example.com',
  customerName: 'John Doe',
  // Other order details...
});
```

#### `mailgun.ts`

Implementation of the email sending functionality using Mailgun service.

```typescript
import { sendEmail } from '@/lib/mailgun';

// Send email directly with Mailgun
await sendEmail({
  to: 'recipient@example.com',
  subject: 'Important Notification',
  html: '<p>Hello from MerchTrack!</p>',
  from: 'MerchTrack Support <support@merchtrack.tech>'
});
```

### 🛒 Shopping

#### `cart.ts`

Utilities for handling shopping cart operations and validation.

```typescript
import { calculateCartTotal, validateCartItems } from '@/lib/cart';

// Calculate cart total with role-based pricing
const total = calculateCartTotal(cartItems, userRole);

// Validate cart items against current inventory
const { valid, invalidItems } = await validateCartItems(cartItems);
```

### 🛠️ Utility Functions

#### `utils.ts`

General utility functions used throughout the application.

```typescript
import { cn, slugify, formatDate } from '@/lib/utils';

// Combine class names conditionally
const className = cn('base-style', isActive && 'active-style');

// Create URL-friendly slug
const productSlug = slugify('Premium T-Shirt Blue XXL');

// Format date for display
const displayDate = formatDate(new Date(), 'MMM dd, yyyy');
```

#### `exceptions.ts`

Custom exception classes for consistent error handling.

```typescript
import { DatabaseError, AuthenticationError, ValidationError } from '@/lib/exceptions';

// Throw specific error types
try {
  // Database operation
} catch (error) {
  throw new DatabaseError('Failed to fetch user data', error);
}
```

## Best Practices

1. **Always use the singleton instances** provided by modules like `db.ts` and `clerk.ts` to prevent multiple connections.

2. **Cache expensive operations** using Redis when appropriate to improve performance.

3. **Handle errors properly** by using the custom exception types from `exceptions.ts`.

4. **Use type-safe database queries** with the Prisma client for better maintainability and fewer runtime errors.

5. **Leverage email templates** rather than creating email content directly in application code.

## Integration Patterns

Most library modules follow these integration patterns:

1. **Singleton Pattern** - Used for database connections, authentication clients, and other services that should be instantiated only once.

2. **Adapter Pattern** - Implemented for services like email sending to allow easier switching between providers.

3. **Repository Pattern** - Used for data access layers to abstract database operations.

4. **Service Layer** - Implemented for business logic that spans multiple repositories or external services.

## Environment Configuration

Most library modules require specific environment variables to be set in your `.env` file:

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/merchtrack

# Redis
REDIS_URL=redis://localhost:6379

# Clerk Auth
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# S3/R2 Storage
R2_ACCOUNT_ID=your_r2_account_id
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_KEY=your_r2_secret_key
R2_BUCKET=your_bucket_name

# Mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mail.merchtrack.tech
```

Make sure these variables are properly configured for the library modules to work correctly.