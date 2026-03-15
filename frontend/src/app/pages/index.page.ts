import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestBackendService, Meme } from '../services/rest-backend.service';
import { Navbar } from "../shared/navbar/navbar";
import { MemeFeed } from '../shared/meme-feed/meme-feed';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'home-page',
  imports: [CommonModule, Navbar, MemeFeed],
  templateUrl: './index.page.html',
})
export default class HomePage implements OnInit {
  private restService = inject(RestBackendService);

  memes = signal<Meme[]>([]);
  dailyMemes = signal<Meme[]>([]);
  loading = signal(false);
  hasMore = signal(true);
  page = signal(1);

  viewMode = signal<'feed' | 'daily'>('feed');
  currentMemes = computed(() =>
  this.viewMode() === 'daily' ? this.dailyMemes() : this.memes()
  );

  showDailyMemeButton = signal(true);

  limit = 10;

  ngOnInit(): void {
    this.loadMoreMemes();
  }

  closeDailyMeme() {
    this.showDailyMemeButton.set(false);
  }

  loadMoreMemes(): void {
    if (this.loading() || !this.hasMore()) return;

    this.loading.set(true);

    this.restService.getMemes({
      page: this.page(),
      limit: this.limit
    })
    .pipe(
      finalize(() => {
        this.loading.set(false);
      })
    )
    .subscribe({
      next: (newMemes) => {
        if (!Array.isArray(newMemes)) {
          this.hasMore.set(false);
          return;
        }

        this.memes.update(current => [...current, ...newMemes]);

        if (newMemes.length < this.limit) {
          this.hasMore.set(false);
        } else {
          this.page.update(p => p + 1);
        }
      },
      error: (err) => {
        console.error('Errore caricamento meme:', err);
        this.hasMore.set(false);
      }
    });
  }

  openDailyMemes(): void {
    if (this.loading()) return;

    this.loading.set(true);

    this.restService.getDailyMemes()
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (memes) => {
          this.dailyMemes.set(memes);
          this.viewMode.set('daily');
        },
        error: (err) => {
          console.error('Errore caricamento daily memes:', err);
        }
    });
  }

  backToFeed(): void {
    this.viewMode.set('feed');
  }
}