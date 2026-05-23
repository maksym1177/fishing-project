import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-bookings-modal',
  templateUrl: './bookings-modal.component.html',
  styleUrls: ['./bookings-modal.component.css']
})
export class BookingsModalComponent implements OnInit {
  activeTab: 'active' | 'past' = 'active';
  
  activeBookings: any[] = [];
  pastBookings: any[] = [];

  constructor(
    private http: HttpClient,
    public modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadMyBookings();
  }

  loadMyBookings() {
    this.http.get<any[]>('/api/user/my-bookings', { withCredentials: true })
      .subscribe(data => {
        const now = new Date();
        this.activeBookings = (data || []).filter(b => new Date(b.date) >= now);
        this.pastBookings = (data || []).filter(b => new Date(b.date) < now);
      });
  }

  switchTab(tab: 'active' | 'past') {
    this.activeTab = tab;
  }
  
  cancel(id: number) {
    this.http.delete(`/api/bookings/cancel/${id}`, { withCredentials: true, responseType: 'text' })
      .subscribe(() => {
        alert('Бронювання успішно відмінено');
        this.loadMyBookings(); 
      });
  }
  getBookingTypeName(type: string): string {
    if (!type) return "Послуга";
    
    switch (type.trim()) {
      case "al8": return "Альтанка на 8 місць";
      case "al12": return "Альтанка на 12 місць";
      case "fish_spot": return "Місце для Рибалки";
      default: return type;
    }
  }
}