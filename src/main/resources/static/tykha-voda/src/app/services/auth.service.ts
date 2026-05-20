import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api';

  public isLogined$ = new BehaviorSubject<boolean>(false);
  public isAdmin$ = new BehaviorSubject<boolean>(false);
  public userName$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  checkAuth(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/check-auth`, { withCredentials: true }).pipe(
      tap((data) => {
        if (data) {
          this.isLogined$.next(data.authenticated || false);
          this.isAdmin$.next(data.isAdmin || false);
          this.userName$.next(data.name || '');
        }
      })
    );
  }

  login(email: string, password: string): Observable<string> {
    const params = new URLSearchParams();
    params.append('loginEmail', email);
    params.append('loginPassword', password);

    return this.http.post(`${this.apiUrl}/login`, params.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text',
      withCredentials: true
    }).pipe(
      tap(() => this.checkAuth().subscribe())
    );
  }

  register(name: string, email: string, password: string): Observable<string> {
    const params = new URLSearchParams();
    params.append('regName', name);
    params.append('regEmail', email);
    params.append('regPassword', password);

    return this.http.post(`${this.apiUrl}/register`, params.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text',
      withCredentials: true
    });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true, responseType: 'text' }).pipe(
      tap(() => {
        this.isLogined$.next(false);
        this.isAdmin$.next(false);
        this.userName$.next('');
      })
    );
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/details`, { withCredentials: true });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/get-profile`, { withCredentials: true });
  }

  updateProfile(name: string, phone: string): Observable<string> {
    const params = new URLSearchParams();
    params.append('newName', name);
    params.append('newPhone', phone);

    return this.http.post(`${this.apiUrl}/user/update-profile`, params.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text',
      withCredentials: true
    }).pipe(
      tap(() => this.checkAuth().subscribe())
    );
  }

  updateDiscount(discount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/update-discount?discount=${discount}`, {}, { withCredentials: true });
  }
}