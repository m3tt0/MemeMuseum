import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateUsernameModal } from './update-username-modal';

describe('UpdateUsernameModal', () => {
  let component: UpdateUsernameModal;
  let fixture: ComponentFixture<UpdateUsernameModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateUsernameModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateUsernameModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
