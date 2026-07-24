import { TestBed } from '@angular/core/testing';

import { PolicyPlan } from './policy-plan';

describe('PolicyPlan', () => {
  let service: PolicyPlan;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PolicyPlan);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
