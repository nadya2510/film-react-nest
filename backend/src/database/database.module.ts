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
          useFactory: (config: ConfigService) => {
            const user = config.get<string>('DATABASE_USERNAME');
            const password = config.get<string>('DATABASE_PASSWORD');
            const database = config.get<string>('DATABASE_NAME');
            const host = config.get<string>('DATABASE_HOST') || 'localhost';
            const port = config.get<number>('DATABASE_PORT') || 5432;

            if (!user || !password || !database) {
              throw new Error(
                'Для PostgreSQL требуются: DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME',
              );
            }

            return {
              type: 'postgres',
              host,
              port,
              username: user,
              password: password,
              database: database,
              synchronize: false,
              entities: [FilmEntity, ScheduleEntity],
            };
          },
        }),
        TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
      ];
    }

    if (driver === 'mongodb') {
      return [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => {
            const url = config.get<string>('DATABASE_URL');
            if (!url) {
              throw new Error('Для MongoDB требуется DATABASE_URL');
            }

            return {
              uri: url,
              useNewUrlParser: true,
              useUnifiedTopology: true,
            };
          },
        }),
        MongooseModule.forFeature([{ name: Film, schema: FilmSchema }]),
      ];
    }   
  }

  static getDriver(): string {
    const config = new ConfigService();
    return config.get<string>('DATABASE_DRIVER', '');
  }

  static getImport(): DynamicModule {
    const driver = this.getDriver();
    switch (driver) {
      case 'postgres':
        return TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]);
      case 'mongodb':
        return MongooseModule.forFeature([{ name: Film, schema: FilmSchema }]);
      default:
        throw new Error(`Неподдерживаемый драйвер БД: ${driver}`);
    }
  }
}
