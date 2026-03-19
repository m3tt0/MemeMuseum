import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-update-meme-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './update-meme-modal.html',
  styleUrl: './update-meme-modal.scss',
})
export class UpdateMemeModal implements OnInit {
  @Input({ required: true }) caption = '';
  @Input() isSaving = false;

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<string>();

  editedCaption = '';

  ngOnInit(){
    this.editedCaption = this.caption;
  }

  handleSave(){
    const normalized = this.editedCaption.trim();
    if(!normalized) return;

    this.save.emit(normalized);
  }

  handleClose(){
    this.close.emit();
  }
}
