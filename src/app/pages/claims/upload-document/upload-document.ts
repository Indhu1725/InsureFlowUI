import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../../services/claim';
import { ClaimDocumentRequest } from '../../../models/claim-document-request';

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
export class UploadDocument implements OnInit {

  claimId = signal(0);

  documentName = signal('');

  documentType = signal('');

  selectedFile = signal<File | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimService: ClaimService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id > 0) {

      this.claimId.set(id);

    } else {

      this.toastr.error('Invalid claim ID.');

      this.router.navigate(['/claims']);

    }

  }

  onDocumentNameChange(value: string): void {

    this.documentName.set(value);

  }

  onDocumentTypeChange(value: string): void {

    this.documentType.set(value);

  }

  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.selectedFile.set(input.files[0]);

    }

  }

  upload(): void {

    const file = this.selectedFile();

    if (!file) {

      this.toastr.warning('Please choose a file.');

      return;

    }

    const request: ClaimDocumentRequest = {

      claimId: this.claimId(),

      documentName: this.documentName(),

      documentType: this.documentType(),

      documentReference: file

    };

    this.claimService.uploadDocument(request).subscribe({

      next: (response) => {

        console.log(response);

        this.toastr.success('Document uploaded successfully.');

        this.router.navigate(['/claims/documents', this.claimId()]);

      },

      error: (error) => {

        console.error(error);

        this.toastr.error(
          error.error?.message ?? 'Upload failed.'
        );

      }

    });

  }

}