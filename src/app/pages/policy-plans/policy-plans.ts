import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';

import { PolicyPlanService } from '../../services/policy-plan';

import { PolicyPlan } from '../../models/policy-plan';
import { PolicyPlanQuery } from '../../models/policy-plan-query';

@Component({
  selector: 'app-policy-plans',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-plans.html',
  styleUrl: './policy-plans.css'
})
export class PolicyPlans {

  plans$!: Observable<PolicyPlan[]>;
  role = localStorage.getItem('role');

  query: PolicyPlanQuery = {
    pageNumber: 1,
    pageSize: 10,
    sortField: 'PlanName',
    sortDirection: 'asc'
  };
  totalPages = 1;

  selectedFilter = 'all';
  selectedStatus = 'all';

  constructor(private planService: PolicyPlanService) {

  if (this.role === 'Customer') {

    this.loadActivePlans();

  } else {

    this.loadPlans();

  }

}
  loadPlans(): void {

  this.plans$ = this.planService
    .getPlans(this.query)
    .pipe(

      map(response => {

        this.totalPages = response.data.totalPages;

        this.query.pageNumber = response.data.currentPage;

        return response.data.records;

      })

    );

}

  loadActivePlans(): void {
    this.plans$ = this.planService
      .getActivePlans()
      .pipe(map(response => response.data));
  }

  searchById(id: number): void {

    if (!id) {
      this.loadPlans();
      return;
    }

    this.plans$ = this.planService
      .getPlanById(id)
      .pipe(map(response => [response.data]));
  }

  onFilterChange(filter: string): void {

    this.selectedFilter = filter;

    switch (filter) {

      case 'all':
        this.loadPlans();
        break;

      case 'active':
        this.loadActivePlans();
        break;

      case 'id':
        this.plans$ = new Observable<PolicyPlan[]>();
        break;
    }
  }

  onStatusChange(status: string): void {

    this.selectedStatus = status;

    if (this.selectedFilter === 'active')
      this.loadActivePlans();
    else
      this.loadPlans();

    this.plans$ = this.plans$.pipe(
      map(plans => {

        if (status === 'all')
          return plans;

        if (status === 'active')
          return plans.filter(x => x.isActive);

        return plans.filter(x => !x.isActive);

      })
    );
  }

  toggleStatus(plan: PolicyPlan): void {

    if (plan.isActive) {

      // Deactivate using DELETE (Soft Delete)
      this.planService.deletePlan(plan.planId)
        .subscribe({

          next: () => {

            alert('Policy Plan deactivated successfully.');

            if (this.selectedFilter === 'active') {
              this.loadActivePlans();
            } else {
              this.loadPlans();
            }

          },

          error: () => {
            alert('Unable to deactivate policy plan.');
          }

        });

    } else {

      alert('Activate functionality is not available because the backend only provides a Deactivate (DELETE) API.');

    }

  }
  previousPage(): void {

  if (this.query.pageNumber > 1) {

    this.query.pageNumber--;

    this.loadPlans();

  }

}
nextPage(): void {

  if (this.query.pageNumber < this.totalPages) {

    this.query.pageNumber++;

    this.loadPlans();

  }

}

}