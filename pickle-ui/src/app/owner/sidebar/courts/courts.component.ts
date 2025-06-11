import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { AuthService, CourtService, CourtDisplayService } from '@services';
import { Subject } from 'rxjs';
import { Court, MasterCourt, Org } from '@models';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { displayConstants, localStorageNames } from '../../../misc/constants';
import { MatDialog } from '@angular/material/dialog';
import { RegisterCourtDialogComponent } from 'app/owner/dialogs/register-court/register-court.component';

@Component({
  standalone: false,
  selector: 'app-owner-sidebar-courts',
  templateUrl: './courts.component.html',
  styleUrl: './courts.component.scss'
})
export class CourtsComponent implements OnInit, OnDestroy {
  @Input() org!: Org;
  @Input() orgCourts!: Court[];
  masterCourts?: MasterCourt[];
  checkedCourts = new Set<string>();

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private courts: CourtService,
    private courtDisplay: CourtDisplayService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.masterCourts = this.orgCourts.map((court: Court) => ({
      checked: true, // TODO: load from localStorage instead of always true
      ...court
    }));
    this.courtDisplay.setDisplayedCourts(this.masterCourts);
  }

  ngOnDestroy() {
  }

  onCheckUncheck(court: MasterCourt, evt: MatCheckboxChange) {
    const checked = evt.checked;
    if (checked) {
      this.courtDisplay.addDisplayedCourt(court);
    } else {
      this.courtDisplay.removeDisplayedCourt(court);
    }
    court.checked = checked;
    this.saveCheckedCourts();
  }

  saveCheckedCourts() {
    if (!this.masterCourts) {
      return;
    }
    const checkedIds = this.masterCourts
      .filter(c => c.checked)
      .map(c => c.id);
    localStorage.setItem(localStorageNames.ownerCheckedCourts, JSON.stringify(checkedIds));
  }

  addCourt() {
    const dialogRef = this.dialog.open(RegisterCourtDialogComponent, {
      data: {
        org: this.org
      },
      width: displayConstants.dialogWidth
    });
    dialogRef.afterClosed().subscribe((court: Court) => {
      console.log(court);
    });
  }

}
