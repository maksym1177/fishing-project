import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service'; 

@Component({
  selector: 'app-admin-add-location',
  templateUrl: './admin-add-location.component.html'
})
export class AdminAddLocationComponent {
  locationForm: FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService) {
    this.locationForm = this.fb.group({
      locationNumber: ['', Validators.required],
      type: ['al8', Validators.required],
      capacity: [14, Validators.required],
      pricePerDay: ['', Validators.required],
      imageUrl: [''],
      note: ['']
    });
  }

  onSubmit() {
    if (this.locationForm.valid) {
      this.adminService.addLocation(this.locationForm.value).subscribe({
        next: (result) => {
          if (result === "success_add") {
            alert("Локацію успішно додано!");
            this.locationForm.reset({ type: 'al8', capacity: 14 });
          } else {
            alert("Помилка: " + result);
          }
        },
        error: (err) => console.error(err)
      });
    }
  }
}