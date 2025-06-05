import { Input, Component, OnInit } from '@angular/core';
import { Court, Master, MasterCourt } from '@models';
import { CourtService, CourtDisplayService } from '@services';

@Component({
  standalone: false,
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent implements OnInit {
  @Input() master: Master | null = null;
  checkedCourts = new Set<string>();
  constructor(private courts: CourtService, private courtDisplay: CourtDisplayService) {}

  isChecked(courtId: string): boolean {
    return this.checkedCourts.has(courtId);
  }

  onCheckUncheck(court: MasterCourt, evt: Event) {
    const checked = (evt.target as HTMLInputElement).checked;
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
    for (const courtId of this.checkedCourts) {
      this.courts.findOne(courtId).subscribe(court => {
        if (court) {
          this.courtDisplay.addDisplayedCourt(court);
        } else {
            this.checkedCourts.delete(courtId);
        }
      });
    }
  }

  ngOnInit() {
    this.loadCheckedCourts();
  }
}
