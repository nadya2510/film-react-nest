import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsString,
  IsNumber,
  IsArray,
  IsPositive,
  IsISO8601,
} from 'class-validator';
import { FilmEntity } from './films.entity';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsISO8601()
  @Column({ type: 'timestamptz' })
  daytime: Date;

  @IsNumber()
  @Column('integer')
  hall: number;

  @IsNumber()
  @Column('integer')
  rows: number;

  @IsNumber()
  @Column('integer')
  seats: number;

  @IsNumber()
  @IsPositive()
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @IsArray()
  @IsString()
  @Column('text', { array: true, nullable: true, default: [] })
  taken: string[];

  @ManyToOne(() => FilmEntity, (film) => film.schedule)
  @JoinColumn({ name: 'film_id' })
  film: FilmEntity;
}
