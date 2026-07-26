import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PremiumPaymentService } from '../../../services/premium-payment';
import { PremiumPayment } from '../../../models/premium-payment';

@Component({
  selector: 'app-view-premium-payment',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './view-premium-payment.html',
  styleUrl: './view-premium-payment.css'
})
export class ViewPremiumPaymentComponent {

  payment = signal<PremiumPayment | null>(null);

  errorMessage = signal('');

  paymentModes = [
    { value: 0, text: 'UPI' },
    { value: 1, text: 'Card' },
    { value: 2, text: 'Net Banking' },
    { value: 3, text: 'Cash' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PremiumPaymentService,
    private toastr: ToastrService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPayment(id);
  }

  loadPayment(id: number): void {

    this.paymentService.getPaymentById(id).subscribe({

      next: (response) => {

        if (response.success) {

          this.payment.set(response.data);

        } else {

          this.errorMessage.set(response.message);
          this.toastr.error(response.message);

        }

      },

      error: (error) => {

        if (error.status === 404) {

          this.errorMessage.set('Premium Payment not found.');
          this.toastr.error('Premium Payment not found.');

        } else {

          this.errorMessage.set('Unable to load premium payment.');
          this.toastr.error('Unable to load premium payment.');

        }

      }

    });

  }

  getPaymentMode(mode: number): string {

    const paymentMode = this.paymentModes.find(x => x.value === mode);

    return paymentMode ? paymentMode.text : '';

  }

  back(): void {

    this.router.navigate(['/premium-payments']);

  }

}