import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterCourt } from '@models';
import { AdminService } from 'app/services/admin.service';

@Component({
  selector: 'app-courtsettings',
  standalone: false,
  templateUrl: './courtsettings.component.html',
  styleUrl: './courtsettings.component.scss'
})
export class CourtsettingsComponent {

  court: MasterCourt;

  constructor(
    private adminService: AdminService,
    public dialogRef: MatDialogRef<CourtsettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { court: MasterCourt }
  ) {
    this.court = data.court;
  }

  addToMaster() {
    this.adminService.addCourtToMaster(this.court.id).subscribe(master => {
      console.log(master);
    });
  }
}
