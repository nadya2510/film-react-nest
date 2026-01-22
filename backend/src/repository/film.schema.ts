import mongoose, { Document } from 'mongoose';

export type ScheduleType = {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
};

export type FilmType = {
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

export type FilmDocument = FilmType & Document;

export type FilmUpdateType = {
  film: string;
  session: string;
  taken: string;
};

// Явно описываем схему для GetScheduleDTO
export const ScheduleSchema = new mongoose.Schema<ScheduleType>({
  id: { type: String, required: true },
  daytime: { type: Date, required: true },
  hall: { type: Number, required: true },
  rows: { type: Number, required: true },
  seats: { type: Number, required: true },
  price: { type: Number, required: true },
  taken: { type: [String], default: [] },
});

export const Film = 'Film';

export const FilmSchema = new mongoose.Schema<FilmType>({
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
