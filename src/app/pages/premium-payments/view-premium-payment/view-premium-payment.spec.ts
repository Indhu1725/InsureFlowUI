import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPremiumPayment } from './view-premium-payment';

describe('ViewPremiumPayment', () => {
  let component: ViewPremiumPayment;
  let fixture: ComponentFixture<ViewPremiumPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPremiumPayment],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewPremiumPayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
