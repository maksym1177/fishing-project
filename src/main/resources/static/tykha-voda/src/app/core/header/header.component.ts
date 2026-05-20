import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen: boolean = false;

  constructor(
    public authService: AuthService,
    public modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.checkAuth().subscribe();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onLogout(event: Event) {
    event.preventDefault();
    this.closeMenu();
    this.authService.logout().subscribe(() => {
      window.location.href = '/'; 
    });
  }

  onLoginClick(event: Event) {
    event.preventDefault();
    this.closeMenu();
    this.modalService.openLogin();
  }

  onProfileClick(event: Event) {
    event.preventDefault();
    this.closeMenu();
    this.modalService.openProfile();
  }

  onBookingsClick(event: Event) {
    event.preventDefault();
    this.closeMenu();
    this.modalService.openBookings();
  }
}