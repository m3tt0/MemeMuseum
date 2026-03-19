import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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

  User: User;
  Tags?: { content: string }[];
  Votes?: Vote[];
  Comments?: { content: string, creationDate: string}[];
  upvotes?: number;
  downvotes?: number;
  commentsCount?: number;
}

export interface CreateMemePayload {
  image: File;
  caption: string;
  tags: string[];
}

export interface MemeSearchParams {
  tag?: string;
  text?: string;
  from?: string;
  to?: string;
  username?: string;
  sort?: 'newest' | 'oldest' | 'top' | 'bottom';
  page: number;
  limit: number;
}

export interface User {
  userId: number;
  userName: string;
  password?: string;
  profilePicture?: string;
  creationDate: string
}

export interface Vote {
  voteId: number;
  voteType: number;
  userId: number;
  memeId: number;
  creationDate: string;
}

export interface Comment {
  commentId: number;
  content: string;
  creationDate: string;
  userId: number;
  memeId: number;
  User: User;
}

export interface PaginatedComments {
  items: Comment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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




  /*
      ##################
        AUTENTICAZIONE
      ##################
  */  

  login(credentials: AuthRequest){
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials, this.httpOptions);
  }

  signup(credentials: AuthRequest){
    return this.http.post(`${this.apiUrl}/auth/signup`, credentials, this.httpOptions);
  }

/*
      ###################
        GESTIONE UTENTE 
      ###################
*/

  updateProfilePicture(userId: number, formData: FormData){
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/profilePicture`, formData);
  }

  updatePassword(userId: number, oldPassword: string, newPassword: string){
    return this.http.put(`${this.apiUrl}/users/${userId}/password`, { oldPassword, newPassword }, this.httpOptions);
  }
  
  updateUsername(userId: number, newUsername: string){
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/username`, { newUsername }, this.httpOptions);
  }

  deleteUser(userId: number, pwd: string){
    return this.http.delete(`${this.apiUrl}/users/${userId}`, { body: { pwd }, ...this.httpOptions });
  }

  /*
      #################
        GESTIONE MEME 
      #################
  */
  getMemes(params: MemeSearchParams) {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return this.http.get<Meme[]>(`${this.apiUrl}/memes/search`, {
      params: httpParams
    });
  }

  getDailyMemes(){
    return this.http.get<Meme[]>(`${this.apiUrl}/memes/daily`)
  }

  createMeme(payload: CreateMemePayload){
    const formData = new FormData();

    formData.append('image', payload.image);
    formData.append('caption', payload.caption);

    payload.tags.forEach(tag => {
      formData.append('tags', tag);
    });

    return this.http.post(`${this.apiUrl}/memes`, formData);
  }

  updateMeme(memeId: number, caption: string){
    return this.http.put(`${this.apiUrl}/memes/${memeId}`, { caption }, this.httpOptions);
  }

  deleteMeme(memeId: number){
    return this.http.delete(`${this.apiUrl}/memes/${memeId}`);
  }



  /*
      #################
        GESTIONE VOTI 
      #################
  */
  addVote(memeId: number, voteType: 'upvote' | 'downvote'){
    const vote = voteType === 'upvote' ? 1 : -1;
    return this.http.post<Vote>(`${this.apiUrl}/memes/${memeId}/votes`, {voteType: vote}, this.httpOptions);
  }

  updateVote(voteId: number, newVoteType: 'upvote' | 'downvote'){
    const newVote = newVoteType === 'upvote' ? 1 : -1;
    return this.http.put<Vote>(`${this.apiUrl}/votes/${voteId}`, { voteType: newVote }, this.httpOptions);
  }

  deleteVote(voteId: number) {
    return this.http.delete(`${this.apiUrl}/votes/${voteId}`);
  }




  /*
      #####################
        GESTIONE COMMENTI 
      #####################
  */
  getComments(memeId: number, page: number = 1, pageSize: number = 10){
    return this.http.get<PaginatedComments>(`${this.apiUrl}/memes/${memeId}/comments`, {
      params: {
        page: String(page),
        pageSize: String(pageSize),
      }
    });
  }

  createComment(memeId: number, content: string){
    return this.http.post<Comment>(`${this.apiUrl}/memes/${memeId}/comments`, { content }, this.httpOptions);
  }

  updateComment(commentId: number, content: string){
    return this.http.put<Comment>(`${this.apiUrl}/comments/${commentId}`, { content }, this.httpOptions);
  }

  deleteComment(commentId: number){
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`); 
  }
}
