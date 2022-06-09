import { TestBed } from '@angular/core/testing';

import { DbSqliteService } from './db-sqlite.service';

describe('DbSqliteService', () => {
  let service: DbSqliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbSqliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
