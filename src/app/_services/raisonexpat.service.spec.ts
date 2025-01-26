import { TestBed } from '@angular/core/testing';

import { RaisonexpatService } from './raisonexpat.service';

describe('RaisonexpatService', () => {
  let service: RaisonexpatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaisonexpatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
