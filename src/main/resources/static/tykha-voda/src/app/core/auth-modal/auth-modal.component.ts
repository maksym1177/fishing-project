import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {
  loginEmail = '';
  loginPassword = '';
  regName = '';
  regEmail = '';
  regPassword = '';

  constructor(
    private authService: AuthService,
    public modalService: ModalService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) return;

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.authService.checkAuth().subscribe(() => {
          this.modalService.closeAuth();
          this.router.navigate(['/']);
          if (this.authService.isAdmin$.getValue()) {
            this.router.navigate(['/admin-bookings']);
          }
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onRegister() {
    if (!this.regName || !this.regEmail || !this.regPassword) return;

    this.authService.register(this.regName, this.regEmail, this.regPassword).subscribe({
      next: (res) => {
        if (res === 'success_reg') {
          window.location.reload();
        } else {
          alert('Помилка реєстрації');
        }
      },
      error: () => alert('Помилка сервера')
    });
  }

  close() {
    this.modalService.closeAuth();
  }
}