import { TestBed } from '@angular/core/testing';

import { dbSqliteService } from './db-sqlite.service';

describe('DbSqliteService', () => {
  let service: dbSqliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(dbSqliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
