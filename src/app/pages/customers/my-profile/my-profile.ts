import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';

import { Sidebar } from '../../../layout/sidebar/sidebar';
import { Navbar } from '../../../layout/navbar/navbar';

import { CustomerService } from '../../../services/customer';

import { Customer } from '../../../models/customer';
import { CustomerRequest } from '../../../models/customer-request';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    Sidebar,
    Navbar
  ],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {

  customer$!: Observable<Customer | null>;

  showCreateForm: boolean = false;

  customerRequest: CustomerRequest = {
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    nomineeName: '',
    nomineeRelation: ''
  };

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.customer$ = this.customerService
      .getMyProfile()
      .pipe(
        map(response => response.data),

        catchError(error => {

          if (error.status === 404) {
            this.showCreateForm = true;
          }

          return of(null);
        })
      );
  }

  saveProfile(): void {
    this.customerService
      .createCustomer(this.customerRequest)
      .subscribe({
        next: () => {
          alert('Profile created successfully');
          this.router.navigate(['/customers/my-profile']);
        },

        error: (error) => {
          console.log(error);
          alert('Unable to create profile');
        }
      });
  }
}