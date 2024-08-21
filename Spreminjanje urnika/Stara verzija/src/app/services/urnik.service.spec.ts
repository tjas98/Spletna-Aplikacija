import { TestBed } from '@angular/core/testing';

import { UrnikService } from './urnik.service';

describe('UrnikService', () => {
  let service: UrnikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrnikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
