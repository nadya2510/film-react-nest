import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetFilmDto,
  GetScheduleDTO,
  GetAllFilmsDto,
  GetScheduleByFilmDTO,
} from '../../films/dto/films.dto';
import { FilmType, ScheduleType, FilmUpdateType } from '../film.schema';
import { FilmEntity } from '../../films/entities/films.entity';
import { ScheduleEntity } from '../../films/entities/schedule.entity';
import { FilmsRepository } from '../films.repository';

@Injectable()
export class FilmsRepositoryPostgre implements FilmsRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FilmEntity)
    private filmsRepository: Repository<FilmEntity>,
  ) {}

  private getFilmMapperFn(film: FilmType): GetFilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: (film.schedule || []).map((sched: ScheduleType) =>
        this.getScheduleMapperFn(sched),
      ),
    };
  }

  private getScheduleMapperFn(schedule: ScheduleType): GetScheduleDTO {
    // Защита от undefined
    if (!schedule) {
      return null;
    }
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }

  async findAll(
    limit: number = 100,
    offset: number = 0,
  ): Promise<GetAllFilmsDto> {
    const items =
      (await this.filmsRepository.find({
        relations: ['schedule'],
        skip: offset,
        take: limit,
      })) || [];

    return {
      total: items.length,
      items: items.map((film: FilmType) => this.getFilmMapperFn(film)),
    };
  }

  async findScheduleByFilmId(id: string): Promise<GetScheduleByFilmDTO> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    // Проверка: если фильм не найден
    if (!film) {
      return {
        total: 0,
        items: [],
      };
    }

    const scheduleItems = film.schedule || [];

    return {
      total: scheduleItems.length,
      items: scheduleItems.map((schedule: ScheduleType) =>
        this.getScheduleMapperFn(schedule),
      ),
    };
  }

  async findScheduleById(
    idFilm: string,
    idSchedule: string,
  ): Promise<GetScheduleDTO> {
    const film = await this.filmsRepository.findOne({
      where: { id: idFilm },
      relations: ['schedule'],
    });

    // Проверка: если фильм не найден
    if (!film || !film.schedule) {
      return null;
    }

    const schedules = film.schedule;
    const foundSchedule = schedules.find(
      (schedule: ScheduleType) => schedule.id === idSchedule,
    );

    // Если сеанс не найден
    if (!foundSchedule) {
      return null;
    }

    return this.getScheduleMapperFn(foundSchedule);
  }

  async updateFilm(data: FilmUpdateType[]): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const item of data) {      
        const schedule = await queryRunner.manager.findOne(ScheduleEntity, {
          where: {
            id: item.session,
          },
        });

        if (!schedule.taken.includes(item.taken)) {
          schedule.taken.push(item.taken);
        }
        await queryRunner.manager.save(schedule);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
