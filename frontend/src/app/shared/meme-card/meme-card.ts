import { Component, Input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meme } from '../../services/rest-backend.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-meme-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './meme-card.html',
  styleUrl: './meme-card.css',
})
export class MemeCard {
  @Input({ required: true }) meme!: Meme;
  backendBaseUrl = 'http://localhost:3030/';
  @Input() priority = false; // true SOLO per la prima immagine del feed

  get memeImageUrl(): string {
    return this.backendBaseUrl + this.meme.imagePath;
  }

  get authorPfpUrl(): string {
    const userPfp = this.meme.User.profilePicture;
    return userPfp ? this.backendBaseUrl + userPfp : '/defaultPfp.png';
  }
}
