import { TestBed } from '@angular/core/testing';

import { NumUrgenceServiceService } from './num-urgence-service.service';

describe('NumUrgenceServiceService', () => {
  let service: NumUrgenceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumUrgenceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
