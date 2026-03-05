import { Component, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MemeCard } from '../meme-card/meme-card';
import { Meme } from '../../services/rest-backend.service';

@Component({
  selector: 'app-meme-feed',
  imports: [ CommonModule, MemeCard ],
  templateUrl: './meme-feed.html',
  styleUrl: './meme-feed.css',
})
export class MemeFeed {
  @Input({ required: true }) memes: Meme[] = [];
  
  backendBaseUrl = 'http://localhost:3030/';
}
