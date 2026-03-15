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
  Votes?: { voteId: number, voteType: number, userId: number}[];
  Comments?: { content: string, creationDate: string}[];
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
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

  // Ricerca / Gestione Meme
  getMemes(params: { page?: number; limit?: number }) {
    return this.http.get<Meme[]>(`${this.apiUrl}/memes/search`, {
      params: {
        page: String(params.page ?? 1),
        limit: String(params.limit ?? 10)
      }
    });
  }

  getDailyMemes(){
    return this.http.get<Meme[]>(`${this.apiUrl}/memes/daily`)
  }

  // Gestione Voti
  addVote(memeId: number, voteType: 'upvote' | 'downvote'){
    const vote = voteType === 'upvote' ? 1 : -1;
    return this.http.post(`${this.apiUrl}/memes/${memeId}/votes`, {voteType: vote}, this.httpOptions);
  }

  updateVote(voteId: number, newVoteType: 'upvote' | 'downvote'){
    const newVote = newVoteType === 'upvote' ? 1 : -1;
    return this.http.put(`${this.apiUrl}/votes/${voteId}`, { voteType: newVote }, this.httpOptions);
  }
}
