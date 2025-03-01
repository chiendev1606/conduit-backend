import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseServices } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseServices;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseServices],
    }).compile();

    service = module.get<DatabaseServices>(DatabaseServices);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
