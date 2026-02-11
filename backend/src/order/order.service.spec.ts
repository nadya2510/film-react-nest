import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { FILMS_REPOSITORY } from '../repository/films.repository';
import { LoggerApp } from '../logger/logger.service';

// Моки для зависимостей
const mockFilmsRepository = {
  findScheduleById: jest.fn(),
  updateFilm: jest.fn(),
};

const mockLoggerApp = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: FILMS_REPOSITORY,
          useValue: mockFilmsRepository,
        },
        {
          provide: LoggerApp,
          useValue: mockLoggerApp,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
