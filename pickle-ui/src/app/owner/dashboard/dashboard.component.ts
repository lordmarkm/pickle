import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService, OrgService } from '@services';
import { Org } from '@models';
import { MessageComponent } from 'app/components/message.component';
import { tap, filter, switchMap } from 'rxjs/operators';
import { RegisterOrgDialogComponent } from '../dialogs/register-org/register-org.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends MessageComponent implements OnInit, OnDestroy {
  anonymous = false;
  org?: Org;
  loadingOrgs = false;
  private destroy$ = new Subject<void>();

  constructor(private orgs: OrgService, private auth: AuthService, private dialog: MatDialog) {
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
        },
        complete: () => {
          this.loadingOrgs = false;
        }
      });
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













}
