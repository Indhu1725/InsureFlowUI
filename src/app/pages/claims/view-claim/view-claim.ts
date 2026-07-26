import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ClaimService } from '../../../services/claim';
import { ClaimResponse } from '../../../models/claim-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-claim',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view-claim.html',
  styleUrl: './view-claim.css'
})
export class ViewClaim implements OnInit {

  claim = signal<ClaimResponse | null>(null);

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.loadClaim(id);
    } else {
      this.toast.error('Invalid claim ID.');
    }
  }

  loadClaim(id: number): void {

    this.claimService.getClaimById(id).subscribe({
      next: (response) => {
        this.claim.set(response.data);
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Failed to load claim.');
      }
    });

  }

}