import { Component, Input, inject, signal, OnInit, EventEmitter, Output } from '@angular/core';
import { NgOptimizedImage, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestBackendService, Meme } from '../_services/backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';
import { UpdateMemeModal } from '../update-meme-modal/update-meme-modal';
import { DeleteMemeModal } from '../delete-meme-modal/delete-meme-modal';
import { CommentsModal } from '../comments-modal/comments-modal';
import { ToastrService } from 'ngx-toastr';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-meme-card',
  imports: [NgOptimizedImage, DatePipe, SlicePipe, FormsModule, UpdateMemeModal, DeleteMemeModal, CommentsModal],
  templateUrl: './meme-card.html',
  styleUrl: './meme-card.css',
})
export class MemeCard implements OnInit {
  @Input({ required: true }) meme!: Meme;
  @Input() priority = false;
  @Output() memeDeleted = new EventEmitter<number>();
  @Output() captionUpdated = new EventEmitter<{ memeId: number; caption: string }>();

  backendBaseUrl = 'http://localhost:3030/';

  private restService = inject(RestBackendService);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  currentVote = signal<'upvote' | 'downvote' | null>(null);
  isVoting = signal(false);

  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  isSavingCaption = signal(false);
  isDeleting = signal(false);

  isCommentsModalOpen = signal(false);

  get memeImageUrl(): string {
    return this.backendBaseUrl + this.meme.imagePath;
  }

  get authorPfpUrl(): string {
    const currentUserId = this.authService.getUserId();

    const userPfp =
      this.meme.userId === currentUserId
        ? this.authService.getUserPfp()
        : this.meme.User.profilePicture;

    return userPfp ? this.backendBaseUrl + userPfp : '/defaultPfp.png';
  }

  get authorUserName(): string {
    const currentUserId = this.authService.getUserId();

    return this.meme.userId === currentUserId
      ? (this.authService.getUserName() ?? this.meme.User.userName)
      : this.meme.User.userName;
  }

  ngOnInit() {
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

  handleVote(voteType: 'upvote' | 'downvote') {
    if (!this.authService.isUserAuthenticated()) {
      this.toastr.warning('You must be logged in to vote.', 'Authentication required');
      return;
    }
    if (this.isVoting()) return;

    const existingVote = this.getExistingVote();
    const currentVote = this.currentVote();

    if (!existingVote) {
      this.handleAddVote(voteType);
      return;
    }

    if (currentVote === voteType) {
      this.handleDeleteVote(existingVote, voteType);
      return;
    }

    this.handleUpdateVote(existingVote, voteType);
  }

  private handleAddVote(voteType: 'upvote' | 'downvote') {
    this.isVoting.set(true);

    this.restService.addVote(this.meme.memeId, voteType).subscribe({
      next: (createdVote) => {
        if (voteType === 'upvote') {
          this.meme.upvotes = (this.meme.upvotes ?? 0) + 1;
          this.currentVote.set('upvote');
        } else {
          this.meme.downvotes = (this.meme.downvotes ?? 0) + 1;
          this.currentVote.set('downvote');
        }

        this.replaceOrInsertUserVote(createdVote);

        this.isVoting.set(false);
      },
      error: () => {
        this.isVoting.set(false);
        this.toastr.error('Cannot add vote.');
      }
    });
  }

  private handleUpdateVote(existingVote: { voteId: number }, voteType: 'upvote' | 'downvote') {
    this.isVoting.set(true);

    this.restService.updateVote(existingVote.voteId, voteType).subscribe({
      next: (updatedVote) => {
        if (voteType === 'upvote') {
          this.meme.upvotes = (this.meme.upvotes ?? 0) + 1;
          this.meme.downvotes = Math.max((this.meme.downvotes ?? 0) - 1, 0);
          this.currentVote.set('upvote');
        } else {
          this.meme.downvotes = (this.meme.downvotes ?? 0) + 1;
          this.meme.upvotes = Math.max((this.meme.upvotes ?? 0) - 1, 0);
          this.currentVote.set('downvote');
        }

        this.replaceOrInsertUserVote(updatedVote);

        this.isVoting.set(false);
      },
      error: () => {
        this.isVoting.set(false);
        this.toastr.error('Cannot update vote.');
      }
    });
  }

  private handleDeleteVote(existingVote: { voteId: number }, voteType: 'upvote' | 'downvote') {
    this.isVoting.set(true);

    this.restService.deleteVote(existingVote.voteId).subscribe({
      next: () => {
        if (voteType === 'upvote') {
          this.meme.upvotes = Math.max((this.meme.upvotes ?? 0) - 1, 0);
        } else {
          this.meme.downvotes = Math.max((this.meme.downvotes ?? 0) - 1, 0);
        }

        this.currentVote.set(null);
        this.removeUserVoteLocally();

        this.isVoting.set(false);
      },
      error: () => {
        this.isVoting.set(false);
        this.toastr.error('Cannot remove vote.');
      }
    });
  }

  private replaceOrInsertUserVote(vote: any){
    const userId = this.authService.getUserId();
    const votes = this.meme.Votes ?? [];
    const index = votes.findIndex(v => v.userId === userId);

    if (index >= 0) {
      this.meme.Votes = [
        ...votes.slice(0, index),
        vote,
        ...votes.slice(index + 1)
      ];
    } else {
      this.meme.Votes = [...votes, vote];
    }
  }

  private removeUserVoteLocally(){
    const userId = this.authService.getUserId();
    this.meme.Votes = (this.meme.Votes ?? []).filter(v => v.userId !== userId);
  }

  isUserMemeOwner(){
    return (this.meme.userId === this.authService.getUserId());
  }

  openEditModal() {
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
  }

  openDeleteModal() {
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal() {
    this.isDeleteModalOpen.set(false);
  }

  handleCaptionSave(newCaption: string) {
    this.isSavingCaption.set(true);

    this.restService
      .updateMeme(this.meme.memeId, newCaption)
      .subscribe({
        next: () => {
          this.toastr.success('Caption updated successfully');

          this.captionUpdated.emit({
            memeId: this.meme.memeId,
            caption: newCaption
          });

          this.isEditModalOpen.set(false);
          this.isSavingCaption.set(false);
        },
        error: (err) => {
          console.error(err);
          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to update caption';

          this.toastr.error(message);
          this.isSavingCaption.set(false);
        }
      });
  }

  handleDeleteConfirm() {
    this.isDeleting.set(true);

    this.restService
      .deleteMeme(this.meme.memeId)
      .subscribe({
        next: () => {
          this.toastr.success('Meme deleted');

          this.memeDeleted.emit(this.meme.memeId);

          this.isDeleteModalOpen.set(false);
          this.isDeleting.set(false);
        },
        error: (err) => {
          console.error(err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to delete meme';

          this.toastr.error(message);
          this.isDeleting.set(false);
        }
      });
  }

  openCommentsModal(){
    if (!this.authService.isUserAuthenticated()) {
      this.toastr.warning('You must be logged in to view comments.', 'Authentication required');
      return;
    }

    this.isCommentsModalOpen.set(true);
  }

  closeCommentsModal(){
    this.isCommentsModalOpen.set(false);
  }

  handleCommentsCountChanged(newCount: number){
    this.meme.commentsCount = newCount;
  }
}