import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { RestBackendService } from '../../services/rest-backend.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'login-page',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <!-- Logo e titolo -->
    <div class="mb-8">
      <h1 class="text-5xl font-bold font-mono text-white mb-2">
        Log in to<br />MemeMuseum
      </h1>
      <p class="text-gray-400 text-lg">Your meme social network!</p>
    </div>

    <form [formGroup]="loginForm" (ngSubmit)="handleLogin()" class="space-y-6">
      <!-- Username -->
      <div class="form-control">
        <div class="flex items-center border-b-2 border-gray-700 focus-within:border-blue-600 transition-colors pb-2">
          <span class="material-icons text-gray-400 mr-3">account_circle</span>
          <input
            type="text"
            placeholder="Username"
            formControlName="user"
            autocomplete="username"
            class="input input-ghost w-full text-white bg-transparent border-none focus:outline-none px-0"
          />
        </div>

          @if (submitted && loginForm.controls.user.errors) {
            @if (loginForm.controls.user.errors['required']) {
              <p class="text-red-400 text-sm mt-1">Username is required.</p>
            }
          }
      </div>

      <!-- Password -->
      <div class="form-control">
        <div class="flex items-center border-b-2 border-gray-700 focus-within:border-blue-600 transition-colors pb-2">
          <span class="material-icons text-gray-400 mr-3">key</span>
          <input
            [type]="showPassword ? 'text' : 'password'"
            placeholder="Password"
            formControlName="pass"
            autocomplete="current-password"
            class="input input-ghost w-full text-white bg-transparent border-none focus:outline-none px-0"
          />
          <button
            type="button"
            (click)="togglePassword()"
            class="btn btn-ghost btn-sm"
          >
            <span class="material-icons text-gray-400">
              {{ showPassword ? 'visibility' : 'visibility_off' }}
            </span>
          </button>
        </div>

          @if(submitted && loginForm.controls.pass.errors){
            @if(loginForm.controls.pass.errors['required']){
              <p class="form-error">Password is required.</p>
            }
            @if(loginForm.controls.pass.errors['minlength']){
              <p class="form-error">Password should contain at least 4 characters</p>
            }
          }
      </div>

      <!-- Pulsante -->
      <button
        type="submit"
        class="btn btn-primary btn-circle w-full mt-8 text-lg"
      >
        LOGIN
      </button>
    </form>

    <!-- Link registrazione -->
    <div class="text-center mt-6 text-gray-400">
      Don't have an account yet?
      <a routerLink="/auth/signup" class="text-blue-500 font-bold hover:underline ml-1">
        Signup
      </a>
    </div>
  `,
})
export default class LoginPage {
  private authService = inject(AuthService);
  private restService = inject(RestBackendService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  submitted = false;
  showPassword = false;

  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16),
    ]),
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    }
    else {
      const usr = this.loginForm.value.user as string;
      const pwd = this.loginForm.value.pass as string;

      this.restService
        .login({ usr: usr, pwd: pwd })
        .subscribe({
          next: (res) => {
            this.authService.updateToken(res.token).then(() => {
              this.toastr.success(`Welcome ${usr}!`);
              this.router.navigateByUrl('/');
            });
          },
          error: (err) => {
            this.toastr.error('Invalid username or password, try again !');
          },
          complete: () => {
          }
        });
    }
  }
}
