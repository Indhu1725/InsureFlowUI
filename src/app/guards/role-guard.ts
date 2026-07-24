import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const jwtHelper = new JwtHelperService();

  if (jwtHelper.isTokenExpired(token)) {
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }

  const decodedToken: any = jwtHelper.decodeToken(token);

  const userRole =
    decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  const requiredRole = route.data['role'];

  // Supports multiple roles
  if (Array.isArray(requiredRole)) {

    if (requiredRole.includes(userRole)) {
      return true;
    }

  }
  // Supports single role
  else {

    if (userRole === requiredRole) {
      return true;
    }

  }

  router.navigate(['/dashboard']);

  return false;

};