import { Input, Component } from '@angular/core';
import { Court, Master, MasterCourt } from '@models';
import { CourtDisplayService } from '@services';

@Component({
  standalone: false,
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss'
})
export class MasterComponent {
  @Input() master: Master | null = null;
  constructor(private courtDisplay: CourtDisplayService) {}

  onCheckUncheck(court: MasterCourt, evt: Event) {
    const checked = (evt.target as HTMLInputElement).checked;
    console.log(`court: ${court.name}, checked: ${checked}`);
    if (checked) {
        this.courtDisplay.addDisplayedCourt(court);
    } else {
        this.courtDisplay.removeDisplayedCourt(court);
    }

  }
}
