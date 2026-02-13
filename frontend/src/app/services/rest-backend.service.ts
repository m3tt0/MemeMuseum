import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthRequest {
  usr: string;
  pwd: string;
}
// Response del login
export interface LoginResponse {
  token: string;
}

// Response del signup
export interface SignupResponse {
  userId: number;
  userName: string;
}

export interface AuthResponse {
  token: string;
  user: {
    userId: number;
    userName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class RestBackendService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3030/api';

  // Autenticazione
  login(credentials: AuthRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  signup(userData: AuthRequest): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, userData);
  }

  // Altri metodi per future API


  // Aggiungerai altre chiamate API qui in futuro
}
