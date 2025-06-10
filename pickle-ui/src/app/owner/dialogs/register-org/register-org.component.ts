import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-org-dialog',
  standalone: false,
  templateUrl: './register-org.component.html',
  styleUrl: './register-org.component.scss'
})
export class RegisterOrgDialogComponent {
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<RegisterOrgDialogComponent>, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      contactNo: ['', [Validators.required, Validators.maxLength(50)]],
      owner: 'current-user'
    });
  }
  cancel(): void {
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
