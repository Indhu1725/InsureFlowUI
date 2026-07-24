import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClaimService } from '../../../services/claim';
import { ClaimDocumentResponse } from '../../../models/claim-document-response';

@Component({
  selector: 'app-claim-documents',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './claim-documents.html',
  styleUrl: './claim-documents.css'
})
export class ClaimDocuments implements OnInit {

  claimId = 0;

  documents$!: Observable<ClaimDocumentResponse[]>;

  userRole = localStorage.getItem('role');

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService
  ) { }

  ngOnInit(): void {

    this.claimId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.documents$ = this.claimService
      .getDocuments(this.claimId)
      .pipe(
        map((response: any) => response.data ?? [])
      );
  }
  downloadDocument(filePath: string): void {

  const downloadUrl = `https://localhost:7244/${filePath}`;

  const link = document.createElement('a');

  link.href = downloadUrl;

  link.target = '_blank';

  link.download = '';

  link.click();

}

}