import { Test, TestingModule } from '@nestjs/testing';
import { FilmsRepositoryMongodb } from './films.repository';

describe('FilmsMongodbRepository', () => {
  let provider: FilmsRepositoryMongodb;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilmsRepositoryMongodb],
    }).compile();

    provider = module.get<FilmsRepositoryMongodb>(FilmsRepositoryMongodb);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
