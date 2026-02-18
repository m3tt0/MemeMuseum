import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  user?: string;
  sub?: number;
  exp?: number;
  
}

export interface AuthState {
  user: string | null;      
  token: string | null;     
  isAuthenticated: boolean; 
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUserFromStorage(),
    token: this.getTokenFromStorage(),
    isAuthenticated: false,
  });

  user = computed(() => this.authState().user);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

constructor() {
  effect(() => {
    const { user, token } = this.authState();


    if (token !== null) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }

    if (user !== null) {
      localStorage.setItem('user', user);
    } else {
      localStorage.removeItem('user');
    }
  });

  this.checkInitialAuthState();
}


  async updateToken(token: string) {
    const decoded = this.safeDecode(token);
    const username = decoded?.user ?? null;

    this.authState.set({
      user: username,
      token,
      isAuthenticated: this.verifyToken(token),
    });
  }


  getToken(): string | null {
    return this.authState().token;
  }

  getUser(): string | null {
    return this.authState().user;
  }

  private getTokenFromStorage(): string | null {
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): string | null {
    return localStorage.getItem('user');
  }

  private safeDecode(token: string | null): DecodedToken | null {
    if (!token) return null;
      return jwtDecode<DecodedToken>(token);
  }

  verifyToken(token: string | null): boolean {
    if (!token) return false;

    const decoded = this.safeDecode(token);
    if (!decoded || decoded.exp === undefined) {
      return false;
    }

    // exp in secondi → millisecondi
    return Date.now() < decoded.exp * 1000;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getToken());
  }



  private checkInitialAuthState() {
    const token = this.getTokenFromStorage();
    const user = this.getUserFromStorage();

    if (token && this.verifyToken(token)) {
      // token valido → stato autenticato
      this.authState.set({
        user,
        token,
        isAuthenticated: true,
      });
    } else {
      // token assente o scaduto → logout
      this.authState.set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  logout() {
    this.authState.set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
