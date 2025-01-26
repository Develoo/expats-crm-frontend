import { TestBed } from '@angular/core/testing';

import { OpeninhoursService } from './openinhours.service';

describe('OpeninhoursService', () => {
  let service: OpeninhoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpeninhoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
