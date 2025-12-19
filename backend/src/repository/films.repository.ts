import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  GetFilmDto,
  GetScheduleDTO,
  GetAllFilmsDto,
  GetScheduleByFilmDTO,
} from '../films/dto/films.dto';
import {
  Film,
  FilmType,
  ScheduleType,
  FilmUpdateType,
  FilmDocument,
} from './film.schema';

@Injectable()
export class FilmsRepository {
  constructor(@InjectModel(Film) private films: Model<FilmDocument>) {}

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
      schedule: film.schedule.map((sched: ScheduleType) =>
        this.getScheduleMapperFn(sched),
      ),
    };
  }

  private getScheduleMapperFn(schedule: ScheduleType): GetScheduleDTO {
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

  async findAll(): Promise<GetAllFilmsDto> {
    let items: FilmType[] = [];
    let total = 0;
    items = await this.films.find({});
    total = items.length;
    return {
      total: total,
      items: items.map((film: FilmType) => this.getFilmMapperFn(film)),
    };
  }

  async findScheduleByFilmId(id: string): Promise<GetScheduleByFilmDTO> {
    let items: ScheduleType[] = [];
    let total = 0;
    items = (await this.films.findOne({ id })).schedule;
    total = items.length;
    return {
      total: total,
      items: items.map((schedule: ScheduleType) =>
        this.getScheduleMapperFn(schedule),
      ),
    };
  }

  async findScheduleById(
    idFilm: string,
    idSchedule: string,
  ): Promise<GetScheduleDTO> {
    const schedules = (await this.films.findOne({ id: idFilm })).schedule;
    return schedules.find(
      (schedule: ScheduleType) => schedule.id === idSchedule,
    );
  }

  async updateFilm(date: FilmUpdateType[]): Promise<void> {
    for (const item of date) {
      const { film, session, taken } = item;
      await this.films.findOneAndUpdate(
        {
          id: film,
          'schedule.id': session,
        },
        {
          $push: {
            'schedule.$.taken': taken,
          },
        },
      );
    }
  }
}
