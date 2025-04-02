# MerchTrack Stores Documentation

<div align="center">
  <h1>🏪 Global State Stores</h1>
  <p>Client-side state management for MerchTrack application</p>
</div>

## Overview

The `src/stores` directory contains global state management stores that provide persistent and shared state across components in the MerchTrack application. These stores are implemented using Zustand, a lightweight state management library that offers a simple yet powerful API with React hooks integration.

## Stores

### 👤 User Store

#### `user.store.ts`

Maintains authenticated user state and preferences across the application.

```typescript
import { useUserStore } from '@/stores/user.store';

// In your component
function ProfileComponent() {
  const { user, userId, isAdmin, updateUserPreferences } = useUserStore();
  
  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      {isAdmin && <AdminPanel />}
      
      <button onClick={() => updateUserPreferences({ theme: 'dark' })}>
        Switch to Dark Mode
      </button>
    </div>
  );
}
```

The user store typically includes:

- Core user information (ID, name, email)
- Authentication status
- Role and permissions
- User preferences
- Methods to update user data

### 🛒 Cart Store

#### `cart.store.ts`

Manages the shopping cart state across the application.

```typescript
import { useCartStore } from '@/stores/cart.store';

// In your component
function ProductComponent({ product }) {
  const { addItem, removeItem, cartItems, itemCount, totalAmount } = useCartStore();
  
  const isInCart = cartItems.some(item => item.variantId === product.defaultVariantId);
  
  return (
    <div>
      <h2>{product.title}</h2>
      <p>Price: ${product.price}</p>
      
      {isInCart ? (
        <button onClick={() => removeItem(product.defaultVariantId)}>
          Remove from Cart
        </button>
      ) : (
        <button onClick={() => addItem({
          variantId: product.defaultVariantId,
          quantity: 1,
          price: product.price
        })}>
          Add to Cart
        </button>
      )}
      
      <div>Items in cart: {itemCount}</div>
      <div>Total: ${totalAmount}</div>
    </div>
  );
}
```

The cart store typically includes:

- Array of cart items
- Methods to add, remove, and update items
- Cart summary calculations (total price, item count)
- Cart synchronization with persistence layer
- Checkout integration

### 🔄 Store Integration

#### `index.ts`

Export point for all stores, potentially including utilities for store composition or middleware.

## Implementation Pattern

MerchTrack stores follow a consistent pattern for state management:

### Store Creation

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  // Other state and actions...
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
      removeItem: (id) => set((state) => ({ 
        items: state.items.filter(item => item.id !== id)
      })),
      // Other actions...
    }),
    {
      name: 'merchtrack-cart',
    }
  )
);
```

### Key Features

1. **Persistence**: Stores use the `persist` middleware to save state to localStorage or other storage.

2. **Type Safety**: All stores are fully typed using TypeScript interfaces.

3. **Immutable Updates**: State updates follow immutable patterns.

4. **Selectors**: For performance optimization when accessing specific parts of the state.

5. **Actions**: Each store contains methods that modify the state.

## Best Practices

### Usage in Components

```typescript
import { useCartStore } from '@/stores/cart.store';

// Using selectors for performance
const addItem = useCartStore(state => state.addItem);
const itemCount = useCartStore(state => state.items.length);

// OR destructuring (less performant but more convenient)
const { addItem, items } = useCartStore();
const itemCount = items.length;
```

### Optimizing Re-renders

To prevent unnecessary re-renders, use selectors to extract only the state your component needs:

```typescript
// Good: Component only re-renders when selected state changes
const itemCount = useCartStore(state => state.items.length);

// Avoid: Component re-renders on any cart state change
const { items } = useCartStore();
const itemCount = items.length;
```

### Combining with Server State

When working with server data, consider how local state integrates with React Query:

```typescript
function ProductList() {
  // Server state
  const { data: products } = useQuery(['products'], fetchProducts);
  
  // Local UI state
  const addToCart = useCartStore(state => state.addItem);
  
  // Combining them in UI
  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>
          {product.name}
          <button onClick={() => addToCart({
            variantId: product.defaultVariantId,
            quantity: 1,
            price: product.price
          })}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Persisting Sensitive Data

Be careful with persisting sensitive data:

```typescript
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      // State and actions...
    }),
    {
      name: 'merchtrack-user',
      // Exclude sensitive data from persistence
      partialize: (state) => ({
        ...state,
        personalInfo: undefined, // Don't persist personal info
      }),
    }
  )
);
```

## Integration with MerchTrack Application

### Store Initialization

Stores are typically initialized in the application bootstrap process:

```typescript
// In _app.tsx or layout.tsx
import { initializeStores } from '@/stores';

export default function RootLayout({ children }) {
  // Initialize all stores with any server data
  initializeStores();
  
  return <>{children}</>;
}
```

### Hydration Strategy

For server-side rendering compatibility:

```typescript
import { useEffect } from 'react';
import { useUserStore } from '@/stores/user.store';

export function StoreHydration({ serverUser }) {
  const setUser = useUserStore(state => state.setUser);
  
  useEffect(() => {
    // Hydrate client store with server data after first render
    if (serverUser) {
      setUser(serverUser);
    }
  }, [serverUser, setUser]);
  
  return null;
}
```

## Advanced Patterns

### Store Slicing

For large stores, consider slicing the store into logical modules:

```typescript
const createCartSlice = (set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
});

const createCheckoutSlice = (set, get) => ({
  shippingInfo: null,
  setShippingInfo: (info) => set({ shippingInfo: info }),
});

export const useCartStore = create<CartState & CheckoutState>()((set, get) => ({
  ...createCartSlice(set, get),
  ...createCheckoutSlice(set, get),
}));
```

### Store Extensions

Add middleware or extensions for logging, debugging or analytics:

```typescript
import { devtools } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        // Store implementation
      }),
      { name: 'merchtrack-cart' }
    )
  )
);
```