import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup,ReactiveFormsModule,Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css'
})
export class AddUser {

  addUserForm: FormGroup;
  isFormValid = signal(false);

  constructor(
  private fb: FormBuilder,
  private router: Router,
  private userService: UserService,
  private toastr: ToastrService
) {

    this.addUserForm = this.fb.group({

  // Full Name
  fullName: [
    '',
    [
      Validators.required,
      Validators.pattern('^[A-Z][a-zA-Z ]*$')
    ]
  ],

  // Email
  email: [
    '',
    [
      Validators.required,
      Validators.email
    ]
  ],

  // Mobile Number
  mobileNumber: [
    '',
    [
      Validators.required,
      Validators.pattern('^[6-9][0-9]{9}$')
    ]
  ],

  // Password
  password: [
    '',
    [
      Validators.required,
      Validators.pattern(
        '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$'
      )
    ]
  ],

  // Role
  role: [
    '',
    Validators.required
  ]

});
 this.addUserForm.statusChanges.subscribe(() => {
    this.isFormValid.set(this.addUserForm.valid);
  });

  }

  saveUser() {

  if (this.addUserForm.invalid) {

    this.addUserForm.markAllAsTouched();
    this.toastr.warning(
    'Please fill all required fields correctly.',
    'Validation'
  );

    return;

  }

  const formValue = this.addUserForm.value;

  if (formValue.role === 'Admin') {

    this.userService.createAdmin({

      fullName: formValue.fullName,

      email: formValue.email,

      password: formValue.password,

      mobileNumber: formValue.mobileNumber

    }).subscribe({

      next: () => {

        this.toastr.success('User added successfully', 'Success');

        this.router.navigate(['/users']);

      },

      error: (err) => {

        console.error(err);

        this.toastr.error(err.error?.message ?? 'Unable to create internal staff.','Error');

      }

    });

  }

  else {

    this.userService.createInternalStaff({

      fullName: formValue.fullName,

      email: formValue.email,

      password: formValue.password,

      mobileNumber: formValue.mobileNumber

    }).subscribe({

      next: () => {

        this.toastr.success('User added successfully');

        this.router.navigate(['/users']);

      },

      error: (err) => {

        console.error(err);

        this.toastr.error('Unable to add user');

      }

    });

  }

}
}