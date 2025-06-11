import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AuthService, CourtService, CourtDisplayService, OrgService } from '@services';
import { Subject } from 'rxjs';
import { Court, MasterCourt, Org } from '@models';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { displayConstants, localStorageNames } from '../../../misc/constants';
import { MatDialog } from '@angular/material/dialog';
import { RegisterCourtDialogComponent } from 'app/owner/dialogs/register-court/register-court.component';
import { MessageComponent } from '@components';

@Component({
  standalone: false,
  selector: 'app-owner-sidebar-courts',
  templateUrl: './courts.component.html',
  styleUrl: './courts.component.scss'
})
export class CourtsComponent extends MessageComponent implements OnInit, OnChanges, OnDestroy {
  @Input() org!: Org;
  @Input() orgCourts!: { courts: Court[]; }
  masterCourts?: MasterCourt[];
  checkedCourts = new Set<string>();

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private courts: CourtService,
    private courtDisplay: CourtDisplayService,
    private dialog: MatDialog,
    private orgs: OrgService
  ) {
    super();
  }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('onChanges! orgCourts=' + this.orgCourts);
    if (changes['orgCourts'] && this.orgCourts) {
      this.masterCourts = this.orgCourts.courts.map((court: Court) => ({
        checked: this.checkedCourts.has(court.id),
        ...court
      }));
      this.courtDisplay.setDisplayedCourts(this.masterCourts);
    }
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
      if (court) {
        this.orgs.addNewCourt(court).subscribe({
          next: court => {
            this.orgCourts.courts.push(court);
            this.masterCourts!.push({ checked: true, ...court });
            this.checkedCourts.add(court.id);
          },
          error: err => this.setError('Create court failed: ' + err.message)
        });
      }
    });
  }

}
