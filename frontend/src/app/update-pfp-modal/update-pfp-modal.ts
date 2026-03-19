import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService, User } from '../_services/backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-update-pfp-modal',
  imports: [CommonModule],
  templateUrl: './update-pfp-modal.html',
  styleUrl: './update-pfp-modal.scss',
})
export class UpdatePfpModal {
  private restService = inject(RestBackendService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @Output() close = new EventEmitter<void>();

  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);
  uploading = signal(false);

  readonly allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  readonly maxSizeInBytes = 15 * 1024 * 1024; // 15MB

  handleClose(){
    this.close.emit();
  }

  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile = null;
      this.previewUrl.set(null);
      return;
    }

    if (!this.allowedTypes.includes(file.type)) {
      this.toastr.error(
        'Only PNG, JPG, JPEG and WEBP images are allowed.',
        'Invalid file'
      );
      input.value = '';
      this.selectedFile = null;
      this.previewUrl.set(null);
      return;
    }

    if (file.size > this.maxSizeInBytes) {
      this.toastr.error(
        'The image is too large. Maximum size is 15 MB.',
        'File too large'
      );
      input.value = '';
      this.selectedFile = null;
      this.previewUrl.set(null);
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  handleSubmit(){
    if (!this.selectedFile) {
      this.toastr.warning('Please select an image first.', 'Missing file');
      return;
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      this.toastr.error('You must be logged in.', 'Authentication error');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', this.selectedFile);

    this.uploading.set(true);

    this.restService
      .updateProfilePicture(userId, formData)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: (updatedUser: User) => {
          if (!updatedUser.profilePicture) {
            this.toastr.error(
              'Profile picture updated, but no image path was returned.',
              'Unexpected response'
            );
            return;
          }

          this.authService.updateProfilePicture(updatedUser.profilePicture);
          this.toastr.success('Profile picture updated successfully.', 'Success');

          this.handleClose();
        },
        error: (err) => {
          console.error('Failed to update profile picture', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to update profile picture.';

          this.toastr.error(message, 'Upload failed');
        }
      });
  }

}
