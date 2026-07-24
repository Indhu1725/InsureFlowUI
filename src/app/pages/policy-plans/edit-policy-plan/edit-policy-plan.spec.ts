import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPolicyPlan } from './edit-policy-plan';

describe('EditPolicyPlan', () => {
  let component: EditPolicyPlan;
  let fixture: ComponentFixture<EditPolicyPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPolicyPlan],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPolicyPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
