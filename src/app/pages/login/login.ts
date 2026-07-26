import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';
import { LoginRequest } from '../../models/login-request';
import { LoginResponse } from '../../models/login-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class Login {

  loginForm: FormGroup;

  hidePassword = signal(true);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
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
  this.hidePassword.update(value => !value);
}

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const request: LoginRequest = {

      email: this.loginForm.value.email.trim().toLowerCase(),

      password: this.loginForm.value.password

    };

    this.authService.login(request).subscribe({

      next: (response: LoginResponse) => {

        this.authService.saveUser(response);

        this.isSubmitting.set(false);

        this.toastr.success('Login successful.','Success' );

        this.router.navigate(['/dashboard']);

},

error: (error: any) => {

  this.isSubmitting.set(false);

  if (error.status === 400) {

    this.toastr.warning(error.error,'Validation Error');

  } else if (error.status === 404) {

    this.toastr.error('Invalid email or password.','Login Failed');

  } else if (error.status === 401) {

    this.toastr.error('Unauthorized access.','Unauthorized');

  } else if (error.status === 403) {

    this.toastr.error('Access denied.','Forbidden');

  } else {

    this.toastr.error('Unable to login. Please try again.','Server Error');

  }

}

});

}

}