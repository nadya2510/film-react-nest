import { Injectable, Inject } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';
import { LoggerApp } from '../logger/logger.service';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: FilmsRepository,
    private readonly logger: LoggerApp,
  ) {}
  async findAll(limit: number = 100, offset: number = 0) {
    this.logger.log(
      `query  get: /films: limit=${limit}, offset=${offset}`,
      'FilmsService',
    );
    return this.filmsRepository.findAll(limit, offset);
  }

  findScheduleByFilmId(id: string) {
    this.logger.log(`query get: /films/${id}/schedule/ `, 'FilmsService');
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
