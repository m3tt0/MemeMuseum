import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-delete-meme-modal',
  imports: [CommonModule],
  templateUrl: './delete-meme-modal.html',
  styleUrl: './delete-meme-modal.scss',
})
export class DeleteMemeModal {
  @Input() isDeleting = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  handleClose(){
    this.close.emit();
  }

  handleConfirm(){
    this.confirm.emit();
  }
}
