import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CustomerRequest } from '../models/customer-request';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'https://localhost:7244/api/Customer';

  constructor(private http: HttpClient) { }

  // Get All Customers
  getCustomers(
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createddate',
    sortDirection: string = 'desc'
  ): Observable<any> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Get Customer By Id
  getCustomerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Get Customer By User Id
  getCustomerByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  // Get Active Customers
  getActiveCustomers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/active`);
  }

  // Get My Profile
  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  // Create Customer
  createCustomer(request: CustomerRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }

  // Update Customer
  updateCustomer(
    id: number,
    request: CustomerRequest
  ): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

}