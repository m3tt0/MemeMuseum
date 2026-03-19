import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemeCard } from '../meme-card/meme-card';
import { Meme } from '../_services/backend/rest-backend.service';

@Component({
  selector: 'app-meme-feed',
  imports: [ CommonModule, MemeCard ],
  templateUrl: './meme-feed.html',
  styleUrl: './meme-feed.css',
})
export class MemeFeed {
  @Input({ required: true }) memes: Meme[] = []; 
  @Output() memeDeleted = new EventEmitter<number>();
  @Output() captionUpdated = new EventEmitter<{ memeId: number; caption: string }>();
}
