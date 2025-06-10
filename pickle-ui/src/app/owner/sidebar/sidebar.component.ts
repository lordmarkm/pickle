import { Component, OnInit, Input } from '@angular/core';
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
export class OwnerSidebarComponent extends MessageComponent implements OnInit {
  @Input() org!: Org;
  courts: Court[] = [];
  isCollapsed = true;
  constructor(private courtsService: CourtService) {
    super();
  }
  ngOnInit(): void {
    const storedValue = localStorage.getItem(localStorageNames.ownerSidebarCollapsed);
    this.isCollapsed = storedValue !== null ? storedValue === 'true' : true;
    this.courtsService.findByOrgName(this.org.name).subscribe({
      next: (courts: any) => this.courts = courts,
      error: (err: any) => this.setError('Could not get courts for orgName=' + this.org.name)
    })
  }
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem(localStorageNames.ownerSidebarCollapsed, this.isCollapsed.toString());
  }
}
