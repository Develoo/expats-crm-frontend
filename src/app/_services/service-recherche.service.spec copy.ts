import { TestBed } from '@angular/core/testing';

import { ServiceRechercheService } from './service-recherche.service';

describe('ServiceRechercheService', () => {
  let service: ServiceRechercheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRechercheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
