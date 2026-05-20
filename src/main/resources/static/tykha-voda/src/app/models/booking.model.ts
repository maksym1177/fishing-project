import { Location } from './location.model';

export interface Booking {
  id?: number;
  location: Location;
  date: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  price: number;
  ispaid: boolean;
}