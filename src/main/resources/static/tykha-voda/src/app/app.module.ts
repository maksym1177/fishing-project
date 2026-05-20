import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { AuthModalComponent } from './core/auth-modal/auth-modal.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { AboutComponent } from './pages/about/about.component';
import { RulesComponent } from './pages/rules/rules.component';
import { ServicesComponent } from './pages/services/services.component';
import { TournamentsComponent } from './pages/tournaments/tournaments.component';
import { TrophiesComponent } from './pages/trophies/trophies.component';
import { BookingModalComponent } from './core/booking-modal/booking-modal.component';
import { BookingsModalComponent } from './core/bookings-modal/bookings-modal.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileModalComponent } from './core/profile-modal/profile-modal.component';
import { AdminBookingsComponent } from './pages/admin-bookings/admin-bookings.component';
import { AdminAddLocationComponent } from './pages/admin-add-location/admin-add-location.component';
import { AdminService } from './services/admin.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    RulesComponent,
    ServicesComponent,
    TournamentsComponent,
    TrophiesComponent,
    BookingModalComponent,
    BookingsModalComponent,
    HomeComponent,
    AuthModalComponent,
    ProfileModalComponent,
    AdminBookingsComponent,
    AdminAddLocationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }