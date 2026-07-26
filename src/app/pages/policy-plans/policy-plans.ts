import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PolicyPlanService } from '../../services/policy-plan';
import { PolicyPlan } from '../../models/policy-plan';
import { PolicyPlanQuery } from '../../models/policy-plan-query';

@Component({
  selector: 'app-policy-plans',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './policy-plans.html',
  styleUrl: './policy-plans.css'
})
export class PolicyPlans {

  plans = signal<PolicyPlan[]>([]);

  isLoading = signal(false);

  role = localStorage.getItem('role');

  query = signal<PolicyPlanQuery>({
    pageNumber: 1,
    pageSize: 10,
    sortField: 'PlanName',
    sortDirection: 'asc'
  });

  totalPages = signal(1);

  selectedFilter = signal('all');

  selectedStatus = signal('all');

  constructor(
    private planService: PolicyPlanService,
    private toastr: ToastrService
  ) {

    if (this.role === 'Customer') {
      this.loadActivePlans();
    } else {
      this.loadPlans();
    }

  }

  loadPlans(): void {

    this.isLoading.set(true);

    this.planService.getPlans(this.query()).subscribe({

      next: (response) => {

        this.plans.set(response.data.records);

        this.totalPages.set(response.data.totalPages);

        this.query.update(q => ({
          ...q,
          pageNumber: response.data.currentPage
        }));

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load policy plans.','Error' );

      }

    });

  }

  loadActivePlans(): void {

    this.isLoading.set(true);

    this.planService.getActivePlans().subscribe({

      next: (response) => {

        this.plans.set(response.data);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error('Unable to load active plans.','Error');

      }

    });

  }

  searchById(id: number): void {

  if (!id || id <= 0) {

    this.toastr.warning('Please enter a valid Plan ID.', 'Validation');
    this.plans.set([]);
    return;

  }

  this.isLoading.set(true);

  this.planService.getPlanById(id).subscribe({

    next: (response) => {

      this.plans.set([response.data]);

      this.isLoading.set(false);

    },

    error: () => {

      this.isLoading.set(false);

      this.plans.set([]);

      this.toastr.error('Policy Plan not found.', 'Error');

    }

  });

}

  onFilterChange(filter: string): void {

    this.selectedFilter.set(filter);

    switch (filter) {

      case 'all':
        this.loadPlans();
        break;

      case 'active':
        this.loadActivePlans();
        break;

      case 'id':
        this.plans.set([]);
        break;

    }

  }

  onStatusChange(status: string): void {

    this.selectedStatus.set(status);

    if (this.selectedFilter() === 'active') {

      this.loadActivePlans();

    } else {

      this.loadPlans();

    }

    setTimeout(() => {

      let filtered = [...this.plans()];

      if (status === 'active') {

        filtered = filtered.filter(x => x.isActive);

      }

      else if (status === 'inactive') {

        filtered = filtered.filter(x => !x.isActive);

      }

      this.plans.set(filtered);

    }, 100);

  }

  toggleStatus(plan: PolicyPlan): void {

    if (plan.isActive) {

      this.planService.deletePlan(plan.planId).subscribe({

        next: () => {

          this.toastr.success('Policy Plan deactivated successfully.','Success');

          if (this.selectedFilter() === 'active') {

            this.loadActivePlans();

          } else {

            this.loadPlans();

          }

        },

        error: () => {

          this.toastr.error('Unable to deactivate policy plan.','Error');

        }

      });

    }

    else {

      this.toastr.info('Activate functionality is not available.','Information');

    }

  }

  previousPage(): void {

    if (this.query().pageNumber > 1) {

      this.query.update(q => ({
        ...q,
        pageNumber: q.pageNumber - 1
      }));

      this.loadPlans();

    }

  }

  nextPage(): void {

    if (this.query().pageNumber < this.totalPages()) {

      this.query.update(q => ({
        ...q,
        pageNumber: q.pageNumber + 1
      }));

      this.loadPlans();

    }

  }

}