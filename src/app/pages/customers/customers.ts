import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Sidebar } from '../../layout/sidebar/sidebar';
import { Navbar } from '../../layout/navbar/navbar';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Navbar],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class ViewCustomer implements OnInit {

  customers = signal<Customer[]>([]);
  allCustomers = signal<Customer[]>([]);

  selectedFilter = signal('all');

  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(1);

  isLoading = signal(false);

  role = localStorage.getItem('role') ?? '';

  constructor(
    private customerService: CustomerService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

    this.isLoading.set(true);

    this.customerService.getCustomers(
      this.pageNumber(),
      this.pageSize(),
      'createdDate',
      'desc'
    ).subscribe({

      next: (response) => {

        this.customers.set(response.data.records);

        this.allCustomers.set(response.data.records);

        this.pageNumber.set(response.data.currentPage);

        this.totalPages.set(response.data.totalPages);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.toastr.error(
          'Unable to load customers.',
          'Error'
        );

      }

    });

  }

  onFilterChange(filter: string): void {

    this.selectedFilter.set(filter);

    if (filter === 'all') {

      this.loadCustomers();

    }

    else if (filter === 'active') {

      this.isLoading.set(true);

      this.customerService.getActiveCustomers().subscribe({

        next: (response) => {

          this.customers.set(response.data);

          this.allCustomers.set(response.data);

          this.isLoading.set(false);

        },

        error: () => {

          this.isLoading.set(false);

          this.toastr.error(
            'Unable to load active customers.',
            'Error'
          );

        }

      });

    }

    else if (filter === 'id') {

      this.customers.set([]);

    }

  }

  searchById(id: number): void {

    if (!id) {

      this.toastr.warning(
        'Please enter a Customer ID.',
        'Warning'
      );

      return;

    }

    this.isLoading.set(true);

    this.customerService.getCustomerById(id).subscribe({

      next: (response) => {

        this.customers.set([response.data]);

        this.allCustomers.set([response.data]);

        this.isLoading.set(false);

      },

      error: () => {

        this.isLoading.set(false);

        this.customers.set([]);

        this.toastr.error(
          'Customer not found.',
          'Error'
        );

      }

    });

  }

  onStatusChange(status: string): void {

    if (status === 'all') {

      this.customers.set(this.allCustomers());

    }

    else if (status === 'active') {

      this.customers.set(

        this.allCustomers().filter(customer => customer.isActive)

      );

    }

    else if (status === 'inactive') {

      this.customers.set(

        this.allCustomers().filter(customer => !customer.isActive)

      );

    }

  }

  previousPage(): void {

    if (this.pageNumber() > 1) {

      this.pageNumber.update(value => value - 1);

      this.loadCustomers();

    }

  }

  nextPage(): void {

    if (this.pageNumber() < this.totalPages()) {

      this.pageNumber.update(value => value + 1);

      this.loadCustomers();

    }

  }

}