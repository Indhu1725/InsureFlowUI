import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { OnInit } from '@angular/core';

import { ProductService } from '../../services/insurance-product';
import { Product } from '../../models/product';
import { ProductRequest, ProductType } from '../../models/product';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ViewProduct implements OnInit {

  products$!: Observable<Product[]>;

  selectedFilter = 'all';
  selectedStatus = 'all';
  isAdmin = false;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;

  constructor(private productService: ProductService) {}
  ngOnInit(): void {

  const role = localStorage.getItem('role');

  this.isAdmin = role === 'Admin';

  this.loadProducts();

}

  loadProducts(): void {

  this.products$ = this.productService
    .getProducts(
      this.pageNumber,
      this.pageSize,
      'ProductName',
      false
    )
    .pipe(

      map(response => {

        this.pageNumber = response.data.currentPage;

        this.totalPages = response.data.totalPages;

        return response.data.records;

      })

    );

}

  loadActiveProducts(): void {

    this.products$ = this.productService
      .getActiveProducts()
      .pipe(
        map(response => response.data)
      );
  }

  searchById(id: number): void {

    if (!id) {
      this.loadProducts();
      return;
    }

    this.products$ = this.productService
      .getProductById(id)
      .pipe(
        map(response => [response.data])
      );
  }

  onFilterChange(filter: string): void {

    this.selectedFilter = filter;

    switch (filter) {

      case 'all':
        this.loadProducts();
        break;

      case 'active':
        this.loadActiveProducts();
        break;

      case 'id':
        this.products$ = new Observable<Product[]>();
        break;
    }
  }

  onStatusChange(status: string): void {

    this.selectedStatus = status;

    if (this.selectedFilter === 'active') {
      this.loadActiveProducts();
    } else {
      this.loadProducts();
    }

    this.products$ = this.products$.pipe(
      map(products => {

        if (status === 'all') {
          return products;
        }

        if (status === 'active') {
          return products.filter(x => x.isActive);
        }

        return products.filter(x => !x.isActive);
      })
    );
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
    )
    .subscribe({

      next: () => {

        alert(
          product.isActive
            ? 'Product deactivated successfully.'
            : 'Product activated successfully.'
        );

        if (this.selectedFilter === 'active') {
          this.loadActiveProducts();
        } else {
          this.loadProducts();
        }
      },

      error: (error) => {
        console.log(error);
        alert('Unable to update product status.');
      }

    });
  }
  previousPage(): void {

  if (this.pageNumber > 1) {

    this.pageNumber--;

    this.loadProducts();

  }

}
nextPage(): void {

  if (this.pageNumber < this.totalPages) {

    this.pageNumber++;

    this.loadProducts();

  }

}
}