import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response';
import { PagedResponse } from '../models/paged-response';

import { PolicyPlan } from '../models/policy-plan';
import { PolicyPlanRequest } from '../models/policy-plan-request';
import { PolicyPlanQuery } from '../models/policy-plan-query';

@Injectable({
  providedIn: 'root'
})
export class PolicyPlanService {

  private apiUrl = 'https://localhost:7244/api/PolicyPlan';

  constructor(private http: HttpClient) { }

  getPlans(query: PolicyPlanQuery): Observable<ApiResponse<PagedResponse<PolicyPlan>>> {

    let params = new HttpParams()
      .set('PageNumber', query.pageNumber)
      .set('PageSize', query.pageSize)
      .set('SortField', query.sortField)
      .set('SortDirection', query.sortDirection);

    if (query.productId != null)
      params = params.set('ProductId', query.productId);

    if (query.isActive != null)
      params = params.set('IsActive', query.isActive);

    return this.http.get<ApiResponse<PagedResponse<PolicyPlan>>>(
      this.apiUrl,
      { params }
    );
  }

  getActivePlans(): Observable<ApiResponse<PolicyPlan[]>> {

    return this.http.get<ApiResponse<PolicyPlan[]>>(
      `${this.apiUrl}/active`
    );

  }

  getPlanById(id: number): Observable<ApiResponse<PolicyPlan>> {

    return this.http.get<ApiResponse<PolicyPlan>>(
      `${this.apiUrl}/${id}`
    );

  }

  getPlansByProduct(productId: number): Observable<ApiResponse<PolicyPlan[]>> {

    return this.http.get<ApiResponse<PolicyPlan[]>>(
      `${this.apiUrl}/product/${productId}`
    );

  }

  getActivePlansByProduct(productId: number): Observable<ApiResponse<PolicyPlan[]>> {

    return this.http.get<ApiResponse<PolicyPlan[]>>(
      `${this.apiUrl}/product/${productId}/active`
    );

  }

  addPlan(request: PolicyPlanRequest): Observable<ApiResponse<PolicyPlan>> {

    return this.http.post<ApiResponse<PolicyPlan>>(
      this.apiUrl,
      request
    );

  }

  updatePlan(id: number, request: PolicyPlanRequest): Observable<ApiResponse<any>> {

    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/${id}`,
      request
    );

  }

  deletePlan(id: number): Observable<ApiResponse<any>> {

    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${id}`
    );

  }

}