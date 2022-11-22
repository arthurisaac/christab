import { TestBed } from '@angular/core/testing';

import { TypeFonctionService } from './type-fonction.service';

describe('TypeFonctionService', () => {
  let service: TypeFonctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeFonctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
