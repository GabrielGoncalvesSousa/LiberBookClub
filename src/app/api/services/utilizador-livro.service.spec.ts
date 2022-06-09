import { TestBed } from '@angular/core/testing';

import { UtilizadorLivroService } from './utilizador-livro.service';

describe('UtilizadorLivroService', () => {
  let service: UtilizadorLivroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilizadorLivroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
