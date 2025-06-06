import { Component, Input } from '@angular/core';
import { Booking, Court } from '@models';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-bookingdetails',
  imports: [ CommonModule ],
  templateUrl: './bookingdetails.component.html',
  styleUrl: './bookingdetails.component.scss'
})
export class BookingdetailsComponent {

  @Input() booking!: Booking;
  @Input() court!: Court;

}
