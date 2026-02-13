// src/app/services/auth.service.ts
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { 
  RestBackendService, 
  AuthRequest, 
  LoginResponse,
  SignupResponse 
} from './rest-backend.service';

export interface User {
  userId: number;
  userName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private backendService = inject(RestBackendService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  // Stato reattivo
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  
  private isBrowser = isPlatformBrowser(this.platformId);
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_KEY = 'user';

  constructor() {
    this.checkAuthStatus();
  }

  // Login - riceve token e poi estrae user info dal token
  login(credentials: AuthRequest): Observable<LoginResponse> {
    return this.backendService.login(credentials).pipe(
      tap(response => {
        // Salva il token
        if (this.isBrowser) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }

        // Estrae le info utente dal JWT
        const userInfo = this.decodeToken(response.token);
        if (userInfo) {
          if (this.isBrowser) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
          }
          this.currentUser.set(userInfo);
          this.isAuthenticated.set(true);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // Signup - registra l'utente e poi fa il login automatico
  signup(userData: AuthRequest): Observable<SignupResponse> {
    return this.backendService.signup(userData).pipe(
      tap(response => {
        console.log('Signup successful:', response);
        // Non fare login automatico, reindirizza alla login
      }),
      catchError(error => {
        console.error('Signup error:', error);
        return throwError(() => error);
      })
    );
  }

  // Signup con auto-login (alternativa)
  signupAndLogin(userData: AuthRequest): Observable<LoginResponse> {
    return this.backendService.signup(userData).pipe(
      switchMap(() => {
        // Dopo signup, fai login automatico
        return this.login(userData);
      }),
      catchError(error => {
        console.error('Signup/Login error:', error);
        return throwError(() => error);
      })
    );
  }

  // Logout
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  // Ottieni il token JWT
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  // Ottieni l'utente corrente
  getUser(): User | null {
    if (this.isBrowser) {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Decodifica il JWT per estrarre le info utente
  private decodeToken(token: string): User | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: payload.sub,
        userName: payload.userName
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  // Verifica se il token è valido
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Controlla se è scaduto (exp in secondi)
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }

  // Controlla lo stato di autenticazione all'avvio
  private checkAuthStatus(): void {
    if (this.isBrowser) {
      const token = this.getToken();
      const user = this.getUser();
      
      if (token && user && this.isTokenValid()) {
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } else if (token && !user) {
        // Se c'è il token ma non le info utente, prova a decodificarle
        const decodedUser = this.decodeToken(token);
        if (decodedUser && this.isTokenValid()) {
          if (this.isBrowser) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(decodedUser));
          }
          this.currentUser.set(decodedUser);
          this.isAuthenticated.set(true);
        }
      } else {
        // Token scaduto o non valido
        this.logout();
      }
    }
  }
}
