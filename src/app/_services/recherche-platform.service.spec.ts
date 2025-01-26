import { TestBed } from '@angular/core/testing';

import { RecherchePlatformService } from './recherche-platform.service';

describe('RecherchePlatformService', () => {
  let service: RecherchePlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecherchePlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
