import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FILMS_REPOSITORY } from '../repository/films.repository';
import { LoggerApp } from '../logger/logger.service';

// Моки для зависимостей
const mockFilmsRepository = {
  findAll: jest.fn(),
  findScheduleByFilmId: jest.fn(),
};

const mockLoggerApp = {
  log: jest.fn(),
};

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
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

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
