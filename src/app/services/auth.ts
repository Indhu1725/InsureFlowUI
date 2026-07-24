import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';
import { UserResponse } from '../models/user-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7244/api/Auth';

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    );

  }

  register(request: RegisterRequest): Observable<UserResponse> {

    return this.http.post<UserResponse>(
      `${this.apiUrl}/register`,
      request
    );

  }

  logout() {

    localStorage.removeItem('token');

    localStorage.removeItem('role');

    localStorage.removeItem('email');

  }

  saveUser(response: LoginResponse) {

  localStorage.setItem('token', response.jwtToken);

  localStorage.setItem('role', response.userRole);

  localStorage.setItem('email', response.userEmail);

}

  getToken(): string | null {

    return localStorage.getItem('token');

  }

  getRole(): string | null {

    return localStorage.getItem('role');

  }

  isLoggedIn(): boolean {

    return this.getToken() != null;

  }

} 