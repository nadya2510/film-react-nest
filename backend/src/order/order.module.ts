import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { FilmsModule } from '../films/films.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [FilmsModule, DatabaseModule.forRoot()],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
