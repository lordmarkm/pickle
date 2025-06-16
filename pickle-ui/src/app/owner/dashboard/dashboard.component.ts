import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, OrgService, BookingService } from '@services';
import { Org, MasterCourt, BookingRequest, Booking } from '@models';
import { MessageComponent } from 'app/components/message.component';
import { tap, filter, switchMap } from 'rxjs/operators';
import { RegisterOrgDialogComponent } from '../dialogs/register-org/register-org.component';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { Observable } from 'rxjs';
import { CourtDisplayService } from '../../services/courtdisplay.service';
import { fadeIn, fadeInOut } from 'app/misc/animations';
import { OwnerSlotselectComponent } from '../dialogs/slotselect/slotselect.component';
import { CourtcalendarComponent } from 'app/components/courtcalendar/courtcalendar.component';
import { displayConstants } from '../../misc/constants';
import { BlockcontrolDialogComponent } from '../dialogs/blockcontrol/blockcontrol.component';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [ fadeInOut, fadeIn]
})
export class DashboardComponent extends MessageComponent implements OnInit, OnDestroy {
  anonymous = false;
  org?: Org;
  loadingOrgs = true;
  courts$?: Observable<MasterCourt[]>;
  private destroy$ = new Subject<void>();
  date = moment().toDate();
  mobile = false;
  bookingRequest?: BookingRequest;
  booking?: Booking;
  selectionType?: string;
  court?: MasterCourt;
  @ViewChildren(CourtcalendarComponent) calendars!: QueryList<CourtcalendarComponent>;

  constructor(private orgs: OrgService, private bookings: BookingService, private auth: AuthService, private dialog: MatDialog, private courtDisplay: CourtDisplayService) {
    super();
  }
  ngOnInit() {
    this.auth.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        tap(user => {
          this.anonymous = !user;
          if (this.anonymous) {
            delete this.org;
          } else {
            this.loadingOrgs = true;
          }
        }),
        filter(user => !!user),
        switchMap(() => this.orgs.getOwned()),
      )
      .subscribe({
        next: org => {
          this.org = org;
          this.loadingOrgs = false;
        },
        error: err => {
          // handle error here
          this.setError('Error loading orgs! ' + err.message);
          this.loadingOrgs = false;
        },
        complete: () => {
          this.loadingOrgs = false;
        }
      });
    this.courts$ = this.courtDisplay.displayedCourts$;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  registerOrg() {
    const dialogRef = this.dialog.open(RegisterOrgDialogComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe((org: Org) => {
      if (org) {
        this.orgs.register(org).subscribe({
          next: saved => this.org = saved,
          error: err => this.setError('Failed to register org. error=' + err.message)
        });
      }
    });
  }
  onSlotSelected(court: MasterCourt, bookingRequest: BookingRequest) {
    const dialogRef = this.dialog.open(OwnerSlotselectComponent, {
      data: {
        bookingRequest: bookingRequest,
        court: court
      }
    });
    dialogRef.afterClosed().subscribe({
      next: retval => {
        if (retval) {
          this.courtDisplay.triggerRefresh(court.id);
        }
      }
    })
  }
  onEventSelected(court: MasterCourt, booking: Booking) {
    console.log(booking);
    switch (booking.type) {
      case 'Block':
        this.handleBlockEventSelected(court, booking);
        break;
    }

    if (this.mobile) {
      /*
      this.dialog.open(EventselectComponent, {
        data: {
          booking: booking,
          court: court
        }
      });
      */
    } else {
      this.booking = booking;
      this.court = court;
      this.selectionType = 'event';
    }
  }

  handleBlockEventSelected(court: MasterCourt, booking: Booking) {
    console.log(booking);
    const blockControlDialog = this.dialog.open(BlockcontrolDialogComponent, {
      data: {
        booking: booking,
        court: court
      },
      width: displayConstants.dialogWidth
    });
    blockControlDialog.afterClosed().subscribe((booking: Booking) => {
      if (booking && booking.deleted) {
        this.bookings.deleteBooking(booking).subscribe({
          next: () => {
            this.setMessage('Time slot block deleted');
            this.courtDisplay.triggerRefresh(court.id);
          },
          error: err => this.setError('Failed to delete time slot block. erorr=' + err.mesasge)
        })
      } else if (booking) {
        this.setMessage('Creating time slot block...');
        this.bookings.updateBooking(booking).subscribe({
          next: () => this.setMessage('Booking updated'),
          error: err => this.setError('Failed to upate time slot block. error=' + err.message)
        });
      }
    });
  }

  onDateChange(evt: { date: Date, atCurrentDate: boolean }) {
    this.date = evt.date;
    this.calendars.forEach(c => c.setDate(this.date));
  }











}
