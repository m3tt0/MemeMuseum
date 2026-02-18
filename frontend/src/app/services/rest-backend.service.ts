import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface AuthRequest {
  usr: string;
  pwd: string;
}

export interface LoginResponse {
  token: string;
}

export interface SignupResponse {
  usr: string;
  pwd: string;
}

export interface Meme {
  memeId: number;
  caption: string | null;
  imagePath: string;
  creationDate: string;
  userId: number;

  User: { userName: string };
  tags?: { content: string }[];
  upvotes?: number;
  downvotes?: number;
}

export interface MemeSearchParams {
  tag?: string;
  text?: string;
  from?: string;
  to?: string;
  username?: string;
  sort?: 'newest' | 'oldest' | 'top' | 'bottom';
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class RestBackendService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3030/api';

  // Autenticazione
  login(credentials: AuthRequest){
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  signup(credentials: AuthRequest){
    return this.http.post<SignupResponse>(`${this.apiUrl}/auth/signup`, credentials);
  }

  getMemes(params: MemeSearchParams = {}) {
    return this.http.get<Meme[]>(`${this.apiUrl}/memes/search`, {
      params: params as any,
    });
  }


}
