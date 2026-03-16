import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestBackendService, Meme } from '../services/rest-backend.service';
import { Navbar } from "../shared/navbar/navbar";
import { MemeFeed } from '../shared/meme-feed/meme-feed';
import { finalize } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'home-page',
  imports: [CommonModule, Navbar, MemeFeed],
  templateUrl: './index.page.html',
})
export default class HomePage implements OnInit {
  private restService = inject(RestBackendService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  memes = signal<Meme[]>([]);
  dailyMemes = signal<Meme[]>([]);
  searchMemes = signal<Meme[]>([]);

  loading = signal(false);
  hasMore = signal(true);
  page = signal(1);

  viewMode = signal<'feed' | 'daily' | 'search'>('feed');
  currentMemes = computed(() =>
  this.viewMode() === 'daily' ? this.dailyMemes() :
  this.viewMode() === 'search' ? this.searchMemes(): this.memes()
  );

  showDailyMemeButton = signal(true);

  limit = 10;

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: params => {

        if (Object.keys(params).length === 0) {
          this.viewMode.set('feed');
          this.loadMemes();
          return;
        }

        this.viewMode.set('search');
        this.loadSearchMeme(params);
      }
    });
  }

  loadMemes(): void {
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
        console.error('Somethin went wrong during loading Meme Feed:', err);
        this.hasMore.set(false);
      }
    });
  }

  loadSearchMeme(params: Params): void {
    if (this.loading() || !this.hasMore()) return;

    this.searchMemes.set([]);
    this.page.set(1);
    this.hasMore.set(true);
    this.loading.set(true);

    this.restService.getMemes({
      tag: params['text'],
      //text: params['text'],
      //username: params['text'],
      from: params['from'],
      to: params['to'],
      sort: params['sort'],
      page: this.page(),
      limit: this.limit
    })
    .pipe(
      finalize(() => this.loading.set(false))
    )
    .subscribe({
      next: (memes) => {
        this.searchMemes.set(memes);
        this.viewMode.set('search');
      },
      error: (err) => {
        console.error('Something went wrong during loading Search Meme', err);
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
          console.error('Something went wrong during loading Daily Meme', err);
        }
    });
  }

  closeDailyMeme() {
    this.showDailyMemeButton.set(false);
  }

  backToFeed(): void {
    this.router.navigateByUrl('/');
    this.viewMode.set('feed');
  }
}