import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SystemSettingsService } from '../../services/system-settings.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-security-dialog',
  templateUrl: './security-dialog.component.html',
  styleUrls: ['./security-dialog.component.scss']
})
export class SecurityDialogComponent implements OnInit {

  passwordForm: FormGroup;
  showInvalidPassword = false;
  isSubmitted = false;
  inProgress = false;

  constructor(
    public dialogRef: MatDialogRef<SecurityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sysSettingsService: SystemSettingsService,
    public langService: LanguageService
    ) { }

  ngOnInit() {
    // Init the passwordForm
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required)
    });
  }

  get password() { return this.passwordForm.get('password'); }

  checkPassword(pwd: string) {
    this.isSubmitted = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;

    } else {
      this.inProgress = true;
      this.showInvalidPassword = false;
      const data = { password: pwd };
      this.sysSettingsService.confirm(data).subscribe( result => {
        if (result.body.lastLogin) {
          if ( this.data.op === 'enableTOTP') {
            const body = { state: 1 };
            this.sysSettingsService.enableTwoFactor(body).subscribe( response => {
              this.inProgress = false;
              this.dialogRef.close(response);
            });

          } else if (this.data.op === 'disableTOTP') {
            const body = { state: 0 };
            this.sysSettingsService.enableTwoFactor(body).subscribe( response => {
              this.inProgress = false;
              this.dialogRef.close(response);
            });

          } else if (this.data.op === 'generateCodes') {
            this.sysSettingsService.regenerateBackupCodes().subscribe( response => {
              this.inProgress = false;
              this.dialogRef.close(response);
            });
          }

        } else {
          this.showInvalidPassword = true;
          this.inProgress = false;
          return;
        }
      });
    }
  }

}
