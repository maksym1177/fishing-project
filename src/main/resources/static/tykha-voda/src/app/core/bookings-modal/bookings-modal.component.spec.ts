import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingsModalComponent } from './bookings-modal.component';

describe('BookingsModalComponent', () => {
  let component: BookingsModalComponent;
  let fixture: ComponentFixture<BookingsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingsModalComponent]
    });
    fixture = TestBed.createComponent(BookingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
