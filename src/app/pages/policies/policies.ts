import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, map } from 'rxjs';

import { PolicyService } from '../../services/policy';
import { PolicyResponse } from '../../models/policy-response';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AsyncPipe
  ],
  templateUrl: './policies.html',
  styleUrl: './policies.css'
})
export class Policies implements OnInit {

  policies$!: Observable<PolicyResponse[]>;

  allPolicies: PolicyResponse[] = [];

  selectedFilter = 'all';
  role = localStorage.getItem('role');

  isLoading = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {

  if (this.role === 'Customer') {

    this.loadMyPolicies();

  } else {

    this.loadPolicies();

  }

}
  loadPolicies(): void {

  this.isLoading = true;

  this.policies$ = this.policyService.getPolicies({

    pageNumber: this.pageNumber,
    pageSize: this.pageSize,
    sortBy: 'createdDate',
    sortDirection: 'desc'

  }).pipe(

    map(response => {

      this.allPolicies = response.data.records;

      this.pageNumber = response.data.currentPage;

      this.totalPages = response.data.totalPages;

      this.isLoading = false;

      return response.data.records;

    })

  );

}
loadMyPolicies(): void {

  this.isLoading = true;

  this.policies$ = this.policyService.getMyPolicies().pipe(

    map(response => {

      this.allPolicies = response.data;

      this.totalPages = 1;

      this.pageNumber = 1;

      this.isLoading = false;

      return response.data;

    })

  );

}

  loadActivePolicies(): void {

    this.isLoading = true;

    this.policies$ = this.policyService.getActivePolicies().pipe(

      map(response => {

        this.allPolicies = response.data;

        this.isLoading = false;

        return response.data;

      })

    );

  }

  onFilterChange(filter: string): void {

    this.selectedFilter = filter;

   if (filter === 'all') {

  if (this.role === 'Customer') {

    this.loadMyPolicies();

  } else {

    this.loadPolicies();

  }

}

else if (filter === 'active') {

  if (this.role !== 'Customer') {

    this.loadActivePolicies();

  }

}

else if (filter === 'id') {

  this.policies$ = of([]);

}

else if (filter === 'number') {

  this.policies$ = of([]);

}

}

  searchById(id: number): void {

    this.isLoading = true;

    this.policies$ = this.policyService.getPolicyById(id).pipe(

      map(response => {

        this.allPolicies = [response.data];

        this.isLoading = false;

        return [response.data];

      })

    );

  }

  searchByNumber(policyNumber: string): void {

    this.isLoading = true;

    this.policies$ = this.policyService.getPolicyByNumber(policyNumber).pipe(

      map(response => {

        this.allPolicies = [response.data];

        this.isLoading = false;

        return [response.data];

      })

    );

  }

 cancelPolicy(policy: PolicyResponse): void {

  if (!confirm(`Are you sure you want to cancel Policy ${policy.policyNumber}?`)) {
    return;
  }

  this.policyService.cancelPolicy(policy.policyId).subscribe({

    next: (response: any) => {

      alert(response.message);

      if (this.role === 'Customer') {

  this.loadMyPolicies();

} else {

  this.loadPolicies();

}

    },

    error: (error) => {

      console.log(error);

      alert(error.error.message);

    }

  });

}
previousPage(): void {

  if (this.pageNumber > 1) {

    this.pageNumber--;

    this.loadPolicies();

  }

}
nextPage(): void {

  if (this.pageNumber < this.totalPages) {

    this.pageNumber++;

    this.loadPolicies();

  }

}
}