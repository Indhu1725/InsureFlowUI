import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaim } from './add-claim';

describe('AddClaim', () => {
  let component: AddClaim;
  let fixture: ComponentFixture<AddClaim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClaim],
    }).compileComponents();

    fixture = TestBed.createComponent(AddClaim);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
