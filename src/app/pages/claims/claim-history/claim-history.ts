import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../../services/claim';
import { ClaimHistoryResponse } from '../../../models/claim-history-response';

@Component({
  selector: 'app-claim-history',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './claim-history.html',
  styleUrl: './claim-history.css'
})
export class ClaimHistory implements OnInit {

  claimId = signal(0);

  history = signal<ClaimHistoryResponse[]>([]);

  constructor(
    private route: ActivatedRoute,
    private claimService: ClaimService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (id > 0) {

      this.claimId.set(id);

      this.loadHistory();

    } else {

      this.toastr.error('Invalid claim ID.');

    }

  }

  loadHistory(): void {

    this.claimService
      .getHistory(this.claimId())
      .subscribe({

        next: (response) => {

          const history = response.data ?? [];

          this.history.set(
            history.map((item: ClaimHistoryResponse) => ({
              ...item,

              oldStatus: this.getClaimStatusName(item.oldStatus),

              newStatus: this.getClaimStatusName(item.newStatus)

            }))
          );

        },

        error: (error) => {

          console.error(error);

          this.toastr.error(
            'Failed to load claim history.'
          );

        }

      });

  }

  getClaimStatusName(status: string | number): string {

    const statusMap: { [key: number]: string } = {

      0: 'Submitted',

      1: 'Under Review',

      2: 'Recommended For Approval',

      3: 'Recommended For Rejection',

      4: 'Approved',

      5: 'Rejected'

    };

    const statusNumber = Number(status);

    return statusMap[statusNumber] ?? 'Unknown';

  }

}