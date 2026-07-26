import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../../services/claim';
import { ClaimDecision } from '../../../models/claim-decision';

@Component({
  selector: 'app-claim-decision',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './claim-decision.html',
  styleUrl: './claim-decision.css'
})
export class ClaimDecisionComponent implements OnInit {

  // Signal
  claimId = signal(0);

  // Keep as normal object because of ngModel
  decision: ClaimDecision = {
    finalDecisionStatus: 4,
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

  submitDecision(): void {

    this.claimService
      .decideClaim(this.claimId(), this.decision)
      .subscribe({

        next: () => {

          this.toastr.success('Decision submitted successfully.');

          this.router.navigate(['/claims']);

        },

        error: (error) => {

          console.error(error);

          this.toastr.error('Failed to submit decision.');

        }

      });

  }

}