import { Injectable, Inject } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  FilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY) private readonly filmsRepository: FilmsRepository,
  ) {}
  async findAll(limit: number = 100, offset: number = 0) {
    return this.filmsRepository.findAll(limit, offset);
  }

  findScheduleByFilmId(id: string) {
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
