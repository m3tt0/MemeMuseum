import { Component, Input, inject, signal, OnInit } from '@angular/core';
import { NgOptimizedImage, DatePipe } from '@angular/common';
import { RestBackendService, Meme } from '../../services/rest-backend.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-meme-card',
  imports: [NgOptimizedImage, DatePipe],
  templateUrl: './meme-card.html',
  styleUrl: './meme-card.css',
})
export class MemeCard implements OnInit {
  @Input({ required: true }) meme!: Meme;
  @Input() priority = false;

  backendBaseUrl = 'http://localhost:3030/';

  private restService = inject(RestBackendService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  currentVote = signal<'upvote' | 'downvote' | null>(null);
  isVoting = signal(false);

  get memeImageUrl(): string {
    return this.backendBaseUrl + this.meme.imagePath;
  }

  get authorPfpUrl(): string {
    const userPfp = this.meme.User.profilePicture;
    return userPfp ? this.backendBaseUrl + userPfp : '/defaultPfp.png';
  }

  ngOnInit(): void {
    const existingVote = this.getExistingVote();

    if (existingVote?.voteType === 1) {
      this.currentVote.set('upvote');
    } else if (existingVote?.voteType === -1) {
      this.currentVote.set('downvote');
    } else {
      this.currentVote.set(null);
    }
  }

  private getExistingVote() {
    const userId = this.authService.getUserId();
    return this.meme.Votes?.find(v => v.userId === userId) ?? null;
  }

  handleVote(voteType: 'upvote' | 'downvote'): void {
    if (this.isVoting()) return;

    const existingVote = this.getExistingVote();
    const previousVote = this.currentVote();
    const previousUpvotes = this.meme.upvotes;
    const previousDownvotes = this.meme.downvotes;

    if (existingVote && previousVote === voteType) {
      this.toastr.info(
        voteType === 'upvote'
          ? 'You already upvoted this meme.'
          : 'You already downvoted this meme.'
      );
      return;
    }

    this.isVoting.set(true);

    // optimistic UI update
    if (voteType === 'upvote') {
      if (previousVote === 'downvote') {
        this.meme.downvotes = (this.meme.downvotes ?? 0) - 1;
        this.meme.upvotes = (this.meme.upvotes ?? 0) + 1;
      } else if (previousVote === null) {
        this.meme.upvotes = (this.meme.upvotes ?? 0) + 1;
      }

      this.currentVote.set('upvote');
    }

    if (voteType === 'downvote') {
      if (previousVote === 'upvote') {
        this.meme.upvotes = (this.meme.upvotes ?? 0) - 1;
        this.meme.downvotes = (this.meme.downvotes ?? 0) + 1;
      } else if (previousVote === null) {
        this.meme.downvotes = (this.meme.downvotes ?? 0) + 1;
      }

      this.currentVote.set('downvote');
    }

    const request$ = existingVote
      ? this.restService.updateVote(existingVote.voteId, voteType)
      : this.restService.addVote(this.meme.memeId, voteType);

    request$.subscribe({
      next: () => {
        this.isVoting.set(false);
      },
      error: () => {
        // rollback
        this.currentVote.set(previousVote);
        this.meme.upvotes = previousUpvotes;
        this.meme.downvotes = previousDownvotes;
        this.isVoting.set(false);
        this.toastr.error('Cannot update vote.');
      }
    });
  }

  isUserMemeOwner(){
    return (this.meme.userId === this.authService.getUserId());
  }


}