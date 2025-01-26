import { TestBed } from '@angular/core/testing';

import { MarquePrefereService } from './marque-prefere.service';

describe('MarquePrefereService', () => {
  let service: MarquePrefereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarquePrefereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
