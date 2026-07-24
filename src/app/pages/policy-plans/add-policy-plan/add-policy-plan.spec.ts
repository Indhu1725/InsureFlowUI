import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPolicyPlan } from './add-policy-plan';

describe('AddPolicyPlan', () => {
  let component: AddPolicyPlan;
  let fixture: ComponentFixture<AddPolicyPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPolicyPlan],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPolicyPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
