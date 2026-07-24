import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { Sidebar } from '../../layout/sidebar/sidebar';
import { Navbar } from '../../layout/navbar/navbar';
import { CustomerService } from '../../services/customer';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe, Sidebar, Navbar],
  templateUrl: './customers.html',
  styleUrl: './customers.css'
})
export class ViewCustomer implements OnInit {

  customers$!: Observable<Customer[]>;
  allCustomers: Customer[] = [];
  selectedFilter = 'all';
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  role = localStorage.getItem('role') ?? '';
  constructor(
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {

  this.customers$ = this.customerService
    .getCustomers(
      this.pageNumber,
      this.pageSize,
      'createdDate',
      'desc'
    )
    .pipe(

      map(response => {

        this.allCustomers = response.data.records;

        this.totalPages = response.data.totalPages;

        this.pageNumber = response.data.currentPage;

        return response.data.records;

      })

    );

}

  onFilterChange(filter: string): void {

    this.selectedFilter = filter;

    if (filter === 'all') {
      this.loadCustomers();

    }

    else if (filter === 'active') {

      this.customers$ = this.customerService

        .getActiveCustomers()

        .pipe(

          map(response => response.data)

        );


    }
    else if (filter === 'id') {
      this.customers$ = of([]);
    }

  }
  searchById(id: number): void {
    this.customers$ = this.customerService

      .getCustomerById(id)

      .pipe(

        map(response => [response.data])

      );


  }
  onStatusChange(status: string): void {
    if (status === 'all') {
      this.customers$ = of(this.allCustomers);
    }
    else if (status === 'active') {
      this.customers$ = of(

        this.allCustomers

          .filter(customer => customer.isActive)

      );


    }
    else if (status === 'inactive') {
      this.customers$ = of(

        this.allCustomers

          .filter(customer => !customer.isActive)

      );
    }

  }
  previousPage(): void {

  if (this.pageNumber > 1) {

    this.pageNumber--;

    this.loadCustomers();

  }

}
nextPage(): void {

  if (this.pageNumber < this.totalPages) {

    this.pageNumber++;

    this.loadCustomers();

  }

}

}