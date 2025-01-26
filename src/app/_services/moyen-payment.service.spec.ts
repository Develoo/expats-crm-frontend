import { TestBed } from '@angular/core/testing';

import { MoyenPaymentService } from './moyen-payment.service';

describe('MoyenPaymentService', () => {
  let service: MoyenPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoyenPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
