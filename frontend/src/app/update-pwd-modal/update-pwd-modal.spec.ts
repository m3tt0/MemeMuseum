import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePwdModal } from './update-pwd-modal';

describe('UpdatePwdModal', () => {
  let component: UpdatePwdModal;
  let fixture: ComponentFixture<UpdatePwdModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePwdModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePwdModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
