import { Provider } from '@nestjs/common';
import {
  GetScheduleDTO,
  GetAllFilmsDto,
  GetScheduleByFilmDTO,
} from '../films/dto/films.dto';
import { FilmUpdateType } from './film.schema';
import { FilmsRepositoryMongodb } from './mongodb/films.repository';
import { FilmsRepositoryPostgre } from './postgres/films.repository';
import { DatabaseModule } from '../database/database.module';

export interface FilmsRepository {
  findAll(limit: number, offset: number): Promise<GetAllFilmsDto>;
  findScheduleByFilmId(id: string): Promise<GetScheduleByFilmDTO>;
  findScheduleById(idFilm: string, idSchedule: string): Promise<GetScheduleDTO>;
  updateFilm(data: FilmUpdateType[]): Promise<void>;
}

export const FILMS_REPOSITORY = 'FilmsRepository';

export const getRepository = (): Provider => {
  const driver = DatabaseModule.getDriver();
  switch (driver) {
    case 'postgres':
      return { provide: FILMS_REPOSITORY, useClass: FilmsRepositoryPostgre };
    case 'mongodb':
      return { provide: FILMS_REPOSITORY, useClass: FilmsRepositoryMongodb };
    default:
      throw new Error(`Неподдерживаемый драйвер БД: ${driver}`);
  }
};
