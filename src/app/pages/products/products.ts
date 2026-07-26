import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { ProductService } from '../../services/insurance-product';
import { Product, ProductType } from '../../models/product';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ViewProduct implements OnInit {

  products = signal<Product[]>([]);

  selectedFilter = signal('all');

  selectedStatus = signal('all');

  isAdmin = signal(false);

  pageNumber = signal(1);

  pageSize = 10;

  totalPages = signal(1);

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    const role = localStorage.getItem('role');

    this.isAdmin.set(role === 'Admin');

    this.loadProducts();

  }

  loadProducts(): void {

    this.productService.getProducts(
      this.pageNumber(),
      this.pageSize,
      'ProductName',
      false
    ).subscribe({

      next: (response) => {

        this.pageNumber.set(response.data.currentPage);

        this.totalPages.set(response.data.totalPages);

        this.products.set(response.data.records);

        this.applyStatusFilter();

      },

      error: (error) => {

        console.error(error);

        this.toastr.error('Failed to load products.');

      }

    });

  }

  loadActiveProducts(): void {

    this.productService.getActiveProducts().subscribe({

      next: (response) => {

        this.products.set(response.data);

        this.applyStatusFilter();

      },

      error: (error) => {

        console.error(error);

        this.toastr.error('Failed to load active products.');

      }

    });

  }

  searchById(id: number): void {

    if (!id) {

      this.loadProducts();

      return;

    }

    this.productService.getProductById(id).subscribe({

      next: (response) => {

        this.products.set([response.data]);

      },

      error: (error) => {

        console.error(error);

        this.products.set([]);

        this.toastr.error('Product not found.');

      }

    });

  }

  onFilterChange(filter: string): void {

    this.selectedFilter.set(filter);

    switch (filter) {

      case 'all':
        this.loadProducts();
        break;

      case 'active':
        this.loadActiveProducts();
        break;

      case 'id':
        this.products.set([]);
        break;

    }

  }

  onStatusChange(status: string): void {

    this.selectedStatus.set(status);

    if (this.selectedFilter() === 'active') {

      this.loadActiveProducts();

    } else {

      this.loadProducts();

    }

  }

  applyStatusFilter(): void {

    const status = this.selectedStatus();

    if (status === 'all') {

      return;

    }

    const filtered = this.products().filter(product =>
      status === 'active'
        ? product.isActive
        : !product.isActive
    );

    this.products.set(filtered);

  }

  toggleStatus(product: Product): void {

    this.productService.updateProduct(
      product.productId,
      {
        productName: product.productName,
        productType: ProductType[product.productType as keyof typeof ProductType],
        description: product.description,
        isActive: !product.isActive
      }
    ).subscribe({

      next: () => {

        this.toastr.success(

          product.isActive
            ? 'Product deactivated successfully.'
            : 'Product activated successfully.'

        );

        if (this.selectedFilter() === 'active') {

          this.loadActiveProducts();

        } else {

          this.loadProducts();

        }

      },

      error: (error) => {

        console.error(error);

        this.toastr.error('Unable to update product status.');

      }

    });

  }

  previousPage(): void {

    if (this.pageNumber() > 1) {

      this.pageNumber.update(page => page - 1);

      this.loadProducts();

    }

  }

  nextPage(): void {

    if (this.pageNumber() < this.totalPages()) {

      this.pageNumber.update(page => page + 1);

      this.loadProducts();

    }

  }

}