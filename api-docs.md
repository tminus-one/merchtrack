# MerchTrack API Documentation

This document provides comprehensive documentation for the MerchTrack API endpoints.

## Table of Contents

- [Common Response Format](#common-response-format)
- [Query Parameters](#query-parameters)
- [Products API](#products-api)
- [Orders API](#orders-api)
- [Payments API](#payments-api)
- [Tickets API](#tickets-api)
- [Users API](#users-api)

## Common Response Format

All API endpoints follow a consistent response format:

**Success Response**

```json
{
  "success": true,
  "data": [...],  // The requested data
  "metadata": {   // Included in list endpoints
    "total": 100,
    "page": 1,
    "lastPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error Response**

```json
{
  "success": false,
  "message": "Error message details"
}
```

## Query Parameters

Most list endpoints accept the following query parameters:

| Parameter | Type | Description |
|-----------|------|-------------|
| take | number | Number of items to retrieve (default: 10) |
| skip | number | Number of items to skip (default: 0) |
| where | object | Filtering criteria |
| include | object | Relations to include in the response |
| orderBy | object | Sorting criteria |
| limitFields | array | Fields to include in the response |
| page | number | Current page number (default: 1) |
| limit | number | Items per page (default: 10) |

## Products API

### List Products

Retrieves a paginated list of products.

**Endpoint:** `POST /api/products`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| take | number | No | Number of products to retrieve |
| skip | number | No | Number of products to skip |
| where | object | No | Filter criteria (e.g., `{ isDeleted: false }`) |
| include | object | No | Relations to include |
| orderBy | object | No | Sorting criteria |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with product data and pagination metadata.

### Get Product by Slug

Retrieves details for a specific product by its slug.

**Endpoint:** `POST /api/products/[slug]`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | Product slug |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| include | object | No | Relations to include |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with product data or 404 error if product not found.

### Get Product List (Simple)

Retrieves a simplified list of products.

**Endpoint:** `GET /api/products/list`

**Response:**

Array of products with id and title only, sorted alphabetically.

## Orders API

### List Orders

Retrieves a paginated list of orders.

**Endpoint:** `POST /api/orders`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| take | number | No | Number of orders to retrieve |
| skip | number | No | Number of orders to skip |
| where | object | No | Filter criteria |
| include | object | No | Relations to include |
| orderBy | object | No | Sorting criteria |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with order data and pagination metadata.

### Get Order by ID

Retrieves details for a specific order.

**Endpoint:** `POST /api/orders/[orderId]`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| orderId | string | Yes | Order ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| include | object | No | Relations to include |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with order data or 404 error if order not found.

## Payments API

### List Payments

Retrieves a paginated list of payments.

**Endpoint:** `POST /api/payments`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| take | number | No | Number of payments to retrieve |
| skip | number | No | Number of payments to skip |
| where | object | No | Filter criteria |
| include | object | No | Relations to include |
| orderBy | object | No | Sorting criteria |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with payment data and pagination metadata.

### Get Payment by ID

Retrieves details for a specific payment.

**Endpoint:** `POST /api/payments/[paymentId]`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| paymentId | string | Yes | Payment ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| include | object | No | Relations to include |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with payment data or 404 error if payment not found.

## Tickets API

### List Tickets

Retrieves a paginated list of tickets.

**Endpoint:** `POST /api/tickets`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| take | number | No | Number of tickets to retrieve |
| skip | number | No | Number of tickets to skip |
| where | object | No | Filter criteria |
| include | object | No | Relations to include |
| orderBy | object | No | Sorting criteria |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with ticket data and pagination metadata.

### Get Ticket by ID

Retrieves details for a specific ticket.

**Endpoint:** `POST /api/tickets/[ticketId]`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| ticketId | string | Yes | Ticket ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| include | object | No | Relations to include |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with ticket data or 404 error if ticket not found.

## Users API

### Get User Cart

Retrieves a user's cart information.

**Endpoint:** `POST /api/users/[userId]`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| include | object | No | Relations to include |
| limitFields | array | No | Fields to include in the response |

**Response:**

Success response with user's cart data or 404 error if user not found.

### Get User Image

Retrieves a user's profile image URL.

**Endpoint:** `GET /api/users/image/[userId]`

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User ID |

**Response:**

Success response with the user's image URL. Results are cached for 30 minutes.

## Authentication

Most endpoints require authentication through Clerk middleware. Protected routes will redirect unauthenticated users to the sign-in page.

## Error Handling

All endpoints handle errors consistently with appropriate HTTP status codes:
- 404: Resource not found
- 500: Server error

Error responses include a `success: false` flag and a descriptive error message.