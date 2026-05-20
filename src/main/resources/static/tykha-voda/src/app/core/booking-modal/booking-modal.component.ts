import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-modal',
  templateUrl: './booking-modal.component.html',
  styleUrls: ['./booking-modal.component.css']
})
export class BookingModalComponent implements OnInit {
  bookingForm: FormGroup;
  currentStep = 1;
  days: { day: number, disabled: boolean }[] = [];
  locations: any[] = [];
  
  months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];
  years = [new Date().getFullYear(), new Date().getFullYear() + 1];
  
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  selectedDate: string = '';
  selectedCategory: string = 'al8';
  selectedLocationId: number | null = null;
  isLoading = false;
  
  readonly CATEGORY_PRIORITY = ["al8", "al12", "fish_spot"];

  constructor(
    private fb: FormBuilder,
    public modalService: ModalService,
    private bookingService: BookingService
  ) {
    this.bookingForm = this.fb.group({
      date: ['', Validators.required],
      locationId: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tel: ['', Validators.required]
    });
  }

  ngOnInit() {

    this.selectedCategory = this.modalService.bookingPresetType$.getValue();
    this.generateDays();
  }

  async generateDays() {
    this.days = [];
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateToCheck = new Date(this.currentYear, this.currentMonth, d);
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      let isFull = false;
      if (dateToCheck >= today) {
        isFull = await this.isDateFullyBooked(dateStr);
      } else {
        isFull = true;
      }
      this.days.push({ day: d, disabled: isFull });
    }
  }

  async isDateFullyBooked(dateStr: string): Promise<boolean> {
    for (const type of this.CATEGORY_PRIORITY) {
      try {
        const res = await fetch(`/api/locations/by-type?type=${type}&date=${dateStr}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return false;
      } catch (e) { continue; }
    }
    return true;
  }

  onDateChange() {
    this.generateDays();
  }

  selectDay(day: number) {
    const month = String(this.currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    this.selectedDate = `${this.currentYear}-${month}-${dayStr}`;
    this.bookingForm.patchValue({ date: this.selectedDate });
  }

  isSelected(day: number): boolean {
    const month = String(this.currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateToCheck = `${this.currentYear}-${month}-${dayStr}`;
    return this.selectedDate === dateToCheck;
  }

  async toStep2() {
  if (!this.selectedDate) return alert('Оберіть дату');
  this.currentStep = 2;
  this.isLoading = true;

  await this.loadLocations(); 


  if (this.locations.length === 0) {
    for (const type of this.CATEGORY_PRIORITY) {

      if (type === this.selectedCategory) continue;

      try {
        const res = await fetch(`/api/locations/by-type?type=${type}&date=${this.selectedDate}`);
        const data = await res.json();
        
        if (Array.isArray(data) && data.length > 0) {
          this.selectedCategory = type;
          this.locations = data;  
          this.isLoading = false;
          return; 
        }
      } catch (e) { continue; }
    }
  }

  this.isLoading = false;
}

  async loadLocations() {
    this.isLoading = true;
    try {
      const res = await fetch(`/api/locations/by-type?type=${this.selectedCategory}&date=${this.selectedDate}`);
      this.locations = await res.json();
    } catch (err) {
      this.locations = [];
    } finally {
      this.isLoading = false;
    }
  }

  selectLocation(id: number) {
    this.selectedLocationId = id;
    this.bookingForm.patchValue({ locationId: id });
  }

  async loadUserDetails() {
    try {
      const res = await fetch('/api/user/details');
      if (res.ok) {
        const user = await res.json();
        this.bookingForm.patchValue({
          name: user.name || '',
          email: user.email || '',
          tel: user.phone || ''
        });
      }
    } catch (e) {}
  }

  async toStep3() {
    if (!this.selectedLocationId) return alert('Оберіть локацію');
    this.currentStep = 3;
    await this.loadUserDetails();
  }

  async submitBooking() {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }
    this.bookingService.createBooking(this.bookingForm.value).subscribe({
      next: () => {
        alert('Успішно заброньовано!');
        this.modalService.close();
      },
      error: (err) => alert('Помилка: ' + (err.error?.message || 'Спробуйте ще раз'))
    });
  }
}