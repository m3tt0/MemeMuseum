import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestBackendService, Meme } from '../services/rest-backend.service';


@Component({
  standalone: true,
  selector: 'home-page',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
    template: `
    <div class="min-h-screen bg-black text-white flex flex-col">
      <!-- HEADER -->
      <header class="w-full py-6 flex justify-center relative border-b border-gray-800">
        <h1 class="text-4xl font-bold tracking-wide">MemeMuseum</h1>

        <button
          class="absolute right-8 top-6 btn btn-ghost text-white text-3xl"
          routerLink="/auth/login"
          type="button"
        >
          <span class="material-icons">account_circle</span>
        </button>
      </header>

      <!-- CONTENUTO PRINCIPALE -->
      <div class="flex justify-center w-full relative">
        <!-- COLONNA MEME -->
        <div class="w-full max-w-2xl px-4 mt-10">
         
            <div class="border border-gray-700 rounded-xl p-4 mb-10">
              <!-- Autore + Tempo -->
              <div class="flex items-center gap-2 text-sm mb-3">
                <span class="material-icons text-lg">account_circle</span>
                <script>console.log("PRIMA USERNAME")</script>
                <span class="font-bold"> 
                  pippo
                </span>
                <span class="opacity-70 ml-2">
                  Posted: 
                </span>
              </div>

              <!-- Immagine -->
              <img
                ngSrc="http://localhost:3030/uploads/memes/meme_1_1769802959864.png"
                width= "500"
                height= "350"
                class="rounded-xl w-full object-cover mb-4"
              />

              <!-- Tags (se presenti) -->
              <!-- @if (meme.tags?.length) {
                <div class="flex gap-2 mb-3">
                  @for (t of meme.tags; track t.content) {
                    <span class="badge badge-outline">#{{ t.content }}</span>
                  }
                </div>
              } -->

              <!-- Reazioni (placeholder, li collegherai alle API votes) -->
              <div class="flex items-center gap-4 text-lg">
                <button type="button" class="flex items-center gap-1">
                  <span class="material-icons">thumb_up</span>
                  2
                </button>
                <button type="button" class="flex items-center gap-1">
                  <span class="material-icons">thumb_down</span>
                  1
                </button>
                <button type="button" class="flex items-center gap-1">
                  <span class="material-icons">chat_bubble_outline</span>
                  <!-- in futuro: numero commenti -->
                </button>
              </div>
            </div>
          <!-- } -->
        </div>

        <!-- Doge meme del giorno (in futuro /api/memes/daily) -->
        <div class="hidden lg:block absolute right-20 top-40">
          <div class="flex flex-col items-center">
            <div
              class="bubble bubble-right text-sm p-3 bg-gray-100 text-black rounded-lg shadow-md"
            >
              Scopri il meme<br />del giorno
            </div>
            <img
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpngimg.com%2Fuploads%2Fdoge_meme%2Fdoge_meme_PNG11.png&f=1&nofb=1&ipt=5023a93e51ace99ad19500615b92edb8c37ec393d467fea34ca1f7bf595486f1"
              class="w-24 h-24 mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class HomePage implements OnInit {
  private restService = inject(RestBackendService);
  backendBaseUrl = 'http://localhost:3030';
  memes: Meme[] = [];

  ngOnInit(): void {
    this.loadMemes();
  }

  loadMemes() {
    this.restService
      .getMemes({ sort: 'newest', page: 1, limit: 10 })
      .subscribe({
        next: (data) => {
          console.log(data);
          this.memes = data;
        },
        error: (err) => {
          console.error('error loading memes', err);
        },
      });
  }
}
