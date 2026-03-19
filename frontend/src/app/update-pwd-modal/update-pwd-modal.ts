import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { RestBackendService } from '../_services/backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-update-pwd-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-pwd-modal.html',
  styleUrl: './update-pwd-modal.scss',
})
export class UpdatePwdModal {
  private fb = inject(FormBuilder);
  private restService = inject(RestBackendService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @Output() close = new EventEmitter<void>();

  submitting = signal(false);
  showOldPassword = signal(false);
  showNewPassword = signal(false);

  updatePasswordForm = this.fb.group({
    oldPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]],
  });

  get oldPasswordControl() {
    return this.updatePasswordForm.controls.oldPassword;
  }

  get newPasswordControl() {
    return this.updatePasswordForm.controls.newPassword;
  }

  handleClose(){
    this.close.emit();
  }

  toggleOldPassword(){
    this.showOldPassword.update(v => !v);
  }

  toggleNewPassword(){
    this.showNewPassword.update(v => !v);
  }

  handleSubmit(){
    if (this.updatePasswordForm.invalid) {
      this.updatePasswordForm.markAllAsTouched();
      return;
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      this.toastr.error('You must be logged in.', 'Authentication error');
      return;
    }

    const oldPassword = this.updatePasswordForm.value.oldPassword?.trim() ?? '';
    const newPassword = this.updatePasswordForm.value.newPassword?.trim() ?? '';

    if (oldPassword === newPassword) {
      this.toastr.warning('The new password must be different from the current one.', 'Invalid password');
      return;
    }

    this.submitting.set(true);

    this.restService.updatePassword(userId, oldPassword, newPassword)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.toastr.success('Password updated successfully.', 'Success');
          this.handleClose();
        },
        error: (err) => {
          console.error('Failed to update password', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to update password.';

          this.toastr.error(message, 'Update failed');
        }
      });
  }
}
