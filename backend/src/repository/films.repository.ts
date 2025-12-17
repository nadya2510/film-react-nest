import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import {
  GetFilmDto,
  GetScheduleDTO,
  GetAllFilmsDto,
  GetScheduleByFilmDTO,
} from '../films/dto/films.dto';

type ScheduleType = {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

type FilmType = {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: ScheduleType[];
};

export type FilmUpdateType = {
  film: string;
  session: string;
  taken: string;
};

// Явно описываем схему для GetScheduleDTO
const ScheduleSchema = new mongoose.Schema<ScheduleType>({
  id: { type: String, required: true },
  daytime: { type: Date, required: true },
  hall: { type: Number, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], default: [] },
});

const FilmSchema = new mongoose.Schema<FilmType>({
  id: { type: String, required: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },
  tags: { type: [String], default: [] },
  image: { type: String, required: true },
  cover: { type: String, required: true },
  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },
  schedule: { type: [ScheduleSchema], default: [] },
});

@Injectable()
export class FilmsRepository {
  private films = mongoose.model('Film', FilmSchema);
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
    let items:FilmType[] = []; 
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
      items: items.map((schedule: ScheduleType) => this.getScheduleMapperFn(schedule)),
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
