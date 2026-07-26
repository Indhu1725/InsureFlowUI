import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PremiumPayment } from '../models/premium-payment';
import { PremiumDue } from '../models/premium-due';
import { PremiumPaymentRequest } from '../models/premium-payment-request';

@Injectable({
  providedIn: 'root'
})
export class PremiumPaymentService {

  private apiUrl = 'https://localhost:7244/api/PremiumPayment';

  constructor(private http: HttpClient) { }

  // Get All Payments
  getPayments(
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'paymentDate',
    sortDirection: string = 'desc'
  ): Observable<any> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Get Payment By Id
  getPaymentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  // Get Payments By Policy
  getPaymentsByPolicy(
    policyId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<any>(
      `${this.apiUrl}/policy/${policyId}`,
      { params }
    );
  }

  // Get Payments By Customer
  getPaymentsByCustomer(
    customerId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<any>(
      `${this.apiUrl}/customer/${customerId}`,
      { params }
    );
  }
  // Make Payment
  makePayment(request: PremiumPaymentRequest): Observable<any> {
    return this.http.post<any>(this.apiUrl, request);
  }
  getPremiumDue() {
  return this.http.get<any>(`${this.apiUrl}/due`);
}
getMyPayments(
  pageNumber: number = 1,
  pageSize: number = 10
): Observable<any> {

  let params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize);

  return this.http.get<any>(
    `${this.apiUrl}/my-payments`,
    { params }
  );
}

}