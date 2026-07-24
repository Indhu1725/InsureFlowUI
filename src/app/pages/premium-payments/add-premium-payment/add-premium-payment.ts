import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { PremiumPaymentService } from '../../../services/premium-payment';
import { PremiumPaymentRequest } from '../../../models/premium-payment-request';

@Component({
  selector: 'app-add-premium-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-premium-payment.html',
  styleUrl: './add-premium-payment.css'
})
export class AddPremiumPaymentComponent {

  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  paymentModes = [
    { value: 0, text: 'UPI' },
    { value: 1, text: 'Card' },
    { value: 2, text: 'Net Banking' },
    { value: 3, text: 'Cash' }
  ];

  paymentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentService: PremiumPaymentService,
    private router: Router
  ) {

    this.paymentForm = this.fb.group({
      policyId: [
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      amount: [
        null,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      paymentMode: [
        0,
        Validators.required
      ],

      transactionReference: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ]
    });

  }

  submit(): void {

    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.paymentForm.invalid) {
      return;
    }

    this.loading = true;

    const request: PremiumPaymentRequest = {
  policyId: Number(this.paymentForm.value.policyId),
  amount: Number(this.paymentForm.value.amount),
  paymentMode: Number(this.paymentForm.value.paymentMode),
  transactionReference: this.paymentForm.value.transactionReference
};

    this.paymentService.makePayment(request).subscribe({

      next: () => {

        this.loading = false;

        this.successMessage = 'Premium payment added successfully.';

        this.paymentForm.reset({
          paymentMode: 0
        });

        this.submitted = false;

        setTimeout(() => {
          this.router.navigate(['/premium-payments']);
        }, 1500);

      },

      error: (err) => {

        this.loading = false;

        this.errorMessage =
          err.error?.message ?? 'Unable to add premium payment.';
      }

    });

  }

  cancel(): void {
    this.router.navigate(['/premium-payments']);
  }

}