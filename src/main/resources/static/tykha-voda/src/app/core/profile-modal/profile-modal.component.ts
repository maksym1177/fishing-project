import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit {
  user = {
    name: '',
    email: '',
    phone: '',
    discount: 0
  };

  constructor(
    private authService: AuthService,
    public modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.authService.getUserDetails().subscribe({
      next: (data) => {
        this.user = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          discount: data.discount || 15 
        };
      },
      error: (err) => console.error('Помилка завантаження профілю', err)
    });
  }

  saveProfile() {
    this.authService.updateProfile(this.user.name, this.user.phone).subscribe({
      next: () => {
        alert('Дані успішно оновлено!');
        this.modalService.closeProfile();
      },
      error: (err) => console.error('Помилка збереження', err)
    });
  }
}