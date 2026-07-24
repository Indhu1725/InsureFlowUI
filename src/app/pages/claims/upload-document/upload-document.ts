import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClaimDocumentRequest } from '../../../models/claim-document-request';
import { ClaimService } from '../../../services/claim';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './upload-document.html',
  styleUrl: './upload-document.css'
})
export class UploadDocument {

  claimId = 0;

  documentName = '';

  documentType = '';

  selectedFile!: File;

  constructor(
  private route: ActivatedRoute,
  private router: Router,
  private claimService: ClaimService
) {
  this.claimId = Number(this.route.snapshot.paramMap.get('id'));
}

  onFileSelected(event: any): void {

    this.selectedFile = event.target.files[0];

  }

 upload(): void {

  if (!this.selectedFile) {

    alert('Please choose a file.');

    return;

  }

  const request: ClaimDocumentRequest = {

    claimId: this.claimId,

    documentName: this.documentName,

    documentType: this.documentType,

    documentReference: this.selectedFile

  };

  this.claimService.uploadDocument(request).subscribe({

    next: (response) => {

      alert('Document uploaded successfully.');

      console.log(response);

      this.router.navigate(['/claims/documents', this.claimId]);

    },

    error: (error) => {

      console.log(error);

      alert(error.error?.message ?? 'Upload failed.');

    }

  });

}

}