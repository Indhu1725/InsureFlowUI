import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimDecision } from './claim-decision';

describe('ClaimDecision', () => {
  let component: ClaimDecision;
  let fixture: ComponentFixture<ClaimDecision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaimDecision],
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimDecision);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
