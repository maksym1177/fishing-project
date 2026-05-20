import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getAdminBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/bookings/active`);
  }

  togglePayment(id: number, isPaid: boolean): Observable<string> {
    return this.http.post(`${this.apiUrl}/admin/bookings/toggle-pay?id=${id}&isPaid=${isPaid}`, {}, { responseType: 'text' });
  }

  cancelBooking(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/bookings/cancel/${id}`, { responseType: 'text' });
  }

  createBooking(bookingData: { locationId: string, date: string, name: string, email: string, tel: string }): Observable<string> {
    const params = new HttpParams()
      .set('locationId', bookingData.locationId)
      .set('date', bookingData.date)
      .set('guestName', bookingData.name)
      .set('guestEmail', bookingData.email)
      .set('guestPhone', bookingData.tel);

    return this.http.post(`${this.apiUrl}/create-booking`, params.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text'
    });
  }

  getMyBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/my-bookings`);
  }
}