import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PolicyService } from '../../services/policy';
import { PolicyResponse } from '../../models/policy-response';

@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './policies.html',
  styleUrl: './policies.css'
})
export class Policies implements OnInit {

  policies = signal<PolicyResponse[]>([]);

  allPolicies = signal<PolicyResponse[]>([]);

  selectedFilter = signal('all');

  isLoading = signal(false);

  pageNumber = signal(1);

  pageSize = signal(10);

  totalPages = signal(1);

  role = localStorage.getItem('role') ?? '';

  constructor(
    private policyService: PolicyService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {

    if (this.role === 'Customer') {

      this.loadMyPolicies();

    } else {

      this.loadPolicies();

    }

  }

  loadPolicies(): void {

    this.isLoading.set(true);

    this.policyService.getPolicies({

      pageNumber: this.pageNumber(),

      pageSize: this.pageSize(),

      sortBy: 'createdDate',

      sortDirection: 'desc'

    }).subscribe({

      next: (response) => {

        this.policies.set(response.data.records);

        this.allPolicies.set(response.data.records);

        this.pageNumber.set(response.data.currentPage);

        this.totalPages.set(response.data.totalPages);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load policies.','Error' );

      }

    });

  }

  loadMyPolicies(): void {

    this.isLoading.set(true);

    this.policyService.getMyPolicies().subscribe({

      next: (response) => {

        this.policies.set(response.data);

        this.allPolicies.set(response.data);

        this.pageNumber.set(1);

        this.totalPages.set(1);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load your policies.','Error');

      }

    });

  }

  loadActivePolicies(): void {

    this.isLoading.set(true);

    this.policyService.getActivePolicies().subscribe({

      next: (response) => {

        this.policies.set(response.data);

        this.allPolicies.set(response.data);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load active policies.','Error');

      }

    });

  }

  onFilterChange(filter: string): void {

    this.selectedFilter.set(filter);

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

      this.policies.set([]);

    }

    else if (filter === 'number') {

      this.policies.set([]);

    }

  }

  searchById(id: number): void {

    if (!id) {

      this.toastr.warning(
        'Please enter a Policy ID.',
        'Warning'
      );

      return;

    }

    this.isLoading.set(true);

    this.policyService.getPolicyById(id).subscribe({

      next: (response) => {

        this.policies.set([response.data]);

        this.allPolicies.set([response.data]);

        this.isLoading.set(false);

        this.toastr.success('Policy found successfully.','Success');

      },

      error: () => {

        this.isLoading.set(false);

        this.policies.set([]);

        this.toastr.error(
          'Policy not found.',
          'Error'
        );

      }

    });

  }

  searchByNumber(policyNumber: string): void {

    if (!policyNumber.trim()) {

      this.toastr.warning('Please enter a Policy Number.','Warning');

      return;

    }

    this.isLoading.set(true);

    this.policyService.getPolicyByNumber(policyNumber).subscribe({

      next: (response) => {

        this.policies.set([response.data]);

        this.allPolicies.set([response.data]);

        this.isLoading.set(false);

        this.toastr.success('Policy found successfully.','Success');

      },

      error: () => {

        this.isLoading.set(false);

        this.policies.set([]);

        this.toastr.error('Policy not found.','Error');

      }

    });

  }

  cancelPolicy(policy: PolicyResponse): void {

    if (!confirm(`Are you sure you want to cancel Policy ${policy.policyNumber}?`)) {

      return;

    }

    this.policyService.cancelPolicy(policy.policyId).subscribe({

      next: (response: any) => {

        this.toastr.success(response.message || 'Policy cancelled successfully.','Success');

        if (this.role === 'Customer') {

          this.loadMyPolicies();

        } else {

          this.loadPolicies();

        }

      },

      error: (error) => {

        this.toastr.error(error.error?.message || 'Unable to cancel policy.','Error');

      }

    });

  }

  previousPage(): void {

    if (this.pageNumber() > 1) {

      this.pageNumber.update(value => value - 1);

      this.loadPolicies();

    }

  }

  nextPage(): void {

    if (this.pageNumber() < this.totalPages()) {

      this.pageNumber.update(value => value + 1);

      this.loadPolicies();

    }

  }

}