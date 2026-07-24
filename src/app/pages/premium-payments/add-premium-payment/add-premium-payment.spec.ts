import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPremiumPayment } from './add-premium-payment';

describe('AddPremiumPayment', () => {
  let component: AddPremiumPayment;
  let fixture: ComponentFixture<AddPremiumPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPremiumPayment],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPremiumPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
