import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemeFeed } from './meme-feed';

describe('MemeFeed', () => {
  let component: MemeFeed;
  let fixture: ComponentFixture<MemeFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemeFeed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemeFeed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
