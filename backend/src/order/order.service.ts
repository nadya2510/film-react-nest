import { Injectable, Body, Inject } from '@nestjs/common';
import { PostOrderDTO } from './dto/order.dto';
import {
  FilmsRepository,
  FILMS_REPOSITORY,
} from '../repository/films.repository';
import { FilmUpdateType } from '../repository/film.schema';
import { randomBytes } from 'crypto';
import { ServerException } from '../exceptions/server.exception';
import { ErrorCode } from '../exceptions/error-codes';

type TicketType = {
  film: string;
  session: string;
  daytime: Date;
  row: number;
  seat: number;
  price: number;
  id: string;
};

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly filmsRepository: FilmsRepository,
  ) {}

  async create(@Body() data: PostOrderDTO) {
    const items: TicketType[] = [];
    const filmUpdates: FilmUpdateType[] = [];

    for (const ticket of data.tickets) {
      const { film, session, row, seat, price, daytime } = ticket;
      const seatKey = `${row}:${seat}`;

      const schedule = await this.filmsRepository.findScheduleById(
        film,
        session,
      );

      if (!schedule || (schedule.taken && schedule.taken.includes(seatKey))) {
        throw new ServerException(ErrorCode.InvalidRequest);
      }

      items.push({
        film,
        session,
        daytime,
        row,
        seat,
        price,
        id: randomBytes(16).toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5'),
      });

      filmUpdates.push({
        film: film,
        session: session,
        taken: seatKey,
      });
    }

    try {
      await this.filmsRepository.updateFilm(filmUpdates);
    } catch (err) {
      // Если обновление не удалось — бросаем ошибку, ничего не сохранилось
      throw new ServerException(ErrorCode.InvalidRequest);
    }
    return {
      total: items.length,
      items,
    };
  }
}
