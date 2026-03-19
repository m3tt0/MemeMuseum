import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMemeModal } from './update-meme-modal';

describe('UpdateMemeModal', () => {
  let component: UpdateMemeModal;
  let fixture: ComponentFixture<UpdateMemeModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateMemeModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMemeModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
