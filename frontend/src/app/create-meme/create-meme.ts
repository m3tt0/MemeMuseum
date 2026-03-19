import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { Navbar } from '../navbar/navbar';
import { RestBackendService, CreateMemePayload } from '../_services/backend/rest-backend.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-meme',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, Navbar],
  templateUrl: './create-meme.html',
  styleUrl: './create-meme.scss'
})
export class CreateMeme {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private restService = inject(RestBackendService);
  private toastr = inject(ToastrService);

  selectedFile: File | null = null;
  imagePreviewUrl = signal<string | null>(null);
  submitting = signal(false);

  tags = signal<string[]>([]);
  tagInput = '';

  createMemeForm = this.fb.group({
    caption: ['', [Validators.required, Validators.maxLength(300)]]
  });

  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) {
      this.selectedFile = null;
      this.imagePreviewUrl.set(null);
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const maxSizeInBytes = 15 * 1024 * 1024; // 15 MB

    if (!allowedTypes.includes(file.type)) {
      this.toastr.error('Only PNG, JPG, JPEG and WEBP images are allowed.', 'Invalid file');
      input.value = '';
      this.selectedFile = null;
      this.imagePreviewUrl.set(null);
      return;
    }

    if (file.size > maxSizeInBytes) {
      this.toastr.error('The image is too large. Maximum size is 15 MB.', 'File too large');
      input.value = '';
      this.selectedFile = null;
      this.imagePreviewUrl.set(null);
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  addTag(){
    const normalized = this.tagInput
      .trim()
      .toLowerCase()
      .replace(/^#/, '');

    if (!normalized) return;

    const tagRegex = /^[a-z0-9_-]{1,20}$/;

    if (!tagRegex.test(normalized)) {
      this.toastr.error(
        'Tags can contain only lowercase letters, numbers, "_" and "-". Max 20 chars.',
        'Invalid tag'
      );
      return;
    }

    if (this.tags().includes(normalized)) {
      this.toastr.warning('This tag has already been added.', 'Duplicate tag');
      this.tagInput = '';
      return;
    }

    this.tags.update(current => [...current, normalized]);
    this.tagInput = '';
  }

  removeTag(tag: string){
    this.tags.update(current => current.filter(t => t !== tag));
  }

  handleTagKeydown(event: KeyboardEvent){
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  handleSubmit(){
    if (!this.selectedFile) {
      this.toastr.warning('Please select an image first.', 'Missing file');
      return;
    }

    if (this.createMemeForm.invalid) {
      this.createMemeForm.markAllAsTouched();
      this.toastr.warning('Please complete the form correctly.', 'Invalid form');
      return;
    }

    const payload = {
      image: this.selectedFile,
      caption: this.createMemeForm.value.caption ?? '',
      tags: this.tags()
    };

    this.submitting.set(true);

    this.restService.createMeme(payload).subscribe({
      next: () => {
        this.toastr.success('Your meme has been published!', 'Success');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);

        const backendMessage =
          err?.error?.description ||
          err?.error?.error ||
          'Something went wrong while uploading the meme.';

        this.toastr.error(backendMessage, 'Upload failed');
        this.submitting.set(false);
      },
      complete: () => {
        this.submitting.set(false);
      }
    });
  }
}