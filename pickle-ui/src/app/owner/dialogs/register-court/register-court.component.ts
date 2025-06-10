import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Org } from '@models';

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
      address: ['', [Validators.required, Validators.maxLength(100)]],
      contactNo: ['', [Validators.required, Validators.maxLength(50)]],
      org: data.org.id,
      owner: 'current-user'
    });
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
  get addressCtrl() {
    return this.form.get('address');
  }
  get nameCtrl() {
    return this.form.get('name');
  }
  get contactNoCtrl() {
    return this.form.get('contactNo');
  }
}
