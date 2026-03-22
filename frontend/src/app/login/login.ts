import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { RestBackendService } from '../_services/backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
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
            this.authService.updateToken(res.token);
            this.toastr.success(`Welcome ${usr}!`);
            this.router.navigateByUrl('/home');
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
