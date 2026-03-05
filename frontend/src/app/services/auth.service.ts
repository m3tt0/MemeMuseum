import { Injectable, WritableSignal, computed, effect, signal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  userName?: string;
  profilePicture?: string;
  sub?: number;
  exp?: number;
  
}

export interface AuthState {
  user: string | null;
  userId: number | null;
  profilePicture: string | null;
  token: string | null;     
  isAuthenticated: boolean; 
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    user: this.getUserFromStorage(),
    userId: this.getUserIdFromStorage(),
    profilePicture: this.getUserPfpFromStorage(),
    token: this.getTokenFromStorage(),
    isAuthenticated: false,
  });

  user = computed(() => this.authState().user);
  userId = computed(() => this.authState().userId);
  profilePicture = computed(() => this.authState().profilePicture);
  token = computed(() => this.authState().token);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

constructor() {
  effect(() => {
    const { user, userId, token, profilePicture } = this.authState();


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

    if (userId !== null) {
      localStorage.setItem('userId', userId.toString());
    } else {
      localStorage.removeItem('userId');
    }

    if (profilePicture !== null) {
      localStorage.setItem('profilePicture', profilePicture);
    } else {
      localStorage.removeItem('profilePicture');
    }

  });

  this.checkInitialAuthState();
}


  async updateToken(token: string) {
    const decoded = this.safeDecode(token);
    const username = decoded?.userName ?? null;
    const userId = decoded?.sub ?? null;
    const profilePicture = decoded?.profilePicture ?? null;

    this.authState.set({
      user: username,
      userId: userId,
      profilePicture: profilePicture,
      token: token,
      isAuthenticated: this.verifyToken(token),
    });
  }


  getToken(): string | null {
    return this.authState().token;
  }

  getUserName(): string | null {
    return this.authState().user;
  }

  getUserId(): number | null {
    return this.authState().userId;
  }

  getUserPfp(): string | null {
    return this.authState().profilePicture;
  }


  private getTokenFromStorage(): string | null {
    return localStorage.getItem('token');
  }

  private getUserFromStorage(): string | null {
    return localStorage.getItem('user');
  }

  private getUserIdFromStorage(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  private getUserPfpFromStorage(): string | null {
    return localStorage.getItem('profilePicture');
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
    const userId = this.getUserIdFromStorage();
    const profilePicture = this.getUserPfpFromStorage();

    if (token && this.verifyToken(token)) {
      // token valido → stato autenticato
      this.authState.set({
        user,
        userId,
        profilePicture,
        token,
        isAuthenticated: true,
      });
    } else {
      // token assente o scaduto → logout
      this.authState.set({
        user: null,
        userId: null,
        profilePicture: null,
        token: null,
        isAuthenticated: false,
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('profilePicture');
    }
  }

  logout() {
    this.authState.set({
      user: null,
      userId: null,
      profilePicture: null,
      token: null,
      isAuthenticated: false,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePicture');
  }
}
