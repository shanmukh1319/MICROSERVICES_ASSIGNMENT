import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Generate a unique SKU based on product name
   */
  private async generateSku(productName: string): Promise<string> {
    // Create base SKU from product name (uppercase, remove special chars, limit length)
    const baseSku = productName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10)
      .padEnd(4, 'X'); // Ensure minimum 4 chars

    // Add timestamp and random string for uniqueness
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    let sku = `${baseSku}-${timestamp}-${random}`;

    // Ensure SKU is unique
    let attempts = 0;
    while (attempts < 10) {
      const existing = await this.productRepository.findOne({
        where: { sku },
      });

      if (!existing) {
        return sku;
      }

      // If SKU exists, generate a new one
      const newRandom = Math.random().toString(36).substring(2, 6).toUpperCase();
      sku = `${baseSku}-${timestamp}-${newRandom}`;
      attempts++;
    }

    // Fallback: use UUID-like format if all attempts fail
    return `PROD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Generate unique SKU automatically
    const sku = await this.generateSku(createProductDto.name);

    const product = this.productRepository.create({
      ...createProductDto,
      sku,
      currency: createProductDto.currency || 'USD',
      inventoryCount: createProductDto.inventoryCount || 0,
      status: createProductDto.status !== undefined ? createProductDto.status : ProductStatus.ACTIVE,
    });

    return await this.productRepository.save(product);
  }

  async findAll(
    queryDto: QueryProductsDto,
  ): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      status,
    } = queryDto;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    // Status filter
    if (status !== undefined) {
      where.status = status;
    }

    // Search functionality
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    // Build order clause
    const order: any = {};
    order[sortBy] = sortOrder;

    // Get total count for pagination
    const [data, total] = await this.productRepository.findAndCount({
      where: search
        ? [
            { ...where, name: ILike(`%${search}%`) },
            { ...where, sku: ILike(`%${search}%`) },
            { ...where, description: ILike(`%${search}%`) },
          ]
        : where,
      order,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySku(sku: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { sku } });

    if (!product) {
      throw new NotFoundException(`Product with SKU ${sku} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Check SKU uniqueness if SKU is being updated
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productRepository.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (existingProduct) {
        throw new ConflictException(`Product with SKU ${updateProductDto.sku} already exists`);
      }
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async updateInventory(
    id: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    const newInventoryCount = product.inventoryCount + updateInventoryDto.quantity;

    if (newInventoryCount < 0) {
      throw new BadRequestException(
        `Insufficient inventory. Current inventory: ${product.inventoryCount}, requested change: ${updateInventoryDto.quantity}`,
      );
    }

    product.inventoryCount = newInventoryCount;
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.status = ProductStatus.INACTIVE;
    await this.productRepository.save(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}

