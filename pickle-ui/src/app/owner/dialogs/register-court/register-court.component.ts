import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Org } from '@models';
import { timeRangeValidator } from '../../../misc/validators';

@Component({
  selector: 'app-register-court',
  standalone: false,
  templateUrl: './register-court.component.html',
  styleUrl: './register-court.component.scss'
})
export class RegisterCourtDialogComponent {
  org?: Org;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterCourtDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: { org: Org }) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      org: data.org.id,
      owner: 'current-user',
      start: '04:00 pm',
      end: '10:00 pm'
    }, { validators: timeRangeValidator });
    this.org = data.org;
  }
  cancel() {
    this.dialogRef.close();
  }
  submit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
  get nameCtrl() {
    return this.form.get('name');
  }
  get startCtrl() {
    return this.form.get('start');
  }
  get endCtrl() {
    return this.form.get('end');
  }
}
