import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'home-page',
  template: `
    <div class="min-h-screen bg-black text-white flex flex-col">

      <!-- HEADER -->
      <header class="w-full py-6 flex justify-center relative border-b border-gray-800">
        <h1 class="text-4xl font-bold tracking-wide">MemeMuseum</h1>

        <!-- Icona profilo -->
        <button class="absolute right-8 top-6 btn btn-ghost text-white text-3xl">
          <span class="material-icons">account_circle</span>
        </button>
      </header>

      <!-- CONTENUTO PRINCIPALE -->
      <div class="flex justify-center w-full relative">

        <!-- COLONNA MEME -->
        <div class="w-full max-w-2xl px-4 mt-10">

          <!-- Un Meme Card -->
          <div class="border border-gray-700 rounded-xl p-4 mb-10">
            
            <!-- Autore + Tempo -->
            <div class="flex items-center gap-2 text-sm mb-3">
              <span class="material-icons text-lg">account_circle</span>
              <span class="font-bold">Pippo Baudo</span>
              <span class="opacity-70 ml-2">• 15m</span>
            </div>

            <!-- Immagine del Meme -->
            <img 
              src="https://placekittens.com/500/350" 
              class="rounded-xl w-full object-cover mb-4"
            />

            <!-- Tags -->
            <div class="flex gap-2 mb-3">
              <span class="badge badge-outline">#CAT</span>
              <span class="badge badge-outline">#FUNNY</span>
            </div>

            <!-- Reazioni -->
            <div class="flex items-center gap-4 text-lg">
              <div class="flex items-center gap-1">
                <span class="material-icons">thumb_up</span> 15
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons">thumb_down</span> 1
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons">chat_bubble_outline</span> 22
              </div>
            </div>

          </div>

          <!-- Duplicate staticamente per ora (poi dinamico) -->
          <div class="border border-gray-700 rounded-xl p-4 mb-10">
            <div class="flex items-center gap-2 text-sm mb-3">
              <span class="material-icons text-lg">account_circle</span>
              <span class="font-bold">Pippo Baudo</span>
              <span class="opacity-70 ml-2">• 15m</span>
            </div>

            <img 
              src="https://placekittens.com/500/350" 
              class="rounded-xl w-full object-cover mb-4"
            />

            <div class="flex gap-2 mb-3">
              <span class="badge badge-outline">#CAT</span>
              <span class="badge badge-outline">#FUNNY</span>
              <span class="badge badge-outline">#TAGBELLO</span>
            </div>

            <div class="flex items-center gap-4 text-lg">
              <div class="flex items-center gap-1">
                <span class="material-icons">thumb_up</span> 10
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons">thumb_down</span> 9
              </div>
              <div class="flex items-center gap-1">
                <span class="material-icons">chat_bubble_outline</span> 15
              </div>
            </div>

          </div>

        </div>

        <!-- Doge Meme del Giorno -->
        <div class="hidden lg:block absolute right-20 top-40">
          <div class="flex flex-col items-center">
            <div class="bubble bubble-right text-sm p-3 bg-gray-100 text-black rounded-lg shadow-md">
              Scopri il meme<br/>del giorno
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
export default class HomePage {}
