import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CustomerService } from '../../../services/customer';
import { CustomerRequest } from '../../../models/customer-request';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css'
})
export class AddCustomer {

  isSaving = signal(false);

  isFormValid = signal(false);

  customerForm;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.customerForm = this.fb.group({

  dateOfBirth: [
    '',
    Validators.required
  ],

  address: [
    '',
    [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(250)
    ]
  ],

  city: [
    '',
    [
      Validators.required,
      Validators.pattern('^[A-Za-z ]+$')
    ]
  ],

  state: [
    '',
    [
      Validators.required,
      Validators.pattern('^[A-Za-z ]+$')
    ]
  ],

  pinCode: [
    '',
    [
      Validators.required,
      Validators.pattern('^[1-9][0-9]{5}$')
    ]
  ],

  nomineeName: [
    '',
    [
      Validators.required,
      Validators.pattern('^[A-Z][a-zA-Z ]*$')
    ]
  ],

  nomineeRelation: [
    '',
    Validators.required
  ]

});

this.customerForm.statusChanges.subscribe(() => {
  this.isFormValid.set(this.customerForm.valid);
});

}

 saveCustomer(): void {

  if (this.customerForm.invalid) {

    this.customerForm.markAllAsTouched();

    this.toastr.warning(
      'Please fill all required fields correctly.',
      'Validation'
    );

    return;

  }

  this.isSaving.set(true);

  const request =
    this.customerForm.value as CustomerRequest;

  this.customerService.createCustomer(request)
    .subscribe({

      next: () => {

        this.isSaving.set(false);

        this.toastr.success(
          'Customer added successfully.',
          'Success'
        );

        this.router.navigate(['/customers']);

      },

      error: (err) => {

        this.isSaving.set(false);

        this.toastr.error(
          err.error?.message ??
          'Unable to add customer.',
          'Error'
        );

      }

    });

}

}