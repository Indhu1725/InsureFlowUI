import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ClaimService } from '../../../services/claim';
import { PolicyService } from '../../../services/policy';

import { PolicyResponse } from '../../../models/policy-response';
import { ClaimRequest } from '../../../models/claim-request';
import { SupportingDocument } from '../../../models/supporting-document';

@Component({
  selector: 'app-add-claim',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './add-claim.html',
  styleUrl: './add-claim.css'
})
export class AddClaim implements OnInit {

  policies: PolicyResponse[] = [];

  claim: ClaimRequest = {

    policyId: 0,

    claimAmount: 0,

    claimReason: '',

    incidentDate: '',

    supportingDocuments: []

  };

  constructor(

    private claimService: ClaimService,

    private policyService: PolicyService,

    private router: Router

  ) { }

  ngOnInit(): void {

    this.loadPolicies();

    this.addDocument();

  }

  loadPolicies(): void {

  this.policyService.getMyPolicies().subscribe({

    next: (response) => {

      console.log('My Policies Response:', response);

      this.policies = response.data;

      console.log('Policies Array:', this.policies);

    },

    error: (error) => {

      console.log('Policy API Error:', error);

      alert(JSON.stringify(error.error));

    }

  });

}

  addDocument(): void {

    const document: SupportingDocument = {

      documentName: '',

      documentType: '',

      documentReference: ''

    };

    this.claim.supportingDocuments.push(document);

  }

  removeDocument(index: number): void {

    this.claim.supportingDocuments.splice(index, 1);

  }

  submitClaim(): void {

    this.claimService.createClaim(this.claim).subscribe({

      next: () => {

        alert('Claim submitted successfully.');

        this.router.navigate(['/claims']);

      },

      error: (error) => {

        console.log(error);

        alert('Failed to submit claim.');

      }

    });

  }

}