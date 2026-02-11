import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { DatabaseModule } from '../database/database.module';
import { getRepository } from '../repository/films.repository';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [DatabaseModule.getImport(), LoggerModule],
  controllers: [FilmsController],
  providers: [FilmsService, getRepository()],
  exports: [FilmsService, getRepository()],
})
export class FilmsModule {}
