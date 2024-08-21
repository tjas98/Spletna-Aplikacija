import { TestBed } from '@angular/core/testing';

import { VnosUrnikaService } from './vnos-urnika.service';

describe('VnosUrnikaService', () => {
  let service: VnosUrnikaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VnosUrnikaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
