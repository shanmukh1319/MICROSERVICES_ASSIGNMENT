import { registerAs } from '@nestjs/config';

export default registerAs('productService', () => ({
  baseUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3000',
  timeout: parseInt(process.env.PRODUCT_SERVICE_TIMEOUT, 10) || 5000,
}));

