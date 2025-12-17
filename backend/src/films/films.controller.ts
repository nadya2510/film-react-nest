import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { FilmsService } from './films.service';
import { ServerExceptionFilter } from '../filter/server-exception.filter';

@UseFilters(ServerExceptionFilter)
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}
  @Get('/')
  getAll() {
    return this.filmsService.findAll();
  }

  @Get('/:id/schedule')
  getScheduleByFilmId(@Param('id') id: string) {
    return this.filmsService.findScheduleByFilmId(id);
  }
}
