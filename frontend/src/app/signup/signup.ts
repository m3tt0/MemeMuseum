import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import { RestBackendService } from '../_services/backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  private restService = inject(RestBackendService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  submitted = false;
  showPassword = false;

  signupForm = new FormGroup({
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

  handleSignup() {
    this.submitted = true;

    if (this.signupForm.invalid) {
        this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    }
    else {
        const usr = this.signupForm.value.user as string;
        const pwd = this.signupForm.value.pass as string;

        this.restService
        .signup({ usr: usr, pwd: pwd })
        .subscribe({
            error: (err) => {
                this.toastr.error(err.error.description, "Oops! Could not create a new user");
            },
            complete: () => {
                this.toastr.success(`You can now login with your new account`,`Congrats ${usr}!`);
                this.router.navigateByUrl("/auth/login");
            }
        });
    }
  }
}
