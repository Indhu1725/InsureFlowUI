import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClaim } from './view-claim';

describe('ViewClaim', () => {
  let component: ViewClaim;
  let fixture: ComponentFixture<ViewClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClaim],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewClaim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
