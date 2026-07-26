import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response';
import { PagedResponse } from '../models/paged-response';

import { PolicyResponse } from '../models/policy-response';
import { PurchasePolicyRequest } from '../models/purchase-policy-request';
import { IssuePolicyRequest } from '../models/issue-policy-request';
import { PolicyQuery } from '../models/policy-query';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  role = localStorage.getItem('role') ?? '';

  private apiUrl = 'https://localhost:7244/api/Policy';

  constructor(private http: HttpClient) { }

  //Get All Policies
  getPolicies(
  query: PolicyQuery = {}
): Observable<ApiResponse<PagedResponse<PolicyResponse>>> {

  let params = new HttpParams();

  if (query.pageNumber)
    params = params.set('pageNumber', query.pageNumber);

  if (query.pageSize)
    params = params.set('pageSize', query.pageSize);

  if (query.sortBy)
    params = params.set('sortBy', query.sortBy);

  if (query.sortDirection)
    params = params.set('sortDirection', query.sortDirection);

  if (query.status)
    params = params.set('status', query.status);

  if (query.customerId)
    params = params.set('customerId', query.customerId);

  if (query.planId)
    params = params.set('planId', query.planId);

  return this.http.get<ApiResponse<PagedResponse<PolicyResponse>>>(
    this.apiUrl,
    { params }
  );

}

//Get Active Policies
getActivePolicies(): Observable<ApiResponse<PolicyResponse[]>> {

  return this.http.get<ApiResponse<PolicyResponse[]>>(
    `${this.apiUrl}/active`
  );

}
//Get Policy By Id
getPolicyById(id: number): Observable<ApiResponse<PolicyResponse>> {

  return this.http.get<ApiResponse<PolicyResponse>>(
    `${this.apiUrl}/${id}`
  );

}
//Get Policy By Policy Number
getPolicyByNumber(
  policyNumber: string
): Observable<ApiResponse<PolicyResponse>> {

  return this.http.get<ApiResponse<PolicyResponse>>(
    `${this.apiUrl}/number/${policyNumber}`
  );

}
//Get Customer Policies
getPoliciesByCustomer(
  customerId: number
): Observable<ApiResponse<PolicyResponse[]>> {

  return this.http.get<ApiResponse<PolicyResponse[]>>(
    `${this.apiUrl}/customer/${customerId}`
  );

}
//Get Active Customer Policies
getActivePoliciesByCustomer(
  customerId: number
): Observable<ApiResponse<PolicyResponse[]>> {

  return this.http.get<ApiResponse<PolicyResponse[]>>(
    `${this.apiUrl}/customer/${customerId}/active`
  );

}
//Get My Policies
getMyPolicies(): Observable<ApiResponse<PolicyResponse[]>> {

  return this.http.get<ApiResponse<PolicyResponse[]>>(
    `${this.apiUrl}/my`
  );

}
//Purchase Policy
purchasePolicy(
  request: PurchasePolicyRequest
): Observable<ApiResponse<PolicyResponse>> {

  return this.http.post<ApiResponse<PolicyResponse>>(
    `${this.apiUrl}/purchase`,
    request
  );

}
//Issue Policy
issuePolicy(
  request: IssuePolicyRequest
): Observable<ApiResponse<PolicyResponse>> {

  return this.http.post<ApiResponse<PolicyResponse>>(
    `${this.apiUrl}/issue`,
    request
  );

}
//Cancel Policy
cancelPolicy(
  id: number
): Observable<ApiResponse<PolicyResponse>> {

  return this.http.put<ApiResponse<PolicyResponse>>(
    `${this.apiUrl}/cancel/${id}`,
    {}
  );

}



}