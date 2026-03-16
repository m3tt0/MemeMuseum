import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
import { RestBackendService } from '../../services/rest-backend.service';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'create-meme-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Navbar],
  template: `
  <div class="min-h-screen bg-gray-900 text-white">
  <app-navbar />

  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="rounded-2xl border border-base-300 bg-base-100 shadow-xl p-6">
      <h1 class="text-2xl font-bold mb-2">Create a new meme</h1>
      <p class="text-sm text-base-content/70 mb-6">
        Upload an image and share your meme with the community.
      </p>

      <form [formGroup]="createMemeForm" (ngSubmit)="onSubmit()" class="space-y-5">

        <div>
          <label class="label">
            <span class="label-text">Meme image</span>
          </label>

          <input
            type="file"
            accept="image/*"
            class="file-input file-input-bordered w-full"
            (change)="onFileSelected($event)"
          />
        </div>

        @if (imagePreviewUrl()) {
          <div class="rounded-2xl overflow-hidden border border-base-300 bg-base-200">
            <img [src]="imagePreviewUrl()" alt="Meme preview" class="w-full max-h-125 object-contain" />
          </div>
        }

        <div>
          <label class="label">
            <span class="label-text">Caption</span>
          </label>
          <textarea
            formControlName="text"
            rows="4"
            class="textarea textarea-bordered w-full"
            placeholder="Write something about your meme..."
          ></textarea>
        </div>

        <div>
          <label class="label">
            <span class="label-text">Tags</span>
          </label>
          <input
            formControlName="tags"
            type="text"
            class="input input-bordered w-full"
            placeholder="funny, cat, school..."
          />
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button type="button" class="btn btn-ghost" routerLink="/">
            Cancel
          </button>

          <button type="submit" class="btn btn-primary" [disabled]="submitting()">
            {{ submitting() ? 'Uploading...' : 'Publish meme' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</div>
  `,
})
export class CreateMemePage {
  private fb = inject(FormBuilder);
  private restService = inject(RestBackendService);
  private router = inject(Router);
  private toastr = inject(ToastrService)

  selectedFile: File | null = null;
  imagePreviewUrl = signal<string | null>(null);
  submitting = signal(false);

  createMemeForm = this.fb.group({
    text: ['', [Validators.required, Validators.maxLength(300)]],
    tags: ['']
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = file;

    if (!file) {
      this.imagePreviewUrl.set(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.selectedFile || this.createMemeForm.invalid) {
      this.createMemeForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    formData.append('text', this.createMemeForm.value.text ?? '');
    formData.append('tags', this.createMemeForm.value.tags ?? '');

    this.submitting.set(true);

    this.restService.createMeme(formData)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Upload meme failed', err);
        }
      });
  }
}