import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product, ProductRequest } from '../models/product';
import { ApiResponse } from '../models/api-response';
import { PagedResponse } from '../models/paged-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'https://localhost:7244/api/InsuranceProduct';

  constructor(private http: HttpClient) { }

  // Get All Products
  getProducts(
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'ProductName',
    descending: boolean = false,
    search?: string,
    productType?: string,
    isActive?: boolean
  ): Observable<ApiResponse<PagedResponse<Product>>> {

    let params = new HttpParams()
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize)
      .set('SortBy', sortBy)
      .set('Descending', descending);

    if (search) {
      params = params.set('Search', search);
    }

    if (productType) {
      params = params.set('ProductType', productType);
    }

    if (isActive !== undefined) {
      params = params.set('IsActive', isActive);
    }

    return this.http.get<ApiResponse<PagedResponse<Product>>>(
      this.apiUrl,
      { params }
    );
  }

  // Get Active Products
  getActiveProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(
      `${this.apiUrl}/active`
    );
  }

  // Get Product By Id
  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      `${this.apiUrl}/${id}`
    );
  }

  // Get Product By Name
  getProductByName(name: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      `${this.apiUrl}/name/${name}`
    );
  }

  // Create Product
  createProduct(request: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(
      this.apiUrl,
      request
    );
  }

  // Update Product
  updateProduct(id: number, request: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  // Soft Delete Product
  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${id}`
    );
  }
}