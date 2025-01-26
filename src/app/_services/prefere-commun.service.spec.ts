import { TestBed } from '@angular/core/testing';

import { PrefereCommunService } from './prefere-commun.service';

describe('PrefereCommunService', () => {
  let service: PrefereCommunService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrefereCommunService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
