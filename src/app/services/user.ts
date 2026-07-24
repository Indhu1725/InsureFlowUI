import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserResponse } from '../models/user-response';
import { AdminRequest } from '../models/admin-request';
import { InternalStaffRequest } from '../models/internal-staff-request';
import { UserStatusUpdate } from '../models/user-status-update';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://localhost:7244/api/User';

  constructor(private http: HttpClient) { }

  // Get All Users
  getUsers(
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdDate',
    sortDirection: string = 'desc'
  ): Observable<any> {

    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Get User By Id
  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/${id}`);
  }

  // Get Active Users
 getActiveUsers(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/active`);
}

//Get Internal Staff
getInternalStaff(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/internal-staff`);
}

  // Create Admin
  createAdmin(data: AdminRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/admin`, data);
  }

  // Create Internal Staff
  createInternalStaff(data: InternalStaffRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/internal-staff`, data);
  }

  // Activate / Deactivate User
  updateStatus(id: number, status: UserStatusUpdate): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/${id}/status`, status);
  }

}