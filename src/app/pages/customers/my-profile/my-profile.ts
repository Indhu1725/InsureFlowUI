import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Sidebar } from '../../../layout/sidebar/sidebar';
import { Navbar } from '../../../layout/navbar/navbar';
import { CustomerService } from '../../../services/customer';
import { Customer } from '../../../models/customer';
import { CustomerRequest } from '../../../models/customer-request';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,Sidebar,Navbar],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {

  customer = signal<Customer | null>(null);

  showCreateForm = signal(false);

  customerRequest = signal<CustomerRequest>({
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pinCode: '',
    nomineeName: '',
    nomineeRelation: ''
  });

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {

    this.customerService.getMyProfile().subscribe({

      next: (response) => {

        this.customer.set(response.data);

        this.showCreateForm.set(false);

      },

      error: (error) => {

        if (error.status === 404) {

          this.customer.set(null);

          this.showCreateForm.set(true);

        } else {

          console.error(error);

          this.toastr.error('Unable to load profile.');

        }

      }

    });

  }

  saveProfile(): void {

    this.customerService
      .createCustomer(this.customerRequest())
      .subscribe({

        next: () => {

          this.toastr.success('Profile created successfully.');

          this.router.navigate(['/customers/my-profile']);

        },

        error: (error) => {

          console.error(error);

          this.toastr.error('Unable to create profile.');

        }

      });

  }

  updateCustomerField<K extends keyof CustomerRequest>(
    field: K,
    value: CustomerRequest[K]
  ): void {

    this.customerRequest.update(customer => ({
      ...customer,
      [field]: value
    }));

  }

}