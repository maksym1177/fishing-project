import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public authModalStage$ = new BehaviorSubject<string>('none');
  

  public isBookingModalOpen$ = new BehaviorSubject<boolean>(false);
  public isProfileModalOpen$ = new BehaviorSubject<boolean>(false);
  public isBookingsModalOpen$ = new BehaviorSubject<boolean>(false);
  public isCalendarOpen$ = new BehaviorSubject<boolean>(false);
  
  public bookingPresetType$ = new BehaviorSubject<string>('al8');


  openLogin() { this.authModalStage$.next('login'); }
  openRegister() { this.authModalStage$.next('register'); }
  closeAuth() { this.authModalStage$.next('none'); }


  openCalendar(type: string) {
    this.bookingPresetType$.next(type);
    this.isCalendarOpen$.next(true);
  }
  closeCalendar() { this.isCalendarOpen$.next(false); }


  openBookingModal(category: string) {
    this.bookingPresetType$.next(category);
    this.isBookingModalOpen$.next(true);
  }
  closeBookingModal() { this.isBookingModalOpen$.next(false); }


  openProfile() { this.isProfileModalOpen$.next(true); }
  closeProfile() { this.isProfileModalOpen$.next(false); }


  openBookings() { this.isBookingsModalOpen$.next(true); }
  closeBookings() { this.isBookingsModalOpen$.next(false); }


  close() {
    this.authModalStage$.next('none');
    this.isBookingModalOpen$.next(false);
    this.isProfileModalOpen$.next(false);
    this.isBookingsModalOpen$.next(false);
    this.isCalendarOpen$.next(false);
  }
}