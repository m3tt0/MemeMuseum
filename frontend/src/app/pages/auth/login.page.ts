import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'login-page',
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
          
          <!-- Logo e titolo -->
          <div class="mb-8">
            <h1 class="text-5xl font-bold font-mono text-white mb-2">
              Accedi a<br/>MemeMuseum
            </h1>
            <p class="text-gray-400 text-lg">Il tuo social dei meme!</p>
          </div>

          <!-- Alert errore -->
          @if (errorMessage()) {
            <div class="alert alert-error mb-4">
              <span class="material-icons">error</span>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Form -->
          <form (ngSubmit)="onLogin()" class="space-y-6">
            
            <!-- Username input -->
            <div class="form-control">
              <div class="flex items-center border-b-2 border-gray-700 focus-within:border-blue-600 transition-colors pb-2">
                <span class="material-icons text-gray-400 mr-3">account_circle</span>
                <input
                  type="text"
                  placeholder="Username"
                  [(ngModel)]="username"
                  name="username"
                  required
                  autocomplete="username"
                  class="input input-ghost w-full text-white bg-transparent border-none focus:outline-none px-0"
                />
              </div>
            </div>

            <!-- Password input -->
            <div class="form-control">
              <div class="flex items-center border-b-2 border-gray-700 focus-within:border-blue-600 transition-colors pb-2">
                <span class="material-icons text-gray-400 mr-3">key</span>
                <input
                  [type]="showPassword() ? 'text' : 'password'"
                  placeholder="Password"
                  [(ngModel)]="password"
                  name="password"
                  required
                  autocomplete="current-password"
                  class="input input-ghost w-full text-white bg-transparent border-none focus:outline-none px-0"
                />
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="btn btn-ghost btn-sm"
                >
                  <span class="material-icons text-gray-400">
                    {{ showPassword() ? 'visibility' : 'visibility_off' }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Login button -->
            <button
              type="submit" class="btn btn-primary btn-circle w-full mt-8 text-lg">ACCEDI</button>
          </form>

          <!-- Link alla registrazione -->
          <div class="text-center mt-6 text-gray-400">
            Non hai un account? 
            <a href="/signup" class="text-blue-500 font-bold hover:underline ml-1">
              Registrati
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  showPassword = signal(false);
  errorMessage = signal('');

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage.set('Inserisci username e password');
      return;
    }

    this.errorMessage.set('');

    this.authService.login({ usr: this.username, pwd: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          const message = err.error?.description || err.error?.message || 'Credenziali non valide';
          this.errorMessage.set(message);
        }
      });
  }
}