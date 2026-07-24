import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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
export class ReviewClaim {

  claimId: number = 0;

  review: ClaimReview = {

    recommendedStatus: 2,   // Recommended For Approval

    remarks: ''

  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimService: ClaimService
  ) { }

  ngOnInit(): void {

    this.claimId = Number(this.route.snapshot.paramMap.get('id'));

  }

  submitReview(): void {

    this.claimService.reviewClaim(this.claimId, this.review).subscribe({

      next: () => {

        alert('Claim reviewed successfully.');

        this.router.navigate(['/claims']);

      },

      error: (error) => {

        console.log(error);

        alert('Failed to review claim.');

      }

    });

  }

}