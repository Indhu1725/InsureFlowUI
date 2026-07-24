import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewClaim } from './review-claim';

describe('ReviewClaim', () => {
  let component: ReviewClaim;
  let fixture: ComponentFixture<ReviewClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewClaim],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewClaim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
