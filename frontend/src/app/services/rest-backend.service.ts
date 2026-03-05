import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface AuthRequest {
  usr: string;
  pwd: string;
}

export interface LoginResponse {
  token: string;
}

export interface Meme {
  memeId: number;
  caption: string | null;
  imagePath: string;
  creationDate: string;
  userId: number;

  User: { userName: string, profilePicture?: string };
  Tags?: { content: string }[];
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
  Comments?: { content: string, creationDate: string}[];
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
  feed?: boolean;
}

export interface User {
  userId: number;
  userName: string;
  password?: string;
  profilePicture?: string;
  creationDate: string
}

@Injectable({ providedIn: 'root' })
export class RestBackendService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3030/api';

    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


  // Autenticazione
  login(credentials: AuthRequest){
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, this.httpOptions);
  }

  signup(credentials: AuthRequest){
    return this.http.post(`${this.apiUrl}/auth/signup`, credentials, this.httpOptions);
  }

  getMemes(params: MemeSearchParams = {}) {
    return this.http.get<Meme[]>(`${this.apiUrl}/memes/search`, {
      params: params as any,
    });
  }
}
