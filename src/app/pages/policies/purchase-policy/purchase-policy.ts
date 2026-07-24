import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PolicyService } from '../../../services/policy';
import { PurchasePolicyRequest } from '../../../models/purchase-policy-request';

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
export class PurchasePolicy {

  purchase: PurchasePolicyRequest = {

    planId: 0,

    startDate: ''

  };

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) {}

  purchasePolicy(): void {

    this.policyService.purchasePolicy(this.purchase).subscribe({

      next: () => {

        alert('Policy purchased successfully.');

        this.router.navigate(['/policies']);

      },

      error: (error) => {

        console.log(error);

        alert(error.error.message);

      }

    });

  }

}