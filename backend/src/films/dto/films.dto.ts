import {
  IsNumber,
  IsISO8601,
  IsPositive,
  IsString,
  IsArray,
} from 'class-validator';
export class GetFilmDto {
  @IsString()
  id: string;
  @IsNumber()
  rating: number;
  @IsString()
  director: string;
  @IsArray()
  @IsString({ each: true })
  tags: string[];
  @IsString()
  image: string;
  @IsString()
  cover: string;
  @IsString()
  title: string;
  @IsString()
  about: string;
  @IsString()
  description: string;
  @IsArray()
  schedule: GetScheduleDTO[];
}

export class GetScheduleDTO {
  @IsString()
  id: string;
  @IsISO8601()
  daytime: Date;
  @IsNumber()
  hall: number;
  @IsNumber()
  rows: number;
  @IsNumber()
  seats: number;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsArray()
  @IsString({ each: true })
  taken: string[]; //["3:3", "1:4", "1:5", "1:3", "1:2"] ${row}:${seat}
}

export class GetAllFilmsDto {
  @IsNumber()
  @IsPositive()
  total: number;
  @IsArray()
  items: GetFilmDto[];
}

export class GetScheduleByFilmDTO {
  @IsNumber()
  @IsPositive()
  total: number;
  @IsArray()
  items: GetScheduleDTO[];
}
