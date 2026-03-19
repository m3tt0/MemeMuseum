import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { RestBackendService } from '../_services/backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-delete-user-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delete-user-modal.html',
  styleUrl: './delete-user-modal.scss',
})
export class DeleteUserModal {
  private fb = inject(FormBuilder);
  private restService = inject(RestBackendService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  @Output() close = new EventEmitter<void>();

  deleting = signal(false);
  showPassword = signal(false);

  deleteAccountForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  get passwordControl() {
    return this.deleteAccountForm.controls.password;
  }

  handleClose(){
    this.close.emit();
  }

  togglePassword(){
    this.showPassword.update(v => !v);
  }

  handleSubmit(){
    if (this.deleteAccountForm.invalid) {
      this.deleteAccountForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      this.toastr.error('You must be logged in.', 'Authentication error');
      return;
    }

    const password = this.deleteAccountForm.value.password?.trim() ?? '';

    this.deleting.set(true);

    this.restService
      .deleteUser(userId, password)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.authService.logout();
          this.toastr.success('Your account has been deleted.', 'Success');
          this.handleClose();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Failed to delete account', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to delete account.';

          this.toastr.error(message, 'Delete failed');
        }
      });
  }
}
