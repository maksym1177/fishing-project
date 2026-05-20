import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  
  constructor(public modalService: ModalService) {}


  openBooking(category: string) {
    this.modalService.openBookingModal(category);
  }
}