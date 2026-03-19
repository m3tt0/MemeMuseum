import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestBackendService, Meme } from '../_services/backend/rest-backend.service';
import { Navbar } from '../navbar/navbar';
import { MemeFeed } from '../meme-feed/meme-feed';
import { finalize } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'home-page',
  imports: [CommonModule, Navbar, MemeFeed],
  templateUrl: './homepage.html',
})
export class Homepage implements OnInit {
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

  ngOnInit(){
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

  loadMemes(){
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

  loadSearchMeme(params: Params){
    if (this.loading() || !this.hasMore()) return;

    this.searchMemes.set([]);
    this.page.set(1);
    this.hasMore.set(true);
    this.loading.set(true);

    this.restService.getMemes({
      tag: params['tag'],
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

  loadDailyMemes(){
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

  backToFeed(){
    this.router.navigateByUrl('/home');
    this.viewMode.set('feed');
  }

  handleMemeDeleted(memeId: number){
    this.memes.update(memes => memes.filter(m => m.memeId !== memeId));
    this.searchMemes.update(memes => memes.filter(m => m.memeId !== memeId));
    this.dailyMemes.update(memes => memes.filter(m => m.memeId !== memeId));
  }

  handleCaptionUpdated(event: { memeId: number; caption: string }){
    const updateCaption = (memes: Meme[]) =>
      memes.map(m =>
        m.memeId === event.memeId
          ? { ...m, caption: event.caption }
          : m
      );

    this.memes.update(updateCaption);
    this.searchMemes.update(updateCaption);
    this.dailyMemes.update(updateCaption);
  }

}