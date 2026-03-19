import { Component, EventEmitter, OnInit, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { RestBackendService, Comment, PaginatedComments } from '../_services/backend/rest-backend.service';
import { AuthService } from '../_services/auth/auth.service';


@Component({
  standalone: true,
  selector: 'app-comments-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-modal.html',
  styleUrl: './comments-modal.scss',
})
export class CommentsModal implements OnInit {
  private restService = inject(RestBackendService);
  private toastr = inject(ToastrService);
  private authService = inject(AuthService);

  @Input({ required: true }) memeId!: number;
  @Output() close = new EventEmitter();
  @Output() commentsCountChanged = new EventEmitter<number>();

  comments = signal<Comment[]>([]);
  page = signal(1);
  pageSize = 10;
  hasMore = signal(true);
  loading = signal(false);
  loadingMore = signal(false);
  submitting = signal(false);
  deletingCommentId = signal<number | null>(null);
  savingEditedCommentId = signal<number | null>(null);
  editingCommentId = signal<number | null>(null)
  totalComments = signal(0);

  newComment = '';
  editedCommentContent = '';
  backendBaseUrl = 'http://localhost:3030';
  defaultPfp = '/defaultPfp.png';

  ngOnInit(){
    this.resetCommentsState();
    this.loadComments();
  }
  
  resetCommentsState(){
    this.comments.set([]);
    this.page.set(1);
    this.hasMore.set(true);
  }

  handleClose(){
    this.close.emit();
  }

  loadComments(){
    if (!this.hasMore()) return;

    const isFirstPage = this.page() === 1;

    if (isFirstPage) {
      this.loading.set(true);
    } else {
      this.loadingMore.set(true);
    }
    this.restService
      .getComments(this.memeId, this.page(), this.pageSize)
      .pipe(
        finalize(() => {
          if (isFirstPage) {
            this.loading.set(false);
          } else {
            this.loadingMore.set(false);
          }
        })
      )
      .subscribe({
        next: (response: PaginatedComments) => {
          const newComments = response.items;

          this.comments.update(current =>
            isFirstPage ? newComments : [...current, ...newComments]
          );

          this.totalComments.set(response.total);
          this.commentsCountChanged.emit(response.total);

          if (this.page() >= response.totalPages || newComments.length === 0) {
            this.hasMore.set(false);
          } else {
            this.page.update(p => p + 1);
          }
        },
        error: (err) => {
          console.error('Failed to load comments', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to load comments.';

          this.toastr.error(message, 'Comments');
        }
      });
  }

  handleCreateComment(){
    const normalizedContent = this.newComment.trim();

    if (!normalizedContent) {
      this.toastr.warning('Comment cannot be empty.', 'Invalid comment');
      return;
    }

    this.submitting.set(true);

    this.restService.createComment(this.memeId, normalizedContent)
      .pipe(
        finalize(() => this.submitting.set(false))
      )
      .subscribe({
        next: () => {
          this.newComment = '';
          this.toastr.success('Comment added.', 'Success');
          this.resetCommentsState();
          this.loadComments();
        },
        error: (err) => {
          console.error('Failed to create comment', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to add comment.';

          this.toastr.error(message, 'Comment');
        }
      });
  }

  startEditComment(comment: Comment){
    this.editingCommentId.set(comment.commentId);
    this.editedCommentContent = comment.content;
  }

  cancelEditComment(){
    this.editingCommentId.set(null);
    this.editedCommentContent = '';
  }

  handleUpdateComment(commentId: number){
    const normalizedContent = this.editedCommentContent.trim();

    if (!normalizedContent) {
      this.toastr.warning('Comment cannot be empty.', 'Invalid comment');
      return;
    }

    this.savingEditedCommentId.set(commentId);

    this.restService.updateComment(commentId, normalizedContent)
      .pipe(
        finalize(() => this.savingEditedCommentId.set(null))
      )
      .subscribe({
        next: () => {
          this.comments.update(current =>
            current.map(comment =>
              comment.commentId === commentId
                ? { ...comment, content: normalizedContent }
                : comment
            )
          );

          this.editingCommentId.set(null);
          this.editedCommentContent = '';
          this.toastr.success('Comment updated.', 'Success');
        },
        error: (err) => {
          console.error('Failed to update comment', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to update comment.';

          this.toastr.error(message, 'Comment');
        }
      });
  }

  handleDeleteComment(commentId: number){
    this.deletingCommentId.set(commentId);

    this.restService.deleteComment(commentId)
      .pipe(
        finalize(() => this.deletingCommentId.set(null))
      )
      .subscribe({
        next: () => {
          this.comments.update(current =>
            current.filter(comment => comment.commentId !== commentId)
          );
          const updatedTotal = Math.max(this.totalComments() - 1, 0);
          this.totalComments.set(updatedTotal);
          this.commentsCountChanged.emit(updatedTotal);
          this.toastr.success('Comment deleted.', 'Success');
        },
        error: (err) => {
          console.error('Failed to delete comment', err);

          const message =
            err?.error?.description ||
            err?.error?.error ||
            'Failed to delete comment.';

          this.toastr.error(message, 'Comment');
        }
      });
  }

  canManageComment(comment: Comment): boolean {
    const currentUserId = this.authService.getUserId();

    if (!currentUserId) {
      return false;
    }

    return comment.userId === currentUserId;
  }

  onCommentsScroll(event: Event){
    const target = event.target as HTMLElement;

    const threshold = 120;
    const nearBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - threshold;

    if (nearBottom && !this.loading() && !this.loadingMore() && this.hasMore()) {
      this.loadComments();
    }
}

  isEditingComment(commentId: number): boolean {
    return this.editingCommentId() === commentId;
  }

  isDeletingThisComment(commentId: number): boolean {
    return this.deletingCommentId() === commentId;
  }

  isSavingThisEditedComment(commentId: number): boolean {
    return this.savingEditedCommentId() === commentId;
  }

}
