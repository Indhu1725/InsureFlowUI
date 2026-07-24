import { TestBed } from '@angular/core/testing';

import { PremiumPayment } from './premium-payment';

describe('PremiumPayment', () => {
  let service: PremiumPayment;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumPayment);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
