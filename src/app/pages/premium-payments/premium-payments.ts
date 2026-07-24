import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';

import { PremiumPaymentService } from '../../services/premium-payment';
import { PremiumPayment } from '../../models/premium-payment';

@Component({
  selector: 'app-premium-payments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './premium-payments.html',
  styleUrl: './premium-payments.css'
})
export class PremiumPayments {
  role = localStorage.getItem('role');
  customerId = Number(localStorage.getItem('customerId'));

  pageNumber = 1;
  pageSize = 10;

  totalPages = 0;
  totalRecords = 0;

  sortBy = 'paymentDate';
  sortDirection = 'desc';

  selectedFilter = 'all';
  searchId = 0;
  idLabel = '';

  loading = false;
  errorMessage = '';

  private refresh$ = new BehaviorSubject<void>(undefined);

  payments$: Observable<PremiumPayment[]> = this.refresh$.pipe(

    startWith(undefined),

    switchMap(() => {

      this.loading = true;
      this.errorMessage = '';

      // ================= ALL PAYMENTS =================

      if (this.selectedFilter === 'all') {

  if (this.role === 'Customer') {

    return this.paymentService
      .getPaymentsByCustomer(
        this.customerId,
        this.pageNumber,
        this.pageSize
      )
      .pipe(

        map(response => {

          this.loading = false;

          this.totalPages = response.data.totalPages;
          this.totalRecords = response.data.totalRecords;

          return response.data.records;

        }),

        catchError(() => {

          this.loading = false;
          this.errorMessage = 'Unable to load premium payments';

          return of([]);

        })

      );

  }

  return this.paymentService
    .getPayments(
      this.pageNumber,
      this.pageSize,
      this.sortBy,
      this.sortDirection
    )
    .pipe(

      map(response => {

        this.loading = false;

        this.totalPages = response.data.totalPages;
        this.totalRecords = response.data.totalRecords;

        return response.data.records;

      }),

      catchError(() => {

        this.loading = false;
        this.errorMessage = 'Unable to load premium payments';

        return of([]);

      })

    );

}
// ================= PAYMENT BY ID =================

      if (this.selectedFilter === 'id') {

        return this.paymentService
          .getPaymentById(this.searchId)
          .pipe(

            map(response => {

              this.loading = false;

              if (!response.success || !response.data) {

                this.errorMessage = 'Payment not found';

                return [];

              }

              this.totalPages = 1;
              this.totalRecords = 1;

              return [response.data];

            }),

            catchError(() => {

              this.loading = false;

              this.errorMessage = 'Payment not found';

              return of([]);

            })

          );

      }

      // ================= POLICY PAYMENTS =================

      if (this.selectedFilter === 'policy') {

        return this.paymentService
          .getPaymentsByPolicy(
            this.searchId,
            this.pageNumber,
            this.pageSize
          )
          .pipe(

            map(response => {

              this.loading = false;

              this.totalPages = response.data.totalPages;
              this.totalRecords = response.data.totalRecords;

              return response.data.records as PremiumPayment[];

            }),

            catchError(() => {

              this.loading = false;

              this.errorMessage = 'No payments found';

              return of([]);

            })

          );

      }

      // ================= CUSTOMER PAYMENTS =================

      return this.paymentService
        .getPaymentsByCustomer(
          this.searchId,
          this.pageNumber,
          this.pageSize
        )
        .pipe(

          map(response => {

            this.loading = false;

            this.totalPages = response.data.totalPages;
            this.totalRecords = response.data.totalRecords;

            return response.data.records as PremiumPayment[];

          }),

          catchError(() => {

            this.loading = false;

            this.errorMessage = 'No payments found';

            return of([]);

          })

        );

    })

  );

  constructor(
    private paymentService: PremiumPaymentService,
    private router: Router
  ) { }

  onFilterChange(): void {

    this.searchId = 0;
    this.errorMessage = '';

    switch (this.selectedFilter) {

      case 'all':
        this.refresh$.next();
        break;

      case 'id':
        this.idLabel = 'Payment ID';
        break;

      case 'policy':
        this.idLabel = 'Policy ID';
        break;

      case 'customer':
        this.idLabel = 'Customer ID';
        break;

    }

  }

  searchPayments(): void {

    if (this.searchId <= 0) {

      alert('Please enter a valid ID');
      return;

    }

    this.refresh$.next();

  }

  previousPage(): void {

    if (this.pageNumber > 1) {

      this.pageNumber--;
      this.refresh$.next();

    }

  }

  nextPage(): void {

    if (this.pageNumber < this.totalPages) {

      this.pageNumber++;
      this.refresh$.next();

    }

  }

  sort(column: string): void {

    if (this.sortBy === column) {

      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

    }
    else {

      this.sortBy = column;
      this.sortDirection = 'asc';

    }

    this.refresh$.next();

  }

  addPayment(): void {

    this.router.navigate(['/premium-payments/add']);

  }

  viewPayment(id: number): void {

    this.router.navigate(['/premium-payments/view', id]);

  }

}