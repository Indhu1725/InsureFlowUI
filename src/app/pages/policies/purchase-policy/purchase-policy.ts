import { Component, signal, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PolicyService } from '../../../services/policy';
import { PurchasePolicyRequest } from '../../../models/purchase-policy-request';
import { PolicyPlanService } from '../../../services/policy-plan';
import { PolicyPlan } from '../../../models/policy-plan';

@Component({
  selector: 'app-purchase-policy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './purchase-policy.html',
  styleUrl: './purchase-policy.css'
})
export class PurchasePolicy implements OnInit {

  purchase = signal<PurchasePolicyRequest>({
    planId: 0,
    startDate: ''
  });

  isLoading = signal(false);
  plans = signal<PolicyPlan[]>([]);

  constructor(
  private policyService: PolicyService,
  private policyPlanService: PolicyPlanService,
  private router: Router,
  private toastr: ToastrService
) {}

ngOnInit(): void {
  this.loadPlans();
}

loadPlans(): void {
  this.policyPlanService.getActivePlans().subscribe({
    next: (response) => {
      this.plans.set(response.data);
    },
    error: () => {
      this.toastr.error('Unable to load policy plans.');
    }
  });
}

  purchasePolicy(): void {

    const request = this.purchase();

    // Validation
    if (
      request.planId <= 0 ||
      !request.startDate
    ) {

      this.toastr.warning(
        'Please fill in all required fields.',
        'Validation'
      );

      return;
    }

    this.isLoading.set(true);

    this.policyService.purchasePolicy(request).subscribe({

      next: () => {

        this.isLoading.set(false);

        this.toastr.success(
          'Policy purchased successfully.',
          'Success'
        );

        this.router.navigate(['/policies']);

      },

      error: (error) => {

        this.isLoading.set(false);

        this.toastr.error(
          error.error?.message || 'Unable to purchase policy.',
          'Error'
        );

      }

    });

  }

}