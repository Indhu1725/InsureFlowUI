import { Component, signal, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PolicyService } from '../../../services/policy';
import { IssuePolicyRequest } from '../../../models/issue-policy-request';
import { CustomerService } from '../../../services/customer';
import { PolicyPlanService } from '../../../services/policy-plan';
import { PolicyPlan } from '../../../models/policy-plan';

@Component({
  selector: 'app-issue-policy',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './issue-policy.html',
  styleUrl: './issue-policy.css'
})
export class IssuePolicy implements OnInit{

  issue = signal<IssuePolicyRequest>({
    customerId: 0,
    planId: 0,
    startDate: ''
  });

  isLoading = signal(false);
  customers = signal<any[]>([]);
  plans = signal<PolicyPlan[]>([]);

 constructor(
  private policyService: PolicyService,
  private customerService: CustomerService,
  private policyPlanService: PolicyPlanService,
  private router: Router,
  private toastr: ToastrService
) {}
ngOnInit(): void {

  this.loadCustomers();

  this.loadPlans();

}
loadCustomers(): void {

  this.customerService
    .getActiveCustomers()
    .subscribe({

      next: (response) => {

        this.customers.set(response.data);

      },

      error: () => {

        this.toastr.error(
          'Unable to load customers.'
        );

      }

    });

}
loadPlans(): void {

  this.policyPlanService
    .getActivePlans()
    .subscribe({

      next: (response) => {

        this.plans.set(response.data);

      },

      error: () => {

        this.toastr.error(
          'Unable to load policy plans.'
        );

      }

    });

}

  issuePolicy(): void {

    const request = this.issue();

    if (
      request.customerId <= 0 ||
      request.planId <= 0 ||
      !request.startDate
    ) {

      this.toastr.warning('Please fill in all required fields.','Validation');

      return;

    }

    this.isLoading.set(true);

    this.policyService.issuePolicy(request).subscribe({

      next: () => {

        this.isLoading.set(false);

        this.toastr.success('Policy issued successfully.','Success');

        this.router.navigate(['/policies']);

      },

      error: (error) => {

        this.isLoading.set(false);

        this.toastr.error(error.error?.message || 'Unable to issue policy.','Error');

      }

    });

  }

}