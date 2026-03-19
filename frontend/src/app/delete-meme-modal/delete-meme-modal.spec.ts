import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMemeModal } from './delete-meme-modal';

describe('DeleteMemeModal', () => {
  let component: DeleteMemeModal;
  let fixture: ComponentFixture<DeleteMemeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMemeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMemeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
