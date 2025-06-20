import { Input, Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { Master, MasterCourt } from '@models';
import { CourtService, CourtDisplayService, AuthService } from '@services';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  standalone: false,
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent implements OnInit, OnChanges {
  @Input() master: Master | null = null;
  checkedCourts = new Set<string>();
  constructor(private courts: CourtService, private courtDisplay: CourtDisplayService, private authService: AuthService) {}

  isChecked(courtId: string): boolean {
    return this.checkedCourts.has(courtId);
  }

  onCheckUncheck(court: MasterCourt, evt: MatCheckboxChange) {
    const checked = evt.checked;
    if (checked) {
        this.courtDisplay.addDisplayedCourt(court);
        this.checkedCourts.add(court.id);
    } else {
        this.courtDisplay.removeDisplayedCourt(court);
        this.checkedCourts.delete(court.id);
    }
    this.saveCheckedCourts();
  }
  saveCheckedCourts() {
    localStorage.setItem(
      'checkedCourts',
      JSON.stringify(Array.from(this.checkedCourts))
    );
  }
  loadCheckedCourts() {
    const data = localStorage.getItem('checkedCourts');
    if (data) {
      this.checkedCourts = new Set(JSON.parse(data));
    }
    const courts: MasterCourt[] = [];
    for (const courtId of this.checkedCourts) {
      this.courts.findOne(courtId).subscribe(court => {
        if (court) {
          courts.push(court);
        } else {
          this.checkedCourts.delete(courtId);
        }
      });
    }
    if (this.authService.isSignedOut()) {
      this.courtDisplay.setDisplayedCourts(courts);
    } else {
      this.courtDisplay.addDisplayedCourts(courts);
    }
  }

  ngOnInit() {
    this.loadCheckedCourts();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['master']) {
      this.loadCheckedCourts();
    }
  }
}
