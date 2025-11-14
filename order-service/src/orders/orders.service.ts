import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';

interface ProductResponse {
  id: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  inventoryCount: number;
  status: number | string; // Supports both numeric (1/0) and string ('ACTIVE'/'INACTIVE') for backward compatibility
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const productServiceUrl = this.configService.get<string>(
      'productService.baseUrl',
    );

    // Validate and fetch products from product-service
    const products: ProductResponse[] = [];
    for (const item of createOrderDto.items) {
      try {
        const response = await firstValueFrom(
          this.httpService.get<ProductResponse>(
            `${productServiceUrl}/products/${item.productId}`,
          ),
        );
        const product = response.data;

        // Validate product is active (1 = ACTIVE, 0 = INACTIVE)
        // Support both numeric (1/0) and string ('ACTIVE'/'INACTIVE') for backward compatibility
        const isActive = product.status === 1 || product.status === 'ACTIVE';
        if (!isActive) {
          throw new BadRequestException(
            `Product ${product.id} is not active`,
          );
        }

        // Validate inventory
        if (product.inventoryCount < item.quantity) {
          throw new BadRequestException(
            `Insufficient inventory for product ${product.id}. Available: ${product.inventoryCount}, Requested: ${item.quantity}`,
          );
        }

        products.push(product);
      } catch (error) {
        if (error.response?.status === 404) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }
        if (error instanceof BadRequestException) {
          throw error;
        }
        throw new HttpException(
          `Failed to fetch product ${item.productId}: ${error.message}`,
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }

    // Calculate totals
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (let i = 0; i < createOrderDto.items.length; i++) {
      const itemDto = createOrderDto.items[i];
      const product = products[i];
      const lineTotal = product.price * itemDto.quantity;
      totalAmount += lineTotal;

      const orderItem = this.orderItemRepository.create({
        productId: product.id,
        productSnapshot: {
          name: product.name,
          price: product.price,
          sku: product.sku,
        },
        quantity: itemDto.quantity,
        unitPrice: product.price,
        lineTotal,
      });

      orderItems.push(orderItem);
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = this.orderRepository.create({
      orderNumber,
      customerId: createOrderDto.customerId,
      status: OrderStatus.CREATED,
      totalAmount,
      currency: products[0]?.currency || 'USD',
      items: orderItems,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Update inventory in product-service
    for (let i = 0; i < createOrderDto.items.length; i++) {
      const itemDto = createOrderDto.items[i];
      const product = products[i];

      try {
        await firstValueFrom(
          this.httpService.patch(
            `${productServiceUrl}/products/${product.id}/inventory`,
            { quantity: -itemDto.quantity },
          ),
        );
      } catch (error) {
        // If inventory update fails, we could rollback the order
        // For now, we'll log and continue (in production, consider transaction rollback)
        console.error(
          `Failed to update inventory for product ${product.id}:`,
          error.message,
        );
      }
    }

    return savedOrder;
  }

  async findAll(
    queryDto: QueryOrdersDto,
  ): Promise<PaginatedResponse<Order>> {
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
    if (status) {
      where.status = status;
    }

    // Build order clause
    const order: any = {};
    order[sortBy] = sortOrder;

    // Get total count and data
    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where(where);

    if (search) {
      queryBuilder.andWhere(
        '(order.orderNumber ILIKE :search OR order.customerId ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    // Get data
    const data = await queryBuilder.getMany();

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

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(id);
    order.status = updateOrderStatusDto.status;
    return await this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    order.status = OrderStatus.CANCELLED;
    await this.orderRepository.save(order);
  }
}

