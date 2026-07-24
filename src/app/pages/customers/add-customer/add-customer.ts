import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { CustomerService } from '../../../services/customer';
import { CustomerRequest } from '../../../models/customer-request';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css'
})
export class AddCustomer {

  successMessage = '';
  errorMessage = '';

  customerForm;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {

    this.customerForm = this.fb.group({

      dateOfBirth: ['', Validators.required],

      address: ['', [
        Validators.required,
        Validators.maxLength(250)
      ]],

      city: ['', Validators.required],

      state: ['', Validators.required],

      pinCode: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{6}$')
      ]],

      nomineeName: ['', Validators.required],

      nomineeRelation: ['', Validators.required]

    });

  }

  saveCustomer(): void {

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();
      return;

    }

    const request: CustomerRequest = this.customerForm.value as CustomerRequest;

    this.customerService.createCustomer(request)
      .subscribe({

        next: () => {

          this.successMessage = 'Customer added successfully';
          this.errorMessage = '';

          setTimeout(() => {

            this.router.navigate(['/customers']);

          }, 1500);

        },

        error: (err) => {

          this.successMessage = '';

          this.errorMessage =
            err.error?.message || 'Unable to add customer';

        }

      });

  }

}