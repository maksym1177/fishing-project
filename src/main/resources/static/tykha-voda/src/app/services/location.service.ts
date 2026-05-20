import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  checkAvailability(type: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/locations/by-type?type=${type}&date=${date}`);
  }

  addLocation(type: string, capacity: string, price: string, number: string, image: string, note: string): Observable<string> {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('capacity', capacity);
    params.append('pricePerDay', price);
    params.append('locationNumber', number);
    params.append('imageUrl', image);
    params.append('note', note);

    return this.http.post(`${this.apiUrl}/admin/add-location`, params.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text'
    });
  }
}