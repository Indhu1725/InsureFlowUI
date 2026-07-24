import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;

  hidePassword = true;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(100)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
          )
        ]
      ]

    });

  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const request: LoginRequest = {

      email: this.loginForm.value.email.trim().toLowerCase(),

      password: this.loginForm.value.password

    };

    this.authService.login(request).subscribe({

      next: (response: LoginResponse) => {

        this.authService.saveUser(response);

        this.isSubmitting = false;

        // You currently have only one dashboard
        this.router.navigate(['/dashboard']);

      },

      error: (error: any) => {

        this.isSubmitting = false;

        if (error.status === 404) {

          alert('Invalid email or password.');

        }

        else if (error.status === 400) {

          alert(error.error);

        }

        else {

          alert('Unable to login. Please try again.');

        }

      }

    });

  }

}