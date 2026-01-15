import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { OrderService } from './order.service';
import { PostOrderDTO } from './dto/order.dto';
import { ServerExceptionFilter } from '../filter/server-exception.filter';

@UseFilters(ServerExceptionFilter)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  create(@Body() data: PostOrderDTO) {
    return this.orderService.create(data);
  }
}
