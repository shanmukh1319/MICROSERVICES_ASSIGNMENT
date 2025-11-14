-- Create databases for microservices
CREATE DATABASE product_db;
CREATE DATABASE order_db;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE product_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE order_db TO postgres;

