import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder,FormGroup,Validators} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CustomerService } from '../../../services/customer';
import { Customer } from '../../../models/customer';
import { CustomerRequest } from '../../../models/customer-request';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit {

  customer = signal<Customer | null>(null);

  isLoading = signal(false);

  isSaving = signal(false);

  isFormValid = signal(false);

  customerId = 0;
  selectedImage: File | null = null;

  imagePreview: string | ArrayBuffer | null = null;

  editProfileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.editProfileForm = this.fb.group({

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

    this.editProfileForm.statusChanges.subscribe(() => {

      this.isFormValid.set(this.editProfileForm.valid);

    });

  }

  ngOnInit(): void {

    this.loadProfile();

  }

  loadProfile(): void {

    this.isLoading.set(true);

    this.customerService.getMyProfile().subscribe({

      next: (response) => {

        const customer = response.data;

        this.customer.set(customer);

        this.customerId = customer.customerId;
        this.imagePreview = customer.profileImageUrl;

        this.editProfileForm.patchValue({

          dateOfBirth: customer.dateOfBirth.substring(0, 10),

          address: customer.address,

          city: customer.city,

          state: customer.state,

          pinCode: customer.pinCode,

          nomineeName: customer.nomineeName,

          nomineeRelation: customer.nomineeRelation

        });

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error(
          'Unable to load profile.',
          'Error'
        );

      }

    });

  }
  onImageSelected(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0)
    return;

  this.selectedImage = input.files[0];

  const reader = new FileReader();

  reader.onload = () => {

    this.imagePreview = reader.result;

  };

  reader.readAsDataURL(this.selectedImage);

}

  updateProfile(): void {

    if (this.editProfileForm.invalid) {

      this.editProfileForm.markAllAsTouched();

      this.toastr.warning(
        'Please fill all required fields correctly.',
        'Validation'
      );

      return;

    }

    this.isSaving.set(true);

    const request: CustomerRequest = {

  ...this.editProfileForm.value,

  profileImage: this.selectedImage ?? undefined

};

    this.customerService
      .updateCustomer(this.customerId, request)
      .subscribe({

        next: () => {

          this.isSaving.set(false);

          this.toastr.success(
            'Profile updated successfully.',
            'Success'
          );

          this.router.navigate([
            '/customers/my-profile'
          ]);

        },

        error: (err) => {

          this.isSaving.set(false);

          console.error(err);

          this.toastr.error(
            err.error?.message ??
            'Unable to update profile.',
            'Error'
          );

        }

      });

  }

}