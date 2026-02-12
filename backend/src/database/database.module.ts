import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilmEntity } from '../films/entities/films.entity';
import { ScheduleEntity } from '../films/entities/schedule.entity';
import { Film, FilmSchema } from '../repository/film.schema';
import { getRepository } from '../repository/films.repository';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    const driver = this.getDriver();
    const databaseImports = this.getDatabaseImports(driver);
    const providers = getRepository();
    const exports = getRepository();

    return {
      module: DatabaseModule,
      imports: [ConfigModule, ...databaseImports],
      providers: [providers],
      exports: [exports],
    };
  }

  static getDatabaseImports(driver: string): DynamicModule[] {
    if (driver === 'postgres') {
      return [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DATABASE_HOST') || 'localhost',
            port: config.get<number>('DATABASE_PORT') || 5432,
            username: config.get<string>('DATABASE_USERNAME'),
            password: config.get<string>('DATABASE_PASSWORD'),
            database: config.get<string>('DATABASE_NAME'),
            synchronize: false,
            entities: [FilmEntity, ScheduleEntity],
          }),
        }),
        this.getImport(),
      ];
    } else {
      return [
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            uri:
              configService.get<string>('DATABASE_URL') ||
              'mongodb://localhost:27017/afisha',
          }),
        }),
        this.getImport(),
      ];
    }
  }

  static getDriver(): string {
    const config = new ConfigService();
    return config.get<string>('DATABASE_DRIVER', '');
  }

  static getImport(): DynamicModule {
    const driver = this.getDriver();
    if (driver === 'postgres') {
      return TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]);
    } else {
      return MongooseModule.forFeature([{ name: Film, schema: FilmSchema }]);
    }
  }
}
