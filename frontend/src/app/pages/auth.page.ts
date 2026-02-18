import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'auth-layout',
  imports: [RouterOutlet],
  styles: [`
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg);
      }
      50% { 
        transform: translateY(-20px) rotate(5deg);
      }
    }

    @keyframes float-slow {
      0%, 100% { 
        transform: translateY(0px) translateX(0px);
      }
      50% { 
        transform: translateY(-15px) translateX(10px);
      }
    }

    .float-animation {
      animation: float 3s ease-in-out infinite;
    }

    .float-animation-slow {
      animation: float-slow 4s ease-in-out infinite;
    }

    .delay-1 { animation-delay: 0.5s; }
    .delay-2 { animation-delay: 1s; }
    .delay-3 { animation-delay: 1.5s; }
    .delay-4 { animation-delay: 2s; }
  `],
  template: `
<div class="min-h-screen lg:h-screen bg-gray-900 overflow-hidden">
    
    <!-- MOBILE: Mini collage in alto -->
    <div class="lg:hidden relative h-32 bg-gray-900">
      <div class="absolute inset-0 flex items-center justify-center gap-2 px-4">
        <!-- Mini meme circolari -->
        <img src="https://i.imgflip.com/1otk96.jpg" alt="meme" 
             class="w-16 h-16 rounded-full object-cover border-2 border-yellow-600 float-animation delay-1" />
        <img src="https://i.imgflip.com/345v97.jpg" alt="meme" 
             class="w-20 h-20 rounded-full object-cover border-2 border-gray-600 float-animation delay-2" />
        <img src="https://i.imgflip.com/4t0m5.jpg" alt="doge" 
             class="w-16 h-16 rounded-full object-cover border-2 border-yellow-600 float-animation delay-3" />
        <img src="https://i.imgflip.com/1ur9b0.jpg" alt="meme" 
             class="w-20 h-20 rounded-full object-cover border-2 border-gray-600 float-animation delay-4" />
      </div>
    </div>

    
    <div class="grid lg:grid-cols-2 grid-cols-1 h-screen bg-gray-900 overflow-hidden">
      
      <!-- Sezione sinistra - Collage meme creativo -->
      <div class="hidden lg:flex items-center justify-center relative overflow-hidden">
        <div class="relative w-full h-full flex items-center justify-center p-12">
          
          <!-- Collage principale di meme famosi -->
          <div class="relative w-125 h-125">
            
            <!-- Woman Yelling at Cat - Grande centrale -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 z-10">
              <img 
                src="https://i.imgflip.com/345v97.jpg" 
                alt="Woman yelling at cat meme"
                class="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-gray-700"
              />
            </div>

            <!-- Distracted Boyfriend - Sinistra alto -->
            <div class="absolute top-0 left-0 w-48 h-48 z-20 rotate-[-8deg]">
              <img 
                src="https://i.imgflip.com/1ur9b0.jpg" 
                alt="Distracted boyfriend meme"
                class="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-gray-700"
              />
            </div>

            <!-- Drake - Destra basso -->
            <div class="absolute bottom-0 right-0 w-44 h-44 z-20 rotate-12">
              <img 
                src="https://i.imgflip.com/4/9ehk.jpg"
                alt="Batman & Robin Meme"
                class="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-gray-700"
              />
            </div>

            <!-- Mocking SpongeBob - Sinistra basso -->
            <div class="absolute bottom-8 left-12 w-36 h-36 z-15 rotate-[-15deg]">
              <img 
                src="https://i.imgflip.com/1otk96.jpg" 
                alt="Mocking SpongeBob"
                class="w-full h-full object-cover rounded-xl shadow-lg border-3 border-gray-700"
              />
            </div>

            <!-- Success Kid - Destra alto -->
            <div class="absolute top-12 right-8 w-32 h-32 z-15 rotate-18">
              <img 
                src="https://i.imgflip.com/1bhk.jpg" 
                alt="Success kid"
                class="w-full h-full object-cover rounded-xl shadow-lg border-3 border-gray-700"
              />
            </div>
          </div>

          <!-- Doge volanti -->
          <img 
            src="https://i.imgflip.com/4t0m5.jpg"
            alt="doge"
            class="absolute top-[10%] left-[8%] w-20 h-20 object-cover rounded-full float-animation delay-1 z-30 border-2 border-yellow-600"
          />
          
          <img 
            src="https://i.imgflip.com/4t0m5.jpg"
            alt="doge"
            class="absolute top-[25%] right-[12%] w-16 h-16 object-cover rounded-full float-animation-slow delay-2 z-30 border-2 border-yellow-600"
          />
          
          <img 
            src="https://i.imgflip.com/4t0m5.jpg"
            alt="doge"
            class="absolute bottom-[20%] left-[10%] w-20 h-20 object-cover rounded-full float-animation delay-3 z-30 border-2 border-yellow-600"
          />
          
          <img 
            src="https://i.imgflip.com/4t0m5.jpg"
            alt="doge"
            class="absolute bottom-[15%] right-[8%] w-14 h-14 object-cover rounded-full float-animation-slow delay-4 z-30 border-2 border-yellow-600"
          />
        </div>
      </div>

      <!-- Sezione destra - Form -->
      <div class="flex items-center justify-center relative overflow-hidden">
        <div class="absolute left-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary to-transparent"></div>
        <div class="w-full max-w-md px-8">
            <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export default class AuthLayoutPage {}

