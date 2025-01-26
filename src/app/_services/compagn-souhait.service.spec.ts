import { TestBed } from '@angular/core/testing';

import { CompagnSouhaitService } from './compagn-souhait.service';

describe('CompagnSouhaitService', () => {
  let service: CompagnSouhaitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompagnSouhaitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
