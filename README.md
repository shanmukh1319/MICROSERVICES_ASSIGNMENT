# Microservices Assignment

A microservices-based e-commerce application with Product Service and Order Service built using Nest.js, TypeORM, and PostgreSQL.

## 🏗️ Architecture

- **Product Service** (Port 3000) - Manages products, inventory, and SKU generation
- **Order Service** (Port 3001) - Manages orders and communicates with Product Service via HTTP
- **PostgreSQL** - Database for both services (Docker Compose)



## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm or yarn

### 1. Start PostgreSQL Database

From the root directory (`microservices-assignment`):

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL 15 in a Docker container
- Automatically create `product_db` and `order_db` databases
- Expose PostgreSQL on port 5432

### 2. Start Product Service

```bash
cd product-service
npm install
cp .env.example .env  # Or create .env with database config
npm run start:dev
```

Product Service will run on `http://localhost:3000`

### 3. Start Order Service

In a new terminal:

```bash
cd order-service
npm install
cp .env.example .env  # Or create .env with database config
npm run start:dev
```

Order Service will run on `http://localhost:3001`

## Environment Variables

### Product Service (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=product_db
PORT=3000
NODE_ENV=development
```

### Order Service (.env)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=order_db
PRODUCT_SERVICE_URL=http://localhost:3000
PRODUCT_SERVICE_TIMEOUT=5000
PORT=3001
NODE_ENV=development
```

## Docker Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down
```

## Project Structure

```
microservices-assignment/
├── docker-compose.yml          # PostgreSQL Docker setup
├── db/
│   └── init.sql               # Database initialization script
├── product-service/           # Product microservice
│   ├── src/
│   └── package.json
└── order-service/             # Order microservice
    ├── src/
    └── package.json
```

## API Endpoints

### Product Service (http://localhost:3000)

- `POST /products` - Create product
- `GET /products` - List products
- `GET /products/:id` - Get product by ID
- `PATCH /products/:id` - Update product
- `PATCH /products/:id/inventory` - Update inventory
- `DELETE /products/:id` - Soft delete product

### Order Service (http://localhost:3001)

- `POST /orders` - Create order
- `GET /orders` - List orders
- `GET /orders/:id` - Get order by ID
- `PATCH /orders/:id/status` - Update order status
- `DELETE /orders/:id` - Cancel order

## Testing the Integration

1. Create a product:
```bash
POST http://localhost:3000/products
{
  "name": "Gaming Laptop",
  "price": 999.99,
  "inventoryCount": 50
}
```

2. Create an order:
```bash
POST http://localhost:3001/orders
{
  "customerId": "CUST-001",
  "items": [
    {
      "productId": "product-uuid-from-step-1",
      "quantity": 2
    }
  ]
}
```


## 📝 Project Structure

```
microservices-assignment/
├── docker-compose.yml          # PostgreSQL Docker setup
├── db/
│   ├── init.sql                # Database initialization script
│   └── migrate-status-*.sql    # Migration scripts (if needed)
├── product-service/            # Product microservice
│   ├── src/
│   │   ├── common/
│   │   │   └── interceptors/  # HTTP logging interceptor
│   │   ├── config/             # Configuration files
│   │   ├── products/           # Products module
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── entities/       # Database entities
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   └── products.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── README.md
├── order-service/              # Order microservice
│   ├── src/
│   │   ├── common/
│   │   │   └── interceptors/  # HTTP logging interceptor
│   │   ├── config/             # Configuration files
│   │   ├── orders/             # Orders module
│   │   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── entities/       # Database entities
│   │   │   ├── orders.controller.ts
│   │   │   ├── orders.service.ts
│   │   │   └── orders.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example            # Environment variables template
│   ├── package.json
│   └── README.md
├── API_DOCUMENTATION.md        # Complete API documentation
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd microservices-assignment
```

### 2. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will:
- Start PostgreSQL 15 in a Docker container
- Automatically create `product_db` and `order_db` databases
- Expose PostgreSQL on port 5432

### 3. Setup Product Service

```bash
cd product-service
npm install
cp .env.example .env
# Edit .env with your database credentials if needed
npm run start:dev
```

Product Service will run on `http://localhost:3000`

### 4. Setup Order Service

In a new terminal:

```bash
cd order-service
npm install
cp .env.example .env
# Edit .env with your database credentials if needed
npm run start:dev
```

Order Service will run on `http://localhost:3001`
