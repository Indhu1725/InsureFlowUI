import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../../services/claim';
import { ClaimDocumentResponse } from '../../../models/claim-document-response';

@Component({
  selector: 'app-claim-documents',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './claim-documents.html',
  styleUrl: './claim-documents.css'
})
export class ClaimDocuments implements OnInit {

  claimId = signal(0);

  documents = signal<ClaimDocumentResponse[]>([]);

  userRole = localStorage.getItem('role');

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id > 0) {

      this.claimId.set(id);

      this.loadDocuments();

    } else {

      this.toastr.error('Invalid claim ID.');

    }

  }

  loadDocuments(): void {

    this.claimService.getDocuments(this.claimId()).subscribe({

      next: (response) => {

        this.documents.set(response.data ?? []);

      },

      error: (error) => {

        console.error(error);

        this.toastr.error('Failed to load claim documents.');

      }

    });

  }

  downloadDocument(filePath: string): void {

    if (!filePath) {

      this.toastr.warning('Document path is not available.');

      return;

    }

    const downloadUrl = `https://localhost:7244/${filePath}`;

    const link = document.createElement('a');

    link.href = downloadUrl;

    link.target = '_blank';

    link.download = '';

    link.click();

    this.toastr.success('Document download started.');

  }
  getFileName(filePath: string): string {

  const fileName = filePath.split('/').pop();

  if (!fileName) {
    return '';
  }

  const index = fileName.indexOf('_');

  return index >= 0
    ? fileName.substring(index + 1)
    : fileName;

}

}