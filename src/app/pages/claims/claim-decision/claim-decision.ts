import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ClaimService } from '../../../services/claim';
import { ClaimDecision } from '../../../models/claim-decision';

@Component({
  selector: 'app-claim-decision',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './claim-decision.html',
  styleUrl: './claim-decision.css'
})
export class ClaimDecisionComponent {

  claimId = 0;

  decision: ClaimDecision = {
    finalDecisionStatus: 4,
    remarks: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimService: ClaimService
  ) { }

  ngOnInit(): void {

    this.claimId = Number(
      this.route.snapshot.paramMap.get('id')
    );

  }

  submitDecision(): void {

  console.log(this.decision);
  console.log(typeof this.decision.finalDecisionStatus);

  this.claimService
    .decideClaim(this.claimId, this.decision)
    .subscribe({
      next: () => {
        alert('Decision submitted successfully.');
        this.router.navigate(['/claims']);
      },
      error: (err) => {
        console.log(err);
      }
    });

}

}