import { TestBed } from '@angular/core/testing';

import { CentreIntereService } from './centre-intere.service';

describe('CentreIntereService', () => {
  let service: CentreIntereService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentreIntereService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
