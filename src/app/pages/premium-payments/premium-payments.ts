import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PremiumPaymentService } from '../../services/premium-payment';
import { PremiumPayment } from '../../models/premium-payment';
import { PremiumDue } from '../../models/premium-due';

@Component({
  selector: 'app-premium-payments',
  standalone: true,
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './premium-payments.html',
  styleUrl: './premium-payments.css'
})
export class PremiumPayments {

  role = localStorage.getItem('role');
  payments = signal<PremiumPayment[]>([]);
  premiumDue = signal<PremiumDue | null>(null);
  loading = signal(false);
  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(1);
  totalRecords = signal(0);
  sortBy = signal('paymentDate');
  sortDirection = signal('desc');
  selectedFilter = signal('all');
  searchId = signal(0);
  idLabel = signal('');

  constructor(
    private paymentService: PremiumPaymentService,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.loadPayments();

    this.loadPremiumDue();

  }

  // ================= LOAD PAYMENTS =================

  loadPayments(): void {

    this.loading.set(true);

    if (this.selectedFilter() === 'all') {

  if (this.role === 'Customer') {

    this.paymentService.getMyPayments(
      this.pageNumber(),
      this.pageSize()
    ).subscribe({
      next: response => {

        this.payments.set(response.data.records);
        this.totalPages.set(response.data.totalPages);
        this.totalRecords.set(response.data.totalRecords);
        this.loading.set(false);

      },
      error: () => {

        this.loading.set(false);
        this.payments.set([]);
        this.toastr.error('Unable to load premium payments.', 'Error');

      }
    });

  }
  else {

    this.paymentService.getPayments(
      this.pageNumber(),
      this.pageSize(),
      this.sortBy(),
      this.sortDirection()
    ).subscribe({

      next: response => {

        this.payments.set(response.data.records);
        this.totalPages.set(response.data.totalPages);
        this.totalRecords.set(response.data.totalRecords);
        this.loading.set(false);

      },

      error: () => {

        this.loading.set(false);
        this.payments.set([]);
        this.toastr.error('Unable to load premium payments.', 'Error');

      }

    });

  }

  return;
}

    // Payment By ID

    if (this.selectedFilter() === 'id') {

      this.paymentService.getPaymentById(this.searchId()).subscribe({

        next: response => {

          this.loading.set(false);

          if (!response.success || !response.data) {

            this.payments.set([]);

            this.toastr.error('Payment not found.','Error');

            return;

          }

          this.payments.set([response.data]);

          this.totalPages.set(1);

          this.totalRecords.set(1);

        },

        error: () => {

          this.loading.set(false);

          this.payments.set([]);

          this.toastr.error('Payment not found.','Error');

        }

      });

      return;

    }

    // Policy Payments

    if (this.selectedFilter() === 'policy') {

      this.paymentService.getPaymentsByPolicy(
        this.searchId(),
        this.pageNumber(),
        this.pageSize()
      ).subscribe({

        next: response => {

          this.loading.set(false);

          this.payments.set(response.data.records);

          this.totalPages.set(response.data.totalPages);

          this.totalRecords.set(response.data.totalRecords);

        },

        error: () => {

          this.loading.set(false);

          this.payments.set([]);

          this.toastr.error('No payments found.','Error');

        }

      });

      return;

    }

    // Customer Payments

   // Customer Payments

this.paymentService.getPaymentsByCustomer(
  this.searchId(),
  this.pageNumber(),
  this.pageSize()
).subscribe({

  next: response => {

    this.loading.set(false);

    this.payments.set(response.data.records);

    this.totalPages.set(response.data.totalPages);

    this.totalRecords.set(response.data.totalRecords);

  },

  error: () => {

    this.loading.set(false);

    this.payments.set([]);

    this.toastr.error('No payments found.', 'Error');

  }

});
}

  loadPremiumDue(): void {

  if (this.role !== 'Customer')
    return;

  this.paymentService.getPremiumDue().subscribe({
    next: (response) => {

      this.premiumDue.set(response.data);

    },

    error: () => {

      this.premiumDue.set(null);

    }

  });

}

  // ================= FILTER =================

  onFilterChange(filter: string): void {

    this.selectedFilter.set(filter);

    this.searchId.set(0);

    switch (filter) {

      case 'all':

        this.loadPayments();

        break;

      case 'id':

        this.idLabel.set('Payment ID');

        this.payments.set([]);

        break;

      case 'policy':

        this.idLabel.set('Policy ID');

        this.payments.set([]);

        break;

      case 'customer':

        this.idLabel.set('Customer ID');

        this.payments.set([]);

        break;

    }

  }

  // ================= SEARCH =================

  searchPayments(): void {

    if (this.searchId() <= 0) {

      this.toastr.warning('Please enter a valid ID.','Validation');

      return;

    }

    this.loadPayments();

  }

  // ================= PAGINATION =================

  previousPage(): void {

    if (this.pageNumber() > 1) {

      this.pageNumber.update(value => value - 1);

      this.loadPayments();

    }

  }

  nextPage(): void {

    if (this.pageNumber() < this.totalPages()) {

      this.pageNumber.update(value => value + 1);

      this.loadPayments();

    }

  }

  // ================= SORT =================

  sort(column: string): void {

    if (this.sortBy() === column) {

      this.sortDirection.set(
        this.sortDirection() === 'asc'
          ? 'desc'
          : 'asc'
      );

    }

    else {

      this.sortBy.set(column);

      this.sortDirection.set('asc');

    }

    this.loadPayments();

  }

  // ================= NAVIGATION =================

  addPayment(): void {

    this.router.navigate(['/premium-payments/add']);

  }

  viewPayment(id: number): void {

    this.router.navigate(['/premium-payments/view', id]);

  }

}