import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString, IsNumber, IsArray } from 'class-validator';
import { ScheduleEntity } from './schedule.entity';

@Entity('film')
export class FilmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @IsNumber()
  @Column()
  rating: number;

  @IsString()
  @Column()
  director: string;

  @IsArray()
  @IsString()
  @Column('text', { array: true })
  tags: string[];

  @IsString()
  @Column()
  image: string;

  @IsString()
  @Column()
  cover: string;

  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column()
  about: string;

  @IsString()
  @Column()
  description: string;

  @OneToMany(() => ScheduleEntity, (schedule) => schedule.film, {
    cascade: true, // автоматически сохраняет/обновляет/удаляет связанные сущности
    onDelete: 'CASCADE', // при удалении родителя удаляются связанные записи
    onUpdate: 'CASCADE', // при обновлении — обновляются связанные записи
  })
  schedule: ScheduleEntity[];
}
