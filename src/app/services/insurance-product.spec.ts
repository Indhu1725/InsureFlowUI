import { TestBed } from '@angular/core/testing';

import { InsuranceProduct } from './insurance-product';

describe('InsuranceProduct', () => {
  let service: InsuranceProduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceProduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
