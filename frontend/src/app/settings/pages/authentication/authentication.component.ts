import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SystemSettingsService } from '../../services/system-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { SecurityDialogComponent } from '../../components/security-dialog/security-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrentUser } from 'src/app/app-model/common/user';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { LanguageService } from '../../services/language.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { globals } from 'src/config/globals';
import { AppConfig } from 'src/app/app-config';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss', './authentication-print.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthenticationComponent implements OnInit {

  currentUser: CurrentUser;
  showTOTPSection = false;
  totpEnabled = false;
  qrCode: string = null;
  qrUrl: any = null;
  codeForm: FormGroup;
  totpStatus = '';
  backupCodes = {};
  showBackupCodes = false;
  inProgressCodes = false;
  globalsVar: AppConfig;

  constructor(
    private sysSettingsService: SystemSettingsService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
    public langService: LanguageService,
    private global: GlobalVariable,
  ) {

    this.globalsVar = globals;
    const enabled = sessionStorage.getItem('enabled');
    if (enabled !== undefined && enabled === 'true') {
      this.totpEnabled = true;
    } else {
      this.totpEnabled = false;
    }
  }

  ngOnInit() {
    // Get the current user
    this.currentUser = this.authService.currentUser;

    // Init the codeForm
    this.codeForm = new FormGroup({
      code: new FormControl('')
    });
  }

  get code() { return this.codeForm.get('code'); }

  openConfirmDialog(op: string) {
    if (op === 'enableTOTP') {
      this.totpEnabled = false;
      if ( this.authService.isUserSaml ) {
        const body = {
          'state' : 1,
          'code' : null
        };
        this.sysSettingsService.enableTwoFactorSaml(body).subscribe( response => {
          this.qrCode = response.secret;
          this.qrUrl = response.qrUrl;
          // Init the codeForm
          this.codeForm = new FormGroup({
          code: new FormControl('')
        });
          this.showTOTPSection = true;
        });

      } else {
        const dialogRef = this.dialog.open(SecurityDialogComponent, {
          data: { op }
        });
        dialogRef.afterClosed().subscribe( result => {
          if (result.body.secret) {
            this.qrCode = result.body.secret;
            this.qrUrl = result.body.qrUrl;

            // Init the codeForm
            this.codeForm = new FormGroup({
              code: new FormControl('')
            });

            this.showTOTPSection = true;
          }
        });
      }
    } else if (op === 'disableTOTP') {
      const dialogRef = this.dialog.open(SecurityDialogComponent, {
        data: { op }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result.status === 200 && result.body.state === 0) {
          this.showTOTPSection = false;
          sessionStorage.removeItem('enabled');
          this.totpEnabled = false;
        }
      });

    } else if (op === 'generateCodes') {
      const dialogRef = this.dialog.open(SecurityDialogComponent, {
        data: { op }
      });
      dialogRef.afterClosed().subscribe( result => {
        if (result.status === 200) {
          if (result.body.state.enabled && result.body.codes) {
            this.backupCodes = result.body.codes;
            this.showBackupCodes = true;
          }
        }
      });
    }

  }

  check(checkcode: any) {
    if (checkcode) {
      if (this.authService.isUserSaml) {
        const body = { state: 2, code: checkcode };
        this.sysSettingsService.enableTwoFactorSaml(body).subscribe( response => {
          if (response.state === 2) {
            this.showTOTPSection = false;
            sessionStorage.setItem('enabled', 'true');
            this.totpEnabled = true;
          }
        });
      } else {
        const body = { state: 2, code: checkcode };
        this.sysSettingsService.enableTwoFactor(body).subscribe( response => {
          if (response.body.state === 2) {
            this.showTOTPSection = false;
            sessionStorage.setItem('enabled', 'true');
            this.totpEnabled = true;
          }
        });
      }
    }
  }

  disableTOTP() {
    if (this.authService.isUserSaml) {
      const body = { state: 0 };
      this.sysSettingsService.enableTwoFactorSaml(body).subscribe( response => {
        if (response) {
          if (response.state === 0) {
            this.showTOTPSection = false;
            sessionStorage.removeItem('enabled');
            this.totpEnabled = false;
          }
        } else {
          const message = 'An ERROR has occurred';
          this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: 'toast-error'
          });
        }
      });
    } else {
      const body = { state: 0 };
      this.sysSettingsService.enableTwoFactor(body).subscribe( response => {
        if (response.status === 200) {
          if (response.body.state === 0) {
            this.showTOTPSection = false;
            sessionStorage.removeItem('enabled');
            this.totpEnabled = false;
          }

        } else if (response.status === 403) {
          this.openConfirmDialog('disableTOTP');

        } else {
          const message = 'An ERROR has occurred: ' + response.message + '; ERROR status: ' + response.status;
          this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: 'toast-error'
          });
        }
      });
    }
  }

  regenerateBackupCodes() {
    if ( this.authService.isUserSaml ) {
      this.inProgressCodes = true;
      this.sysSettingsService.regenerateBackupCodesSaml().subscribe( response => {
          if (response.state.enabled && response.codes) {
            this.backupCodes = response.codes;
            this.showBackupCodes = true;
            this.inProgressCodes = false;
          } else {
          this.inProgressCodes = false;
          const message = 'An ERROR has occurred';
          this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: 'toast-error'
          });
        }
      });

    } else {
      this.inProgressCodes = true;
      this.sysSettingsService.regenerateBackupCodes().subscribe( response => {
        if (response.status === 200) {
          if (response.body.state.enabled && response.body.codes) {
            this.backupCodes = response.body.codes;
            this.showBackupCodes = true;
            this.inProgressCodes = false;
          }

        } else if (response.status === 403) {
          this.inProgressCodes = false;
          this.openConfirmDialog('generateCodes');

        } else {
          this.inProgressCodes = false;
          const message = 'An ERROR has occurred: ' + response.message + '; ERROR status: ' + response.status;
          this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: 'toast-error'
          });
        }
      });
    }
  }

  saveBackupCodes() {
    // Download a txt file with backup codes
    const filename = 'vShare - BE Sync&Share-backup-codes.txt';
    const text = this.backupCodes.toString();

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  printBackupCodes() {
    window.print();
  }

}


