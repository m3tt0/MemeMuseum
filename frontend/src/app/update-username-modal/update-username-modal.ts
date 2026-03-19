import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { RestBackendService, User } from '../_services/backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-update-username-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-username-modal.html',
  styleUrl: './update-username-modal.scss',
})
export class UpdateUsernameModal {
  private fb = inject(FormBuilder);
  private restService = inject(RestBackendService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @Output() close = new EventEmitter<void>();

  backendBaseUrl = 'http://localhost:3030/';
  submitting = signal(false);

  updateUsernameForm = this.fb.group({
    newUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
  });

  get newUsernameControl() {
    return this.updateUsernameForm.controls.newUsername;
  }

  get currentUsername(): string {
    return this.authService.getUserName() ?? 'Unknown user';
  }

  get currentProfilePicture(): string {
    const pfp = this.authService.getUserPfp();
    return pfp ? this.backendBaseUrl + pfp : '/defaultPfp.png';
  }

  handleClose(){
    this.close.emit();
  }

  handleSubmit(){
    if (this.updateUsernameForm.invalid) {
      this.updateUsernameForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();
    const newUsername = this.updateUsernameForm.value.newUsername?.trim() ?? '';

    if (!userId) {
      this.toastr.error('You must be logged in.', 'Authentication error');
      return;
    }

    if (newUsername === this.currentUsername) {
      this.toastr.warning(
        'The new username must be different from the current one.',
        'Invalid username'
      );
      return;
    }

    this.submitting.set(true);

    this.restService.updateUsername(userId, newUsername)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (updatedUser: User) => {
          const updatedName = updatedUser.userName ?? newUsername;

          this.authService.updateUserName(updatedName);
          this.toastr.success('Username updated successfully.', 'Success');
          this.handleClose();
        },
        error: (err) => {
          console.error('Failed to update username', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to update username.';

          this.toastr.error(message, 'Update failed');
        }
      });
  }
}
