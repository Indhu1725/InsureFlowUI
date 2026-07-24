export interface LoginResponse {
  jwtToken: string;
  tokenType: string;
  userEmail: string;
  userRole: string;
  tokenExpiry: string;
}