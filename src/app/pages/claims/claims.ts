import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, map } from 'rxjs';

import { ClaimService } from '../../services/claim';
import { ClaimResponse } from '../../models/claim-response';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule,RouterModule,AsyncPipe],
  templateUrl: './claims.html',
  styleUrl: './claims.css'
})
export class Claims implements OnInit {

  claims$!: Observable<ClaimResponse[]>;

  allClaims: ClaimResponse[] = [];

  selectedFilter = 'all';

  isLoading = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;

  userRole = localStorage.getItem('role');

  constructor(private claimService: ClaimService) { }

  ngOnInit(): void {

    if (this.userRole === 'Admin') {

      this.loadClaims();

    }
    else if (this.userRole === 'InternalStaff') {

      this.loadReviewClaims();

    }
    else {

      this.loadMyClaims();

    }

  }

  // Admin
  loadClaims(): void {

  this.isLoading = true;

  this.claims$ = this.claimService.getPagedClaims({

    pageNumber: this.pageNumber,
    pageSize: this.pageSize,
    sortBy: 'CreatedDate',
    sortDirection: 'desc'

  }).pipe(

    map(response => {

      this.allClaims = response.data.records;

      this.pageNumber = response.data.currentPage;

      this.totalPages = response.data.totalPages;

      this.isLoading = false;

      return response.data.records;

    })

  );

}

  // Customer
  loadMyClaims(): void {

    this.isLoading = true;

    this.claims$ = this.claimService.getMyClaims().pipe(

      map(response => {

        this.allClaims = response.data;

        this.isLoading = false;

        return response.data;

      })

    );

  }

  // Internal Staff
  loadReviewClaims(): void {

    this.isLoading = true;

    this.claims$ = this.claimService.getReviewClaims().pipe(

      map(response => {

        this.allClaims = response.data;

        this.isLoading = false;

        return response.data;

      })

    );

  }

  loadStatus(status: string): void {

    this.isLoading = true;

    this.claims$ = this.claimService.getClaimsByStatus(status).pipe(

      map(response => {

        this.allClaims = response.data;

        this.isLoading = false;

        return response.data;

      })

    );

  }

  searchClaim(claimNumber: string): void {

    this.isLoading = true;

    this.claims$ = this.claimService.getClaimByNumber(claimNumber).pipe(

      map((response: any) => {

        this.allClaims = [response.data];

        this.isLoading = false;

        return [response.data];

      })

    );

  }

  onFilterChange(filter: string): void {

    this.selectedFilter = filter;

    if (filter === 'all') {

      if (this.userRole === 'Admin') {

        this.loadClaims();

      }
      else if (this.userRole === 'InternalStaff') {

        this.loadReviewClaims();

      }
      else {

        this.loadMyClaims();

      }

    }

    else if (filter === 'my') {

      this.loadMyClaims();

    }

    else if(filter === 'submitted' && this.userRole === 'Admin'){
    this.loadStatus('Submitted');
}

   else if(filter === 'underreview' && this.userRole === 'Admin'){
    this.loadStatus('UnderReview');
}

else if(filter === 'approved' && this.userRole === 'Admin'){
    this.loadStatus('Approved');
}

else if(filter === 'rejected' && this.userRole === 'Admin'){
    this.loadStatus('Rejected');
}

    else if (filter === 'number') {

      this.claims$ = of([]);

    }

  }
  previousPage(): void  {

  if (this.pageNumber > 1) {

    this.pageNumber--;

    this.loadClaims();

  }

}
nextPage(): void {

  if (this.pageNumber < this.totalPages) {

    this.pageNumber++;

    this.loadClaims();

  }

}

}