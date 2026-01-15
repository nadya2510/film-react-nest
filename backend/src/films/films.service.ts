import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}
  async findAll(limit: number = 100, offset: number = 0) {
    return this.filmsRepository.findAll( limit,offset);
  }

  findScheduleByFilmId(id: string) {
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
