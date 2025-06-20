import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { localStorageNames } from '../../misc/constants';
import { Org, Court } from '@models';
import { CourtService } from '../../services/court.service';
import { MessageComponent } from '../../components/message.component';

@Component({
  standalone: false,
  selector: 'app-owner-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class OwnerSidebarComponent extends MessageComponent implements OnInit, OnChanges {
  @Input() org!: Org;
  courts: Court[] = [];
  isCollapsed = true;

  constructor(private courtsService: CourtService) {
    super();
  }

  ngOnInit(): void {
    const storedValue = localStorage.getItem(localStorageNames.ownerSidebarCollapsed);
    this.isCollapsed = storedValue !== null ? storedValue === 'true' : true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['org'] && this.org?.id) {
      this.courtsService.findByOrg(this.org.id).subscribe({
        next: (courts: any) => this.courts = courts.courts,
        error: () => this.setError('Could not get courts for orgName=' + this.org?.name)
      });
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem(localStorageNames.ownerSidebarCollapsed, this.isCollapsed.toString());
  }
}