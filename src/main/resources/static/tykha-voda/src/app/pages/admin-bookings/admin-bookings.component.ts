import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-bookings',
  templateUrl: './admin-bookings.component.html',
  styleUrls: ['./admin-bookings.component.css']
})
export class AdminBookingsComponent implements OnInit {
  activeBookings: any[] = [];
  pastBookings: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.adminService.getAllBookings().subscribe(bookings => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      this.activeBookings = bookings.filter(b => this.parseDate(b.date) >= now);
      this.pastBookings = bookings.filter(b => this.parseDate(b.date) < now);
    });
  }

  parseDate(str: string): Date {
    const parts = str.split('.');
    return parts.length === 3 ? new Date(`${parts[2]}-${parts[1]}-${parts[0]}`) : new Date(str);
  }

  getTypeName(loc: any): string {
    if (!loc || !loc.type) return "Послуга";
    switch (loc.type.trim()) {
      case "al8": return "Альтанка на 8чол";
      case "al12": return "Альтанка на 12чол";
      case "fish_spot": return "Місце для рибалки";
      default: return "Локація: " + loc.type;
    }
  }

  togglePayment(booking: any, event: any) {
    const isPaid = event.target.checked;
    this.adminService.togglePayment(booking.id, isPaid).subscribe({
      next: () => booking.ispaid = isPaid
    });
  }

  cancelBooking(id: number) {
    if (confirm("Видалити бронювання?")) {
      this.adminService.deleteBooking(id).subscribe(() => this.loadData());
    }
  }
}