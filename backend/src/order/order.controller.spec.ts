import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PostOrderDTO } from './dto/order.dto';
import { FILMS_REPOSITORY } from '../repository/films.repository';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  let filmsRepositoryMock: {
    findScheduleById: jest.Mock;
    updateFilm: jest.Mock;
  };

  const mockTicket = {
    film: '51b4bc85-646d-47fc-b988-3e7051a9fe9e',
    session: 'b3ba6b69-050e-498c-9cdb-92711d8e4180',
    daytime: new Date(),
    row: 1,
    seat: 2,
    price: 350,
  };

  const mockPostOrderDTO: PostOrderDTO = {
    email: 'test@test.ru',
    phone: '+7 (000) 000-00-00',
    tickets: [mockTicket],
  };

  beforeEach(async () => {
    filmsRepositoryMock = {
      findScheduleById: jest.fn(),
      updateFilm: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: FILMS_REPOSITORY,
          useValue: filmsRepositoryMock,
        },
      ],
    })
      .overrideProvider(OrderService)
      .useValue({
        create: jest.fn(),
      })
      .compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('проверяем вызов create', () => {
      const createSpy = jest.spyOn(service, 'create');
      createSpy.mockResolvedValue({ total: 1, items: [] });
      controller.create(mockPostOrderDTO);
      expect(createSpy).toHaveBeenCalledWith(mockPostOrderDTO);
    });

    it('должен возвращать информацию о заказе при успешном создании заказа', async () => {
      // Теперь mockResolvedValue доступен!
      filmsRepositoryMock.findScheduleById.mockResolvedValue({
        taken: ['2:2'], // Место свободно
      });

      filmsRepositoryMock.updateFilm.mockResolvedValue(undefined);

      jest.spyOn(service, 'create').mockResolvedValue({
        total: 1,
        items: [
          {
            film: mockTicket.film,
            session: mockTicket.session,
            daytime: mockTicket.daytime,
            row: mockTicket.row,
            seat: mockTicket.seat,
            price: mockTicket.price,
            id: '51b4bc85-646d-47fc-b988-3e7051a9fe9e',
          },
        ],
      });

      const result = await controller.create(mockPostOrderDTO);

      expect(result).toEqual({
        total: 1,
        items: [
          {
            film: mockTicket.film,
            session: mockTicket.session,
            daytime: mockTicket.daytime,
            row: mockTicket.row,
            seat: mockTicket.seat,
            price: mockTicket.price,
            id: expect.any(String),
          },
        ],
      });
    });

    it('должен бросать ServerException при занятом месте', async () => {
      filmsRepositoryMock.findScheduleById.mockResolvedValue({
        taken: ['1:2'], // Место занято
      });

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new ServerException(ErrorCode.InvalidRequest));

      await expect(controller.create(mockPostOrderDTO)).rejects.toThrow(
        ServerException,
      );
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
});
