import { TestBed } from '@angular/core/testing';

import { ReseauSociauxService } from './reseau-sociaux.service';

describe('ReseauSociauxService', () => {
  let service: ReseauSociauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReseauSociauxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
