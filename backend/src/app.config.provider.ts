import { ConfigModule } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  useValue: {
    database: {
      driver: process.env.DATABASE_DRIVER || 'mongodb',
      url: process.env.DATABASE_URL,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10),
    },
    logFormat: process.env.LOG_FORMAT || 'dev',
  },
};

export type TypFormat = 'dev' | 'json' | 'tskv';

export interface AppConfig {
  database: AppConfigDatabase;
  logFormat: TypFormat;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  user: string;
  password: string;
  database: string;
  host: string;
  port: number;
}
