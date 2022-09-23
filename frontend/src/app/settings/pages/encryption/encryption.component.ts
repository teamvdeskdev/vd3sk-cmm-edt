import { Component, OnInit } from '@angular/core';
import { SystemSettingsService } from '../../services/system-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { SecurityDialogComponent } from '../../components/security-dialog/security-dialog.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-encryption',
  templateUrl: './encryption.component.html',
  styleUrls: ['./encryption.component.scss']
})
export class EncryptionComponent implements OnInit {

  currentUser: any;
  encryptionForm: FormGroup;
  showInvalidPassword = false;
  showInvalidForm = false;
  showNoMatchPassword = false;
  showEdit = false;
  isLoading = false;
  isSetted = false;

  constructor(
    private sysSettingsService: SystemSettingsService,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    public langService: LanguageService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.sysSettingsService.getEncryptionConfig().subscribe(result => {
      let passwordValue = '';
      let passphraseValue = '';

      if (result && result.Dto && result.Dto.UserId) {
        this.isSetted = true;
        passwordValue = result.Dto.VEncryptPassword;
        passphraseValue = result.Dto.SecurityPhrase;
      }

      // Init the codeForm
      this.encryptionForm = new FormGroup({
        password: new FormControl(passwordValue, [Validators.required, Validators.minLength(12), Validators.pattern('^(?!.*\\s{2}).*$')]),
        confirmPwd: new FormControl(passwordValue, [Validators.required, Validators.minLength(12), Validators.pattern('^(?!.*\\s{2}).*$')]),
        phrase: new FormControl(passphraseValue, Validators.required)
      });
      this.isLoading = false;
    });
  }

  get password() { return this.encryptionForm.get('password'); }
  get confirmPwd() { return this.encryptionForm.get('confirmPwd'); }
  get phrase() { return this.encryptionForm.get('phrase'); }

  onSubmit() {
    const pwd = this.encryptionForm.get('password').value;
    const confirm = this.encryptionForm.get('confirmPwd').value;
    const sPhrase = this.encryptionForm.get('phrase').value;
    this.encryptionForm.markAllAsTouched();

    if (this.encryptionForm.invalid) {
      return;
    }

    if (pwd === confirm) {
      this.isLoading = true;

      const body = {
        VencryptPassword: pwd,
        SecurityPhrase: sPhrase,
        Active: 1
      };
      this.sysSettingsService.setEncryptionConfig(body).subscribe(response => {

        if (response.Performed === true) {
          this.showEdit = false;
          const message = this.langService.dictionary.set_pwd_success;
          this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: 'toast-success'
          });

        } else {
          const message = this.langService.dictionary.set_pwd_failed;
          this._snackBar.open(message, '', {
            duration: 5000,
            panelClass: 'toast-error'
          });
        }
        this.isLoading = false;
      });
    } else {
      this.showNoMatchPassword = true;
      return;
    }
    
  }

  // isValid(value: string): boolean {
  //   // Minimum eight characters, at least one uppercase letter, one lowercase letter,
  //   // one number and one special character
  //   const regexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;

  //   if (value.match(regexp)) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  toggleEdit() {
    this.showEdit = !this.showEdit;
  }
}
