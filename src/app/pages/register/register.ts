import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,Validators,ReactiveFormsModule,AbstractControl,ValidationErrors} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth';
import { RegisterRequest } from '../../models/register-request';
import { UserResponse } from '../../models/user-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  registerForm: FormGroup;

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);
  isSubmitting = signal(false);
  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {

    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
            Validators.pattern(/^[A-Z][a-zA-Z]*(\s[A-Z][a-zA-Z]*)*$/)
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
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,100}$/)
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
  this.hidePassword.update(value => !value);
}

  toggleConfirmPassword(): void {
  this.hideConfirmPassword.update(value => !value);
}

  register(): void {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();
       this.toastr.warning('Please correct the highlighted fields before submitting.','Invalid Form');
      return;

    }

    this.isSubmitting.set(true);

    const request: RegisterRequest = {

  fullName: this.registerForm.value.fullName.trim(),

  email: this.registerForm.value.email.trim().toLowerCase(),

  password: this.registerForm.value.password,

  mobileNumber: this.registerForm.value.mobileNumber.trim(),

  profileImage: this.selectedImage ?? undefined

};

    this.authService.register(request).subscribe({

      next: (response: UserResponse) => {

        this.isSubmitting.set(false);

        this.toastr.success('Your account has been created successfully.','Registration Successful');

        this.router.navigate(['/login']);

      },

      error: (error: any) => {

        this.isSubmitting.set(false);

        if (error.status === 409) {

          this.toastr.warning('A user with this email already exists.','Email Exists');

        }
        else if (error.status === 400) {

          this.toastr.warning(error.error,'Validation Error');

        }
        else {

          this.toastr.error('Unable to create your account. Please try again.','Registration Failed');

        }

      }

    });

  }
  onImageSelected(event: Event): void {

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0)
    return;

  const file = input.files[0];

  if (!file.type.startsWith('image/')) {

    this.toastr.warning('Please select an image.');

    return;

  }

  this.selectedImage = file;

  const reader = new FileReader();

  reader.onload = () => {

    this.imagePreview = reader.result;

  };

  reader.readAsDataURL(file);

}

}