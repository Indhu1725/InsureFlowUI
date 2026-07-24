import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router, RouterModule } from '@angular/router';

import { map, Observable } from 'rxjs';

import { CustomerService } from '../../../services/customer';

import { Customer } from '../../../models/customer';
import { CustomerRequest } from '../../../models/customer-request';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {

  customer$!: Observable<Customer>;

  customerId = 0;

  editProfileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {

    this.editProfileForm = this.fb.group({

      dateOfBirth: [
        '',
        Validators.required
      ],

      address: [
        '',
        Validators.required
      ],

      city: [
        '',
        Validators.required
      ],

      state: [
        '',
        Validators.required
      ],

      pinCode: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{6}$')
        ]
      ],

      nomineeName: [
        '',
        Validators.required
      ],

      nomineeRelation: [
        '',
        Validators.required
      ]

    });

  }

  ngOnInit(): void {

    this.loadProfile();

  }

  loadProfile(): void {

    this.customer$ = this.customerService
      .getMyProfile()
      .pipe(

        map(response => {

          const customer = response.data;

          this.customerId = customer.customerId;

          this.editProfileForm.patchValue({

            dateOfBirth: customer.dateOfBirth.substring(0,10),

            address: customer.address,

            city: customer.city,

            state: customer.state,

            pinCode: customer.pinCode,

            nomineeName: customer.nomineeName,

            nomineeRelation: customer.nomineeRelation

          });

          return customer;

        })

      );

  }

  updateProfile(): void {

    if(this.editProfileForm.invalid){

      this.editProfileForm.markAllAsTouched();

      return;

    }

    const request: CustomerRequest = this.editProfileForm.value;

    this.customerService
      .updateCustomer(this.customerId, request)
      .subscribe({

        next: () => {

          alert('Profile updated successfully');

          this.router.navigate(['/customers/my-profile']);

        },

        error: (error) => {

          console.log(error);

          alert('Unable to update profile');

        }

      });

  }

}