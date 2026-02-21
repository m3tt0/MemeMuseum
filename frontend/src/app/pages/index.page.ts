import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestBackendService, Meme } from '../services/rest-backend.service';


@Component({
  standalone: true,
  selector: 'home-page',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
    template: `
    <div class="min-h-screen bg-gray-900 text-white flex flex-col">
      <!-- HEADER -->
      <div class="navbar bg-gray-900 border-b border-gray-600 shadow-sm">
        <div class="flex-1">
          <a class="btn btn-ghost text-xl font-bold" routerLink="/auth/login">MemeMuseum</a>
        </div>
        <div class="flex gap-2">
          <input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
              <div class="w-10 rounded-full">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <ul
              tabindex="-1"
              class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li>
                <a class="justify-between">
                  Profile
                </a>
              </li>
              <li><a>Create new meme</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CONTENUTO PRINCIPALE -->
      <div class="flex justify-center w-full relative">
        <!-- COLONNA MEME -->
        <div class="w-full max-w-2xl px-4 mt-10">
          @if (memes | async; as memes) {
              @if (memes.length === 0) {
                <p class="text-center text-gray-400">Non ci sono meme per ora 😢</p>
              } @else {
                @for (meme of memes; track meme.memeId) {
                  <article class="card bg-base-500 w-140 border border-gray-600 rounded-xl p-4 mb-10">
                    <!-- Autore + Tempo -->
                    <div class="flex items-center gap-2 text-sm mb-3">
                      <span class="material-icons text-lg">account_circle</span>
                      <span class="font-bold">
                        {{ meme.User.userName }}
                      </span>
                      <span class="opacity-70 ml-2">
                        Posted: {{ meme.creationDate | date:'short' }}
                      </span>
                    </div>

                      <!-- Immagine -->
                      <img
                        ngSrc='{{ backendBaseUrl + meme.imagePath}}'
                        width= "200"
                        height= "200"
                        class="rounded-xl w-full object-cover mb-4"
                      />

                      <div>
                        <span>{{meme.caption}}</span>
                      </div>
                  
                      <!-- Tags (se presenti) -->
                      @if (meme.Tags?.length) {
                        <div class="flex gap-2 mb-3">
                          @for (t of meme.Tags; track t.content) {
                            <span class="badge badge-outline">#{{ t.content }}</span>
                          }
                        </div>
                      }

                      <div class="flex items-center gap-4 text-lg">
                        <button class="btn">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="size-[1.2em]"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                          Like
                        </button>
                        <button type="button" class="flex items-center gap-1">
                          <span class="material-icons">thumb_down</span>
                          {{meme.downvotes}}
                        </button>
                        <button type="button" class="flex items-center gap-1">
                          <span class="material-icons">comment</span>
                          <!-- in futuro: numero commenti -->
                        </button>
                      </div>
                  </article>
                  }
              }
          }
            </div>
        </div>

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
  `,
})
export default class HomePage implements OnInit {
  private restService = inject(RestBackendService);
  backendBaseUrl = 'http://localhost:3030/';
  memes = this.restService.getMemes({ feed: true });

  ngOnInit(): void {
   }
  // loadMemes() {
  //   this.restService
  //     .getMemes({ sort: 'newest', page: 1, limit: 10 })
  //     .subscribe({
  //       next: (data) => {
  //         console.log(data);
  //         this.memes = data;
  //         console.log(this.memes[0].User.userName)
  //       },
  //       error: (err) => {
  //         console.error('error loading memes', err);
  //       },
  //     });
  // }
}
