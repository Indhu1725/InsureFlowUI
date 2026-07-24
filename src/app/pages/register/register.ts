import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';
import { RegisterRequest } from '../../models/register-request';
import { UserResponse } from '../../models/user-response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(/^[A-Za-z\s]+$/)
          ]
        ],

        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.maxLength(100)
          ]
        ],

        mobileNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[6-9]\d{9}$/)
          ]
        ],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/
            )
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );

  }

  get f() {
    return this.registerForm.controls;
  }

  get passwordMismatch(): boolean {

    return (
      this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.touched === true
    );

  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return {
        passwordMismatch: true
      };
    }

    return null;

  }

  togglePassword(): void {

    this.hidePassword = !this.hidePassword;

  }

  toggleConfirmPassword(): void {

    this.hideConfirmPassword = !this.hideConfirmPassword;

  }

  register(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();
      return;

    }

    this.isSubmitting = true;

    const request: RegisterRequest = {

      fullName: this.registerForm.value.fullName.trim(),

      email: this.registerForm.value.email.trim().toLowerCase(),

      password: this.registerForm.value.password,

      mobileNumber: this.registerForm.value.mobileNumber.trim()

    };

    this.authService.register(request).subscribe({

      next: (response: UserResponse) => {

        this.isSubmitting = false;

        alert('Registration Successful.');

        this.router.navigate(['/login']);

      },

      error: (error: any) => {

        this.isSubmitting = false;

        if (error.status === 409) {

          alert('User with this email already exists.');

        }
        else if (error.status === 400) {

          alert(error.error);

        }
        else {

          alert('Registration Failed.');

        }

      }

    });

  }

}