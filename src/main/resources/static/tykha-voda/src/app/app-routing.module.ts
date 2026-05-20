import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { AdminBookingsComponent } from './pages/admin-bookings/admin-bookings.component';
import { AdminAddLocationComponent } from './pages/admin-add-location/admin-add-location.component';
import { AboutComponent } from './pages/about/about.component';
import { RulesComponent } from './pages/rules/rules.component';
import { ServicesComponent } from './pages/services/services.component';
import { TournamentsComponent } from './pages/tournaments/tournaments.component';
import { TrophiesComponent } from './pages/trophies/trophies.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin-bookings', component: AdminBookingsComponent },
  { path: 'admin-add-location', component: AdminAddLocationComponent },
  { path: 'about', component: AboutComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'tournaments', component: TournamentsComponent },
  { path: 'trophies', component: TrophiesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }