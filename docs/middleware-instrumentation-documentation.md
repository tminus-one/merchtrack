# MerchTrack Middleware & Instrumentation Documentation

<div align="center">
  <h1>🔄 Middleware & Instrumentation</h1>
  <p>Request processing, routing, and monitoring capabilities for MerchTrack</p>
</div>

## Overview

This document covers the middleware and instrumentation configurations in the MerchTrack application. These components handle critical functions like authentication routing, API request verification, error monitoring, and performance tracking.

## Table of Contents

1. [Middleware](#middleware)
   - [Authentication Flow](#authentication-flow)
   - [Route Protection](#route-protection)
   - [API Authentication](#api-authentication)
   - [Configuration](#middleware-configuration)
2. [Instrumentation](#instrumentation)
   - [Error Monitoring](#error-monitoring)
   - [Performance Tracking](#performance-tracking)
   - [Configuration](#instrumentation-configuration)

## Middleware

The middleware system (`middleware.ts`) handles incoming requests before they reach the route handlers, providing critical functionality for authentication, request processing, and routing logic.

### Authentication Flow

The middleware implements a comprehensive authentication flow using Clerk:

```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  
  // Authentication logic
  if (!userId && !isPublicRoute(req)) return redirectToSignIn({ returnBackUrl: req.url });
  
  // Additional routing logic...
});
```

Key points:
- Uses Clerk's middleware to handle authentication state
- Redirects unauthenticated users to sign-in for protected routes
- Preserves original URL for post-authentication redirect

### Route Protection

The middleware implements several route protection strategies:

#### Public Routes

```typescript
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/img(.*)',
  '/monitoring(.*)',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/contact',
  '/about',
  '/faqs',
  '/terms-of-service',
  '/privacy-policy',
  '/survey(.*)',
  '/track-order',
  '/products(.*)',
  '/how-it-works',
]);
```

#### Onboarding Routes

```typescript
const isOnboardingRoute = createRouteMatcher([
  '/onboarding(.*)',
]);

// Redirect users who haven't completed onboarding
if (userId && !sessionClaims?.metadata?.isOnboardingCompleted && !isOnboardingRoute(req)) {
  return NextResponse.redirect(new URL('/onboarding', req.url));
}
```

#### Admin Routes

```typescript
const isAdminRoute = createRouteMatcher([
  '/admin(.*)',
]);

// Check admin access
const isAdmin = sessionClaims?.metadata.data.isAdmin || sessionClaims?.metadata.data.isStaff;
if (isAdmin && isAdminRoute(req)) return NextResponse.next();
if (!isAdmin && isAdminRoute(req)) {
  return NextResponse.redirect(new URL('/404', req.url));
}
```

### API Authentication

For API routes, the middleware implements JWT verification:

```typescript
const isApiRoute = createRouteMatcher([
  '/api(.*)',
]);

// API route JWT verification
if (isApiRoute(req)) {
  const verificationResult = await verifyApiJwt(req);
  if (verificationResult) {
    return verificationResult;
  }
}
```

The JWT verification function:

```typescript
async function verifyApiJwt(req: NextRequest): Promise<NextResponse | null> {
  const authorization = req.headers.get("Authorization");
  if (!authorization) {
    return NextResponse.json({
      status: 401,
      message: "Unauthorized",
    });
  }
  
  try {
    const token = authorization.split(" ")[1];
    const jwtKey = process.env.JWT_KEY ?? '';
    // Verification logic...
    
    // Add the verified payload to request headers for downstream handlers
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-auth-user', JSON.stringify(verifyResult.payload));
    
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  } catch {
    return NextResponse.json({
      status: 401,
      message: "Invalid token",
    }, { status: 401 });
  }
}
```

### Middleware Configuration

The middleware uses Next.js's path matcher configuration to efficiently process requests:

```typescript
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
```

This configuration:
- Skips Next.js internal routes and static files for better performance
- Always processes API routes to ensure proper authentication
- Uses regex patterns for efficient path matching

## Instrumentation

The instrumentation system (`instrumentation.ts`) configures monitoring, error tracking, and performance metrics for the application.

### Error Monitoring

MerchTrack uses Sentry for error monitoring and tracking:

```typescript
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.TURBOPACK) {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
```

Key capabilities:
- Automatic error capture for both client and server errors
- Detailed stack traces and context for troubleshooting
- Environment-specific configuration
- Request error capture with `onRequestError`

### Performance Tracking

The instrumentation configures performance monitoring:

- **Page Load Performance**: Tracks how quickly pages load and render
- **API Response Times**: Measures backend API response times
- **Resource Usage**: Monitors memory and CPU consumption on the server

### Instrumentation Configuration

Instrumentation is configured conditionally based on environment:

```typescript
export async function register() {
  if (process.env.TURBOPACK) {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  // Edge runtime configuration is commented out but available
  // if (process.env.NEXT_RUNTIME === "edge") {
  //   await import("../sentry.edge.config");
  // }
}
```

This allows for:
- Development-specific monitoring configuration
- Production-optimized error tracking
- Different configurations for Node.js and Edge runtimes

## Implementation Details

### JWT Verification

The middleware uses the `jose` library for secure JWT verification:

```typescript
import * as jose from 'jose';

// Within verifyApiJwt function
const secret = new TextEncoder().encode(jwtKey);
const verifyResult = await jose.jwtVerify(token, secret);
```

This provides:
- Standards-compliant JWT verification
- Secure handling of cryptographic operations
- Proper validation of token expiration and claims

### Clerk Integration

The middleware seamlessly integrates with Clerk's authentication:

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Clerk provides session data
const { userId, sessionClaims, redirectToSignIn } = await auth();

// Session claims can include custom metadata
const isAdmin = sessionClaims?.metadata.data.isAdmin || sessionClaims?.metadata.data.isStaff;
```

This allows for:
- User identification via `userId`
- Access to custom user metadata via `sessionClaims`
- Seamless redirection to authentication flows when needed

## Best Practices

### Security Considerations

1. **JWT Secret Management**:
   ```typescript
   const jwtKey = process.env.JWT_KEY ?? '';
   if (!jwtKey) {
     return NextResponse.json({
       status: 500,
       message: "Server configuration error",
     }, { status: 500 });
   }
   ```

2. **Headers Security**:
   ```typescript
   // Add authentication data to headers instead of exposing in URL parameters
   const requestHeaders = new Headers(req.headers);
   requestHeaders.set('x-auth-user', JSON.stringify(verifyResult.payload));
   ```

3. **Route Protection**:
   ```typescript
   // Ensure admin routes are properly protected
   if (!isAdmin && isAdminRoute(req)) {
     return NextResponse.redirect(new URL('/404', req.url));
   }
   ```

### Performance Optimization

1. **Selective Middleware Execution**:
   ```typescript
   export const config = {
     matcher: [
       // Only run for specific paths
     ]
   };
   ```

2. **Conditional Instrumentation**:
   ```typescript
   if (process.env.TURBOPACK) {
     return; // Skip instrumentation in Turbopack mode
   }
   ```

## Configuration Requirements

### Environment Variables

The middleware and instrumentation require these environment variables:

```
# Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
JWT_KEY=your_jwt_secret_key

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

### Integration Points

The middleware and instrumentation integrate with:

1. **Authentication System**: Clerk for user authentication
2. **Monitoring System**: Sentry for error tracking and performance monitoring
3. **API Routes**: JWT verification for secure API access
4. **Database**: Indirectly through user verification and permission checks

## Troubleshooting

### Common Issues

1. **Authentication Loops**: Users stuck in redirect loops between protected routes and login

   Solution: Check the `isPublicRoute` matcher configuration and ensure the onboarding logic is correct.

2. **JWT Verification Failures**: API routes returning 401 unauthorized errors

   Solution: Verify the `JWT_KEY` environment variable is correctly set and that tokens are being properly generated.

3. **Missing Instrumentation Data**: Error or performance data not appearing in monitoring dashboards

   Solution: Confirm Sentry environment variables are properly configured and that the appropriate Sentry configuration files are imported.

By understanding these middleware and instrumentation components, developers can ensure their MerchTrack implementation maintains proper security, authentication flow, and monitoring capabilities.