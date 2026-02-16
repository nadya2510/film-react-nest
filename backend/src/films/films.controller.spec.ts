import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import {
  GetFilmDto,
  GetScheduleDTO,
  GetAllFilmsDto,
  GetScheduleByFilmDTO,
} from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockSchedule: GetScheduleDTO[] = [
    {
      id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
      daytime: new Date(),
      hall: 0,
      rows: 5,
      seats: 10,
      price: 350,
      taken: ['2:5', '2:7'],
    },
    {
      id: '5beec101-acbb-4158-adc6-d855716b44a8',
      daytime: new Date(),
      hall: 1,
      rows: 5,
      seats: 10,
      price: 350,
      taken: [],
    },
  ];

  const mockFilms: GetFilmDto[] = [
    {
      id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      title: 'Архитекторы общества',
      about: 'Документальный фильм об ИИ',
      description: 'Полное описание фильма',
      schedule: mockSchedule,
    },
    {
      id: '51b4bc85-646d-47fc-b988-3e7051a9fe9e',
      rating: 9,
      director: 'Харрисон Рид',
      tags: ['Рекомендуемые'],
      image: '/bg3s.jpg',
      cover: '/bg3c.jpg',
      title: 'Недостижимая утопия',
      about:
        'Провокационный фильм-антиутопия, исследующий темы свободы, контроля и цены совершенства.',
      description:
        'Провокационный фильм-антиутопия режиссера Харрисона Рида. Действие фильма разворачивается в, казалось бы, идеальном обществе, и рассказывает о группе граждан, которые начинают подвергать сомнению систему. Фильм исследует темы свободы, контроля и цены совершенства.',
      schedule: [
        {
          id: '9647fcf2-d0fa-4e69-ad90-2b23cff15449',
          daytime: new Date(),
          hall: 0,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
        {
          id: '9f2db237-01d0-463e-a150-89f30bfc4250',
          daytime: new Date(),
          hall: 1,
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ],
    },
  ];

  const mockFilmsAll: GetAllFilmsDto = {
    total: mockFilms.length,
    items: mockFilms,
  };

  const mockScheduleByFilm: GetScheduleByFilmDTO = {
    total: mockSchedule.length,
    items: mockSchedule,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue({
        findAll: jest.fn(),
        findScheduleByFilmId: jest.fn(),
      })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('проверяем вызов findAll', () => {
      jest.spyOn(service, 'findAll');
      controller.getAll();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('Ответ должен содержать total and items', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockFilmsAll);

      const result = await controller.getAll();

      expect(result).toEqual({
        total: mockFilms.length,
        items: mockFilms,
      });
    });
  });

  describe('getScheduleByFilmId', () => {
    it('проверяем вызов findScheduleByFilmId', () => {
      const filmId = '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf';
      jest.spyOn(service, 'findScheduleByFilmId');

      controller.getScheduleByFilmId(filmId);

      expect(service.findScheduleByFilmId).toHaveBeenCalled();
    });
    it('Ответ должен содержать total and items', async () => {
      const filmId = mockFilms[0].id;
      jest
        .spyOn(service, 'findScheduleByFilmId')
        .mockResolvedValue(mockScheduleByFilm);

      const result = await controller.getScheduleByFilmId(filmId);

      expect(result).toEqual({
        total: mockSchedule.length,
        items: mockSchedule,
      });
    });
  });
});
