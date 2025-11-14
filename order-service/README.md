# Order Service

A Nest.js microservice for managing orders with integration to the product service.

## Features

- ✅ RESTful API for order management
- ✅ PostgreSQL database integration with TypeORM
- ✅ Integration with product-service via HTTP
- ✅ Product validation and inventory management
- ✅ Order items with product snapshots
- ✅ Input validation using class-validator
- ✅ Comprehensive error handling

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose (recommended) OR PostgreSQL (v12 or higher)
- Product Service running (default: http://localhost:3000)
- npm or yarn

## Quick Start with Docker Compose

The easiest way to get started is using Docker Compose for PostgreSQL:

1. **Start PostgreSQL using Docker Compose** (from the root `microservices-assignment` directory):
```bash
cd ..
docker-compose up -d
```

This will:
- Start PostgreSQL 15 in a Docker container
- Create `product_db` and `order_db` databases automatically
- Expose PostgreSQL on port 5432

2. **Navigate to order-service and install dependencies**:
```bash
cd order-service
npm install
```

3. **Set up environment variables**:
   - Create a `.env` file in the root directory
   - Copy the following template:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=order_db

# Product Service Configuration
PRODUCT_SERVICE_URL=http://localhost:3000
PRODUCT_SERVICE_TIMEOUT=5000

# Application Configuration
PORT=3001
NODE_ENV=development
```

4. **Start the service**:
```bash
npm run start:dev
```

## Manual Installation (Without Docker)

1. Navigate to the project directory:
```bash
cd order-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Copy the following template and update with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=order_db

# Product Service Configuration
PRODUCT_SERVICE_URL=http://localhost:3000
PRODUCT_SERVICE_TIMEOUT=5000

# Application Configuration
PORT=3001
NODE_ENV=development
```

4. Create the PostgreSQL database:
```bash
# Using psql
psql -U postgres
CREATE DATABASE order_db;
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The service will start on `http://localhost:3001` (or the port specified in your `.env` file).

### Production Mode
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create a new order |
| GET | `/orders` | Get all orders (optional query: `?status=CREATED`) |
| GET | `/orders/:id` | Get an order by ID with items |
| PATCH | `/orders/:id/status` | Update order status |
| DELETE | `/orders/:id` | Cancel an order (soft delete) |

### Request/Response Examples

#### Create Order
```bash
POST /orders
Content-Type: application/json

{
  "customerId": "CUST-001",
  "items": [
    {
      "productId": "product-uuid-1",
      "quantity": 2
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "id": "order-uuid",
  "orderNumber": "ORD-1234567890-ABC123",
  "customerId": "CUST-001",
  "status": "CREATED",
  "totalAmount": 1999.98,
  "currency": "USD",
  "items": [
    {
      "id": "item-uuid-1",
      "productId": "product-uuid-1",
      "productSnapshot": {
        "name": "Laptop",
        "price": 999.99,
        "sku": "LAPTOP-001"
      },
      "quantity": 2,
      "unitPrice": 999.99,
      "lineTotal": 1999.98
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### Update Order Status
```bash
PATCH /orders/:id/status
Content-Type: application/json

{
  "status": "PAID"
}
```

#### Get Orders with Status Filter
```bash
GET /orders?status=CREATED
```

## Database Schema

### Orders Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| orderNumber | String (unique) | Unique order identifier |
| customerId | String | Customer identifier (optional) |
| status | Enum | CREATED, PAID, SHIPPED, DELIVERED, CANCELLED |
| totalAmount | Decimal | Total order amount |
| currency | String | Currency code (default: USD) |
| createdAt | Timestamp | Creation date |
| updatedAt | Timestamp | Last update date |

### Order Items Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID (FK) | Reference to order |
| productId | String | Product ID from product-service |
| productSnapshot | JSONB | Snapshot of product at order time |
| quantity | Integer | Quantity ordered |
| unitPrice | Decimal | Price per unit at order time |
| lineTotal | Decimal | Total for this line item |

## Order Creation Flow

1. **Validate Products**: Order service calls product-service to validate each product exists and is active
2. **Check Inventory**: Verifies sufficient inventory for each product
3. **Calculate Totals**: Computes line totals and order total
4. **Create Order**: Saves order and order items to database
5. **Update Inventory**: Calls product-service to decrement inventory for each product

## Product Service Integration

The order service communicates with the product service via HTTP:

- **GET** `/products/:id` - Fetch product details
- **PATCH** `/products/:id/inventory` - Update product inventory

Ensure the product service is running and accessible at the configured `PRODUCT_SERVICE_URL`.

## Error Handling

The service handles various error scenarios:

- **404**: Product not found
- **400**: Invalid request (insufficient inventory, inactive product, etc.)
- **503**: Product service unavailable
- **409**: Duplicate order number (rare)

## Project Structure

```
src/
├── config/
│   ├── database.config.ts          # Database configuration
│   └── product-service.config.ts   # Product service configuration
├── orders/
│   ├── dto/
│   │   ├── create-order.dto.ts
│   │   ├── update-order-status.dto.ts
│   │   └── order-item.dto.ts
│   ├── entities/
│   │   ├── order.entity.ts
│   │   └── order-item.entity.ts
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── app.module.ts
└── main.ts
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Technologies Used

- **Nest.js** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript and JavaScript
- **PostgreSQL** - Relational database
- **Axios** - HTTP client for product-service communication
- **class-validator** - Validation library
- **class-transformer** - Transformation library

## License

MIT
