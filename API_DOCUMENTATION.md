# API Documentation

Complete API reference for Product Service and Order Service with request/response examples.

---

## 📦 Product Service APIs

**Base URL:** `http://localhost:3000`

---

### 1. Create Product

**Endpoint:** `POST /products`

**Status Code:** `201 Created`

**Request Body:**
```json
{
  "name": "Gaming Laptop",                    // Required
  "description": "High-performance laptop",   // Optional
  "price": 999.99,                            // Required (must be > 0)
  "currency": "USD",                           // Optional (default: "USD", max 10 chars)
  "inventoryCount": 50,                        // Optional (default: 0, must be >= 0)
  "status": 1                                  // Optional (default: 1, enum: 1 = ACTIVE | 0 = INACTIVE)
}
```

**Example Request:**
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4090",
  "price": 1999.99,
  "currency": "USD",
  "inventoryCount": 25,
  "status": 1
}
```

**Minimal Request (only required fields):**
```json
{
  "name": "Gaming Laptop",
  "price": 999.99
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "GAMINGLAP-LXP8K2-A3F9",              // Auto-generated
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4090",
  "price": "1999.99",
  "currency": "USD",
  "inventoryCount": 25,
  "status": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get All Products (with Pagination, Sorting, and Search)

**Endpoint:** `GET /products`

**Status Code:** `200 OK`

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, minimum: 1, maximum: 100)
- `sortBy` (optional): Field to sort by - `name`, `price`, `createdAt`, `updatedAt`, `inventoryCount` (default: `createdAt`)
- `sortOrder` (optional): Sort direction - `ASC` or `DESC` (default: `DESC`)
- `search` (optional): Search term - searches in `name`, `sku`, and `description` fields
- `status` (optional): Filter by status (`1` = ACTIVE | `0` = INACTIVE)

**Request Examples:**
```
# Get all products (default pagination)
GET /products

# Get first page with 20 items
GET /products?page=1&limit=20

# Search for products
GET /products?search=laptop

# Filter by status
GET /products?status=1

# Sort by price (ascending)
GET /products?sortBy=price&sortOrder=ASC

# Combined: Search, filter, sort, and paginate
GET /products?search=gaming&status=1&sortBy=price&sortOrder=DESC&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "sku": "GAMINGLAP-LXP8K2-A3F9",
      "name": "Gaming Laptop",
      "description": "High-performance gaming laptop",
      "price": "1999.99",
      "currency": "USD",
      "inventoryCount": 25,
      "status": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 3. Get Product by ID

**Endpoint:** `GET /products/:id`

**Status Code:** `200 OK`

**Path Parameters:**
- `id` (required): Product UUID

**Request Example:**
```
GET /products/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "GAMINGLAP-LXP8K2-A3F9",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": "1999.99",
  "currency": "USD",
  "inventoryCount": 25,
  "status": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Product with ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

---

### 4. Update Product

**Endpoint:** `PATCH /products/:id`

**Status Code:** `200 OK`

**Path Parameters:**
- `id` (required): Product UUID

**Request Body:** (All fields are optional - send only fields to update)
```json
{
  "sku": "CUSTOM-SKU-001",                     // Optional (max 100 chars, must be unique)
  "name": "Updated Laptop Name",                // Optional (max 255 chars)
  "description": "Updated description",        // Optional
  "price": 899.99,                              // Optional (must be > 0)
  "currency": "EUR",                            // Optional (max 10 chars)
  "inventoryCount": 100,                        // Optional (must be >= 0)
  "status": 0                          // Optional (enum: 1 = ACTIVE | 0 = INACTIVE)
}
```

**Example Request:**
```json
{
  "name": "Updated Gaming Laptop",
  "price": 1799.99,
  "inventoryCount": 30
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "GAMINGLAP-LXP8K2-A3F9",
  "name": "Updated Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": "1799.99",
  "currency": "USD",
  "inventoryCount": 30,
  "status": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

---

### 5. Update Product Inventory

**Endpoint:** `PATCH /products/:id/inventory`

**Status Code:** `200 OK`

**Path Parameters:**
- `id` (required): Product UUID

**Request Body:**
```json
{
  "quantity": -5                                // Required (positive = add, negative = subtract)
}
```

**Example Requests:**

**Add Inventory (Restocking):**
```json
{
  "quantity": 20
}
```

**Subtract Inventory (Sale):**
```json
{
  "quantity": -5
}
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "sku": "GAMINGLAP-LXP8K2-A3F9",
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": "1999.99",
  "currency": "USD",
  "inventoryCount": 45,                         // Updated inventory
  "status": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:40:00.000Z"
}
```

**Error Response (400 - Insufficient Inventory):**
```json
{
  "statusCode": 400,
  "message": "Insufficient inventory. Current inventory: 5, requested change: -10"
}
```

---

### 6. Delete Product (Soft Delete)

**Endpoint:** `DELETE /products/:id`

**Status Code:** `204 No Content`

**Path Parameters:**
- `id` (required): Product UUID

**Request Example:**
```
DELETE /products/550e8400-e29b-41d4-a716-446655440000
```

**Response:** No body (204 No Content)

**Note:** This sets the product status to `0` (INACTIVE) instead of deleting it from the database.

---

## 🛒 Order Service APIs

**Base URL:** `http://localhost:3001`

---

### 1. Create Order

**Endpoint:** `POST /orders`

**Status Code:** `201 Created`

**Request Body:**
```json
{
  "customerId": "CUST-001",                     // Optional
  "items": [                                    // Required (array, minimum 1 item)
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",  // Required (UUID)
      "quantity": 2                             // Required (must be >= 1)
    }
  ]
}
```

**Example Request (Single Product):**
```json
{
  "customerId": "CUST-12345",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 2
    }
  ]
}
```

**Example Request (Multiple Products):**
```json
{
  "customerId": "CUST-67890",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 2
    },
    {
      "productId": "660e8400-e29b-41d4-a716-446655440001",
      "quantity": 3
    },
    {
      "productId": "770e8400-e29b-41d4-a716-446655440002",
      "quantity": 1
    }
  ]
}
```

**Example Request (Without Customer ID):**
```json
{
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 5
    }
  ]
}
```

**Response:**
```json
{
  "id": "order-uuid-here",
  "orderNumber": "ORD-1234567890-ABC123",       // Auto-generated
  "customerId": "CUST-12345",
  "status": "CREATED",
  "totalAmount": "3999.98",
  "currency": "USD",
  "items": [
    {
      "id": "item-uuid-1",
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "productSnapshot": {
        "name": "Gaming Laptop",
        "price": 1999.99,
        "sku": "GAMINGLAP-LXP8K2-A3F9"
      },
      "quantity": 2,
      "unitPrice": "1999.99",
      "lineTotal": "3999.98"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**

**404 - Product Not Found:**
```json
{
  "statusCode": 404,
  "message": "Product with ID 550e8400-e29b-41d4-a716-446655440000 not found"
}
```

**400 - Insufficient Inventory:**
```json
{
  "statusCode": 400,
  "message": "Insufficient inventory for product 550e8400-e29b-41d4-a716-446655440000. Available: 5, Requested: 10"
}
```

**400 - Inactive Product:**
```json
{
  "statusCode": 400,
  "message": "Product 550e8400-e29b-41d4-a716-446655440000 is not active"
}
```

**503 - Product Service Unavailable:**
```json
{
  "statusCode": 503,
  "message": "Failed to fetch product 550e8400-e29b-41d4-a716-446655440000: Connection timeout"
}
```

---

### 2. Get All Orders (with Pagination, Sorting, and Search)

**Endpoint:** `GET /orders`

**Status Code:** `200 OK`

**Query Parameters:**
- `page` (optional): Page number (default: 1, minimum: 1)
- `limit` (optional): Items per page (default: 10, minimum: 1, maximum: 100)
- `sortBy` (optional): Field to sort by - `orderNumber`, `totalAmount`, `createdAt`, `updatedAt`, `status` (default: `createdAt`)
- `sortOrder` (optional): Sort direction - `ASC` or `DESC` (default: `DESC`)
- `search` (optional): Search term - searches in `orderNumber` and `customerId` fields
- `status` (optional): Filter by status (`CREATED` | `PAID` | `SHIPPED` | `DELIVERED` | `CANCELLED`)

**Request Examples:**
```
# Get all orders (default pagination)
GET /orders

# Get first page with 20 items
GET /orders?page=1&limit=20

# Search for orders
GET /orders?search=ORD-123

# Filter by status
GET /orders?status=CREATED

# Sort by total amount (descending)
GET /orders?sortBy=totalAmount&sortOrder=DESC

# Combined: Search, filter, sort, and paginate
GET /orders?search=CUST-001&status=PAID&sortBy=totalAmount&sortOrder=DESC&page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "order-uuid-1",
      "orderNumber": "ORD-1234567890-ABC123",
      "customerId": "CUST-12345",
      "status": "CREATED",
      "totalAmount": "3999.98",
      "currency": "USD",
      "items": [
        {
          "id": "item-uuid-1",
          "productId": "550e8400-e29b-41d4-a716-446655440000",
          "productSnapshot": {
            "name": "Gaming Laptop",
            "price": 1999.99,
            "sku": "GAMINGLAP-LXP8K2-A3F9"
          },
          "quantity": 2,
          "unitPrice": "1999.99",
          "lineTotal": "3999.98"
        }
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 3. Get Order by ID

**Endpoint:** `GET /orders/:id`

**Status Code:** `200 OK`

**Path Parameters:**
- `id` (required): Order UUID

**Request Example:**
```
GET /orders/order-uuid-here
```

**Response:**
```json
{
  "id": "order-uuid-here",
  "orderNumber": "ORD-1234567890-ABC123",
  "customerId": "CUST-12345",
  "status": "CREATED",
  "totalAmount": "3999.98",
  "currency": "USD",
  "items": [
    {
      "id": "item-uuid-1",
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "productSnapshot": {
        "name": "Gaming Laptop",
        "price": 1999.99,
        "sku": "GAMINGLAP-LXP8K2-A3F9"
      },
      "quantity": 2,
      "unitPrice": "1999.99",
      "lineTotal": "3999.98"
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Order with ID order-uuid-here not found"
}
```

---

### 4. Update Order Status

**Endpoint:** `PATCH /orders/:id/status`

**Status Code:** `200 OK`

**Path Parameters:**
- `id` (required): Order UUID

**Request Body:**
```json
{
  "status": "PAID"                              // Required (enum: CREATED | PAID | SHIPPED | DELIVERED | CANCELLED)
}
```

**Example Requests:**

**Mark as Paid:**
```json
{
  "status": "PAID"
}
```

**Mark as Shipped:**
```json
{
  "status": "SHIPPED"
}
```

**Mark as Delivered:**
```json
{
  "status": "DELIVERED"
}
```

**Response:**
```json
{
  "id": "order-uuid-here",
  "orderNumber": "ORD-1234567890-ABC123",
  "customerId": "CUST-12345",
  "status": "PAID",                            // Updated status
  "totalAmount": "3999.98",
  "currency": "USD",
  "items": [...],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:45:00.000Z"
}
```

---

### 5. Cancel Order (Soft Delete)

**Endpoint:** `DELETE /orders/:id`

**Status Code:** `204 No Content`

**Path Parameters:**
- `id` (required): Order UUID

**Request Example:**
```
DELETE /orders/order-uuid-here
```

**Response:** No body (204 No Content)

**Note:** This sets the order status to `CANCELLED` instead of deleting it from the database.

---

## 📋 Summary Tables

### Product Service Endpoints

| Method | Endpoint | Description | Request Body Required |
|--------|----------|-------------|----------------------|
| POST | `/products` | Create product | Yes |
| GET | `/products` | Get all products (with pagination, sorting, search) | No (query params: page, limit, sortBy, sortOrder, search, status) |
| GET | `/products/:id` | Get product by ID | No |
| PATCH | `/products/:id` | Update product | Yes (all fields optional) |
| PATCH | `/products/:id/inventory` | Update inventory | Yes |
| DELETE | `/products/:id` | Soft delete product | No |

### Order Service Endpoints

| Method | Endpoint | Description | Request Body Required |
|--------|----------|-------------|----------------------|
| POST | `/orders` | Create order | Yes |
| GET | `/orders` | Get all orders (with pagination, sorting, search) | No (query params: page, limit, sortBy, sortOrder, search, status) |
| GET | `/orders/:id` | Get order by ID | No |
| PATCH | `/orders/:id/status` | Update order status | Yes |
| DELETE | `/orders/:id` | Cancel order | No |

### Field Validation Summary

#### Create Product DTO
- ✅ **Required:** `name`, `price`
- ⚪ **Optional:** `description`, `currency`, `inventoryCount`, `status`
- ❌ **Not in DTO:** `sku` (auto-generated by backend)

#### Update Product DTO
- ⚪ **All fields optional:** `sku`, `name`, `description`, `price`, `currency`, `inventoryCount`, `status`

#### Create Order DTO
- ✅ **Required:** `items` (array with at least 1 item)
- ⚪ **Optional:** `customerId`
- **OrderItem DTO (inside items array):**
  - ✅ **Required:** `productId`, `quantity`
  - ❌ **Not in DTO:** All other fields (auto-generated)

#### Update Order Status DTO
- ✅ **Required:** `status`

---

## 🔗 Integration Notes

1. **Order Service depends on Product Service:**
   - Order Service calls Product Service to validate products
   - Order Service updates inventory in Product Service when orders are created

2. **Product Service must be running before Order Service:**
   - Default Product Service URL: `http://localhost:3000`
   - Configured via `PRODUCT_SERVICE_URL` environment variable

3. **Inventory Management:**
   - When an order is created, inventory is automatically decremented
   - Use `PATCH /products/:id/inventory` to manually adjust inventory

---

## 🚨 Common Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 400 | Bad Request (validation error, insufficient inventory, etc.) |
| 404 | Not Found (product/order not found) |
| 409 | Conflict (duplicate SKU, etc.) |
| 503 | Service Unavailable (Product Service unreachable) |

