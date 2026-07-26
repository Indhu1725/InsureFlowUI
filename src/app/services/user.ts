import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserResponse } from '../models/user-response';
import { ApiResponse } from '../models/api-response';
import { AdminRequest } from '../models/admin-request';
import { InternalStaffRequest } from '../models/internal-staff-request';
import { UserStatusUpdate } from '../models/user-status-update';
import { PagedResponse } from '../models/paged-response';

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
): Observable<ApiResponse<PagedResponse<UserResponse>>> {

  const params = new HttpParams()
    .set('pageNumber', pageNumber)
    .set('pageSize', pageSize)
    .set('sortBy', sortBy)
    .set('sortDirection', sortDirection);

  return this.http.get<ApiResponse<PagedResponse<UserResponse>>>(
    this.apiUrl,
    { params }
  );
}

  // Get User By Id
  getUserById(id: number): Observable<ApiResponse<UserResponse>> {
  return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`);
}

  // Get Active Users
 getActiveUsers(): Observable<ApiResponse<UserResponse[]>> {

  return this.http.get<ApiResponse<UserResponse[]>>(
    `${this.apiUrl}/active`
  );

}

//Get Internal Staff
getInternalStaff(): Observable<ApiResponse<UserResponse[]>> {

  return this.http.get<ApiResponse<UserResponse[]>>(
    `${this.apiUrl}/internal-staff`
  );

}

  // Create Admin
createAdmin(data: AdminRequest): Observable<ApiResponse<UserResponse>> {
      return this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/admin`,data);}

  // Create Internal Staff
  createInternalStaff(
  data: InternalStaffRequest
): Observable<ApiResponse<UserResponse>> {

  return this.http.post<ApiResponse<UserResponse>>(
    `${this.apiUrl}/internal-staff`,
    data
  );
}

  // Activate / Deactivate User
 updateStatus(
  id: number,
  status: UserStatusUpdate
): Observable<ApiResponse<UserResponse>> {

  return this.http.put<ApiResponse<UserResponse>>(
    `${this.apiUrl}/${id}/status`,
    status
  );
}

}