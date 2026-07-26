import { Component, signal,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule,FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { PremiumPaymentService } from '../../../services/premium-payment';
import { PremiumPaymentRequest } from '../../../models/premium-payment-request';
import { PolicyService } from '../../../services/policy';
import { PolicyResponse } from '../../../models/policy-response';

@Component({
  selector: 'app-add-premium-payment',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-premium-payment.html',
  styleUrl: './add-premium-payment.css'
})
export class AddPremiumPaymentComponent implements OnInit {

  loading = signal(false);

  submitted = signal(false);
  policies = signal<PolicyResponse[]>([]);

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
  private policyService: PolicyService,
  private router: Router,
  private toastr: ToastrService
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
        null,
        Validators.required
      ],

      transactionReference: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.pattern(/^[A-Za-z0-9-]+$/)
        ]
      ]

    });

  }
  ngOnInit(): void {
  this.loadPolicies();
}
loadPolicies(): void {

  this.policyService.getActivePolicies().subscribe({

    next: (response) => {

      this.policies.set(response.data);

    },

    error: () => {

      this.toastr.error('Unable to load policies.');

    }

  });

}

  submit(): void {

    this.submitted.set(true);

    this.paymentForm.markAllAsTouched();

    if (this.paymentForm.invalid) {

      this.toastr.warning('Please correct the highlighted fields.','Validation');

      return;

    }

    const amount = Number(this.paymentForm.value.amount);

    if (amount <= 0) {

      this.toastr.error('Amount must be greater than 0.','Validation');

      return;

    }

    const request: PremiumPaymentRequest = {

      policyId: Number(this.paymentForm.value.policyId),

      amount: amount,

      paymentMode: Number(this.paymentForm.value.paymentMode),

      transactionReference:
        this.paymentForm.value.transactionReference.trim()

    };

    this.loading.set(true);

    this.paymentService.makePayment(request).subscribe({

      next: () => {

        this.loading.set(false);

        this.toastr.success('Premium payment added successfully.','Success');

        this.paymentForm.reset({

          paymentMode: null

        });

        this.submitted.set(false);

        setTimeout(() => {

          this.router.navigate(['/premium-payments']);

        }, 1200);

      },

      error: (err) => {

        this.loading.set(false);

        this.toastr.error(err.error?.message ??'Unable to add premium payment.','Error');

      }

    });

  }
  cancel(): void {

    this.router.navigate(['/premium-payments']);
  }

}