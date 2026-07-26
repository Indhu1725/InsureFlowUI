import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../../services/claim';
import { ClaimReview } from '../../../models/claim-review';

@Component({
  selector: 'app-review-claim',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './review-claim.html',
  styleUrl: './review-claim.css'
})
export class ReviewClaim implements OnInit {

  // Signal
  claimId = signal(0);

  // Keep as normal object for ngModel
  review: ClaimReview = {
    recommendedStatus: 2,
    remarks: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimService: ClaimService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id > 0) {

      this.claimId.set(id);

    } else {

      this.toastr.error('Invalid claim ID.');

      this.router.navigate(['/claims']);

    }

  }

  submitReview(): void {

    this.claimService.reviewClaim(this.claimId(), this.review).subscribe({

      next: () => {

        this.toastr.success('Claim reviewed successfully.');

        this.router.navigate(['/claims']);

      },

      error: (error) => {

        console.error(error);

        this.toastr.error('Failed to review claim.');

      }

    });

  }

}