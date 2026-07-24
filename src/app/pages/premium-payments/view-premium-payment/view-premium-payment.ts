import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PremiumPaymentService } from '../../../services/premium-payment';
import { PremiumPayment } from '../../../models/premium-payment';

@Component({
  selector: 'app-view-premium-payment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './view-premium-payment.html',
  styleUrl: './view-premium-payment.css'
})
export class ViewPremiumPaymentComponent {

  payment$!: Observable<PremiumPayment | null>;

  errorMessage = '';

  paymentModes = [
    { value: 0, text: 'UPI' },
    { value: 1, text: 'Card' },
    { value: 2, text: 'Net Banking' },
    { value: 3, text: 'Cash' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PremiumPaymentService
  ) {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.loadPayment(id);

  }

  loadPayment(id: number): void {

    this.payment$ = this.paymentService
      .getPaymentById(id)
      .pipe(

        map(response => {

          if (!response.success) {

            throw new Error(response.message);

          }

          return response.data as PremiumPayment;

        }),

        catchError(error => {

          if (error.status === 404) {

            this.errorMessage = 'Premium Payment not found.';

          }
          else {

            this.errorMessage = 'Unable to load premium payment.';

          }

          return of(null);

        })

      );

  }

  getPaymentMode(mode: number): string {

    const paymentMode = this.paymentModes.find(x => x.value === mode);

    return paymentMode ? paymentMode.text : '';

  }

  back(): void {

    this.router.navigate(['/premium-payments']);

  }

}