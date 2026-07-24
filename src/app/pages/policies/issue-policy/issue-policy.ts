import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PolicyService } from '../../../services/policy';
import { IssuePolicyRequest } from '../../../models/issue-policy-request';

@Component({
  selector: 'app-issue-policy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './issue-policy.html',
  styleUrl: './issue-policy.css'
})
export class IssuePolicy {

  issue: IssuePolicyRequest = {

    customerId: 0,

    planId: 0,

    startDate: ''

  };

  constructor(
    private policyService: PolicyService,
    private router: Router
  ) {}

  issuePolicy(): void {

    this.policyService.issuePolicy(this.issue).subscribe({

      next: () => {

        alert('Policy issued successfully.');

        this.router.navigate(['/policies']);

      },

      error: (error) => {

        console.log(error);

        alert(error.error.message);

      }

    });

  }

}