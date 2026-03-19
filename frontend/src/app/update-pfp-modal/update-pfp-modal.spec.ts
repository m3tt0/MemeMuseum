import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePfpModal } from './update-pfp-modal';

describe('UpdatePfpModal', () => {
  let component: UpdatePfpModal;
  let fixture: ComponentFixture<UpdatePfpModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePfpModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePfpModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
