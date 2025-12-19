import { Injectable, Post, Body } from '@nestjs/common';
import { PostOrderDTO } from './dto/order.dto';
import { FilmsRepository } from '../repository/films.repository';
import { FilmUpdateType } from '../repository/film.schema';
import { randomUUID } from 'node:crypto';
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
  constructor(private readonly filmsRepository: FilmsRepository) {}
  @Post()
  async create(@Body() date: PostOrderDTO) {
    const items: TicketType[] = [];

    for (const ticket of date.tickets) {
      const { film, session, row, seat, price, daytime } = ticket;
      const seatKey = `${row}:${seat}`;

      try {
        const schedule = await this.filmsRepository.findScheduleById(
          film,
          session,
        );

        //Проверяем занятость места
        if (schedule.taken.length > 0) {
          if (schedule.taken.includes(seatKey)) {
            throw new ServerException(ErrorCode.InvalidRequest);
          }
        }

        items.push({
          film,
          session,
          daytime,
          row,
          seat,
          price,
          id: randomUUID(),
        });
      } catch (err) {
        throw err;
      }
    }
    const filmUpdates: FilmUpdateType[] = items.map((item) => ({
      film: item.film,
      session: item.session,
      taken: `${item.row}:${item.seat}`,
    }));

    await this.filmsRepository.updateFilm(filmUpdates);

    return {
      total: items.length,
      items,
    };
  }
}
