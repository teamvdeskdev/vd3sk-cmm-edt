import { Component, EventEmitter, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Domain, DomainToAdd } from '../../../app-model/admin-settings/DomainModel';
import { UserSettingsModel } from '../../../app-model/admin-settings/UserSettingsModel';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditUserDialogComponent implements OnInit {

  newDomainClicked = false;
  domainClicked: any;
  element: UserSettingsModel;
  type: string;
  newValue: string;
  wait = false;
  isLoading = false;
  showError = false;
  passwordForm: FormGroup;
  usernameForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private adminSettingsService: AdminSettingsService,
    public langService: LanguageService,

    @Inject(MAT_DIALOG_DATA) public data
    ) {

    dialogRef.disableClose = false;
    this.newValue = null;
    this.element = data.element;
    this.type = data.type;

    // Init the passwordForm
    this.passwordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(12),
                                        Validators.maxLength(128), Validators.pattern('^(?!.*\\s{2}).*$')]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(12),
                                            Validators.maxLength(128), Validators.pattern('^(?!.*\\s{2}).*$')])
    });

    // Init the usernameForm
    this.usernameForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]*$')]),
      // username: new FormControl('', [Validators.required, Validators.pattern('^[^\\s%$@?^]*$')]),
    });

  }

  ngOnInit() {
  }



  confirm() {
    if (this.type == 'password' || this.type == 'newpassword') {
      const newPassword = this.passwordForm.controls.newPassword.value;
      const confirmPassword = this.passwordForm.controls.confirmPassword.value;
      this.passwordForm.markAllAsTouched();

      if (this.passwordForm.invalid) {
        return;
      }

      if (newPassword === confirmPassword) {
        this.passwordForm.controls.newPassword.setErrors(null);
        this.passwordForm.controls.confirmPassword.setErrors(null);
        this.newValue = newPassword;
        this.dialogRef.close(this.newValue);
      } else {
        this.passwordForm.controls.newPassword.setErrors({ incorrect: true });
        this.passwordForm.controls.confirmPassword.setErrors({ incorrect: true });
        this._snackBar.open(this.langService.dictionary.no_confirm_password_match, null, {
          duration: 3500,
          panelClass: 'toast-error'
        });
      }
    }

    if (this.type == 'newusername') {
      const username = this.usernameForm.controls.username.value;
      this.usernameForm.markAllAsTouched();

      if (this.usernameForm.invalid) {
        return;
      } else {
        this.usernameForm.controls.username.setErrors(null);
        this.newValue = username;
        this.dialogRef.close(this.newValue);
      }
    }
    
    if (this.newValue != null) {
      this.dialogRef.close(this.newValue);
    }

  }

  hideError() {
    this.showError = false;
  }

}
