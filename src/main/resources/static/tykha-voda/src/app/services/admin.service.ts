import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<any[]> {
    return this.http.get<any[]>('/api/admin/bookings/active', { withCredentials: true });
  }

  togglePayment(id: number, isPaid: boolean): Observable<any> {
    return this.http.post(`/api/admin/bookings/toggle-pay?id=${id}&isPaid=${isPaid}`, {}, { withCredentials: true });
  }
  addLocation(data: any): Observable<string> {
    let params = new HttpParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        params = params.set(key, data[key]);
      }
    });

    return this.http.post('/api/admin/add-location', params, { 
      responseType: 'text',
      withCredentials: true 
    });
  }
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/admin/bookings/${id}`, { 
        withCredentials: true,
        responseType: 'text' 
    });
}
}