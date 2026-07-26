import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../../services/claim';
import { PolicyService } from '../../../services/policy';
import { PolicyResponse } from '../../../models/policy-response';
import { ClaimRequest } from '../../../models/claim-request';
import { SupportingDocument } from '../../../models/supporting-document';
import { ClaimDocumentRequest } from '../../../models/claim-document-request';

@Component({
  selector: 'app-add-claim',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './add-claim.html',
  styleUrl: './add-claim.css'
})
export class AddClaim implements OnInit {

  policies = signal<PolicyResponse[]>([]);

  claim: ClaimRequest = {

    policyId: 0,

    claimAmount: 0,

    claimReason: '',

    incidentDate: ''

  };

  documents: SupportingDocument[] = [];
  constructor(
    private claimService: ClaimService,
    private policyService: PolicyService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    this.loadPolicies();
 
    this.addDocument();

  }

  loadPolicies(): void {

    this.policyService.getMyPolicies().subscribe({

      next: (response) => {

        console.log('Policies:', response);

        this.policies.set(response.data);

      },

      error: (error) => {

        console.error('Failed to load policies:',error);

        this.toastr.error('Failed to load policies.');

      }

    });

  }

  addDocument(): void {

    const document: SupportingDocument = {

      documentName: '',

      documentType: '',

      documentReference: null

    };

    this.documents.push(document);

  }

  removeDocument(index: number): void {

    if (this.documents.length === 1) {

      return;

    }

    this.documents.splice(index, 1);

  }

  onFileSelected(
    event: Event,
    index: number
  ): void {

    const input =
      event.target as HTMLInputElement;
    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }
    // Get selected file
    const file = input.files[0];
    this.documents[index].documentReference = file;

    console.log('Selected file:',file.name);

  }

 submitClaim(): void {

  // Validate policy
  if (this.claim.policyId === 0) {

    this.toastr.warning('Please select a policy.');
    return;

  }

  // Validate claim amount
  if (this.claim.claimAmount <= 0) {

    this.toastr.warning('Please enter a valid claim amount.');
    return;

  }

  // Validate incident date
  if (!this.claim.incidentDate) {

    this.toastr.warning('Please select the incident date.');
    return;

  }

  // Validate claim reason
  if (!this.claim.claimReason.trim()) {

    this.toastr.warning('Please enter the claim reason.');
    return;

  }

  // At least one document required
  if (this.documents.length === 0) {

    this.toastr.warning(
      'Please add at least one supporting document.'
    );

    return;

  }

  // Validate every document
  for (let i = 0; i < this.documents.length; i++) {

    const document = this.documents[i];

    if (!document.documentName.trim()) {

      this.toastr.warning(
        `Please enter document name for document ${i + 1}.`
      );

      return;

    }

    if (!document.documentType.trim()) {

      this.toastr.warning(
        `Please enter document type for document ${i + 1}.`
      );

      return;

    }

    if (!document.documentReference) {

      this.toastr.warning(
        `Please select a file for document ${i + 1}.`
      );

      return;

    }

  }

  // Create claim first
  this.claimService.createClaim(this.claim).subscribe({

    next: (response) => {

      console.log(
        'Claim created successfully:',
        response
      );

      const claimId = response.data?.claimId;

      if (!claimId || claimId <= 0) {

        this.toastr.error(
          'Claim created but Claim ID was not returned.'
        );

        return;

      }

      // Upload documents after claim creation
      this.uploadDocuments(claimId, 0);

    },

    error: (error) => {

      console.error(
        'Create claim error:',
        error
      );

      this.toastr.error(
        error?.error?.message ||
        'Failed to submit claim.'
      );

    }

  });

}

  uploadDocuments(
    claimId: number,
    index: number
  ): void {
    const documents = this.documents;

    if (index >= documents.length) {

      this.toastr.success('Claim and documents submitted successfully.');

      this.router.navigate(['/claims']);

      return;

    }
    const document = documents[index];

    if (!document.documentReference) {

      this.toastr.error(`Please select a file for document ${index + 1}.`);

      return;

    }

    const request: ClaimDocumentRequest = {

      claimId: claimId,

      documentName:document.documentName,

      documentType:document.documentType,

      documentReference:document.documentReference

    };

    console.log(`Uploading document ${index + 1}:`,request.documentReference.name);

    this.claimService
      .uploadDocument(request)
      .subscribe({

        next: (response) => {

          console.log(`Document ${index + 1} uploaded successfully:`,response);
          // Upload next document
          this.uploadDocuments(

            claimId,

            index + 1

          );

        },


        error: (error) => {

          console.error(`Document ${index + 1} upload error:`,error);
          this.toastr.error(error?.error?.message ||`Failed to upload document ${index + 1}.` );

        }

      });

  }

}