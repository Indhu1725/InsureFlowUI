import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ClaimService } from '../../services/claim';
import { ClaimResponse } from '../../models/claim-response';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './claims.html',
  styleUrl: './claims.css'
})
export class Claims implements OnInit {

  private claimService = inject(ClaimService);
  private toastr = inject(ToastrService);

  claims = signal<ClaimResponse[]>([]);
  isLoading = signal(false);

  selectedFilter = signal('all');

  pageNumber = signal(1);
  pageSize = 10;
  totalPages = signal(1);

  userRole = localStorage.getItem('role');

  ngOnInit(): void {

    switch (this.userRole) {
      case 'Admin':
        this.loadClaims();
        break;

      case 'InternalStaff':
        this.loadReviewClaims();
        break;

      default:
        this.loadMyClaims();
        break;
    }
  }

  //================ Admin =================

  loadClaims(): void {

    this.isLoading.set(true);

    this.claimService.getPagedClaims({

      pageNumber: this.pageNumber(),
      pageSize: this.pageSize,
      sortBy: 'CreatedDate',
      sortDirection: 'desc'

    }).subscribe({

      next: (response) => {

        this.claims.set(response.data.records);

        this.pageNumber.set(response.data.currentPage);

        this.totalPages.set(response.data.totalPages);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load claims.');

      }

    });

  }

  loadMyClaims(): void {

    this.isLoading.set(true);

    this.claimService.getMyClaims().subscribe({

      next: (response) => {

        this.claims.set(response.data);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load your claims.');

      }

    });

  }

  //================ Staff =================

  loadReviewClaims(): void {

    this.isLoading.set(true);

    this.claimService.getReviewClaims().subscribe({

      next: (response) => {

        this.claims.set(response.data);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load review claims.');

      }

    });

  }

  //================ Status =================

  loadStatus(status: string): void {

    this.isLoading.set(true);

    this.claimService.getClaimsByStatus(status).subscribe({

      next: (response) => {

        this.claims.set(response.data);

        this.isLoading.set(false);

        this.toastr.success(`${status} claims loaded.`);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load claims.');

      }

    });

  }

  //================ Search =================

  searchClaim(claimNumber: string): void {

    if (!claimNumber.trim()) {

      this.toastr.warning('Please enter a claim number.');

      return;

    }

    this.isLoading.set(true);

    this.claimService.getClaimByNumber(claimNumber).subscribe({

      next: (response: any) => {

        this.claims.set([response.data]);

        this.isLoading.set(false);

      },

      error: () => {

        this.claims.set([]);

        this.isLoading.set(false);

        this.toastr.error('Claim not found.');

      }

    });

  }

  //================ Filter =================

  onFilterChange(filter: string): void {

    this.selectedFilter.set(filter);

    if (filter === 'all') {

      if (this.userRole === 'Admin') {

        this.loadClaims();

      } else if (this.userRole === 'InternalStaff') {

        this.loadReviewClaims();

      } else {

        this.loadMyClaims();

      }

      return;

    }

    if (filter === 'my') {

      this.loadMyClaims();

      return;

    }

    if (filter === 'submitted' && this.userRole === 'Admin') {

      this.loadStatus('Submitted');

      return;

    }

    if (filter === 'underreview' && this.userRole === 'Admin') {

      this.loadStatus('UnderReview');

      return;

    }

    if (filter === 'approved' && this.userRole === 'Admin') {

      this.loadStatus('Approved');

      return;

    }

    if (filter === 'rejected' && this.userRole === 'Admin') {

      this.loadStatus('Rejected');

      return;

    }

    if (filter === 'number') {

      this.claims.set([]);

    }

  }

  //================ Pagination =================

  previousPage(): void {

    if (this.pageNumber() > 1) {

      this.pageNumber.update(page => page - 1);

      this.loadClaims();

    }

  }

  nextPage(): void {

    if (this.pageNumber() < this.totalPages()) {

      this.pageNumber.update(page => page + 1);

      this.loadClaims();

    }

  }

}