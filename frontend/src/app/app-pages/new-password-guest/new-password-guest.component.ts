import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'src/app/app-config';
import { globals } from 'src/config/globals';
import { LanguageService } from 'src/app/app-services/language.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import dictionaryTim from '../../../app/settings/pages/profile/dictionaryTim.json';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { CurrentUser } from 'src/app/app-model/common/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SystemSettingsService } from 'src/app/settings/services/system-settings.service';
import { DictionaryPassword } from '../../../app/settings/pages/profile/dictionaryQuery';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { UtilitiesService } from 'src/app/app-services/utilities.service';

@Component({
  selector: 'app-new-password-guest',
  templateUrl: './new-password-guest.component.html',
  styleUrls: ['./new-password-guest.component.scss']
})
export class NewPasswordGuestComponent implements OnInit {
  
  globalsVar: AppConfig;
  isLoadingPassword = false;
  passwordForm: FormGroup;
  passwordIsChanging = false;
  inProgress = false;
  bool1: boolean;
  bool2: boolean;
  currentUser: CurrentUser;
  showRules: boolean;

  public dictionaryList: {Parole: string}[] = dictionaryTim;

  constructor(
    public langService: LanguageService,
    private authService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private sysSettingsService: SystemSettingsService,
    private router: Router,
    private dashService: DashboardService,
    private utilitiesService: UtilitiesService,
  ) {
    this.globalsVar = globals;
    // Init the passwordForm
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(128), Validators.pattern('^(?!.*\\s{2}).*$')]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(128), Validators.pattern('^(?!.*\\s{2}).*$')])
    });
   }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.dashService.setShowHeader(false);
  }

  goTologin(){
    let oldPassword = this.passwordForm.controls.oldPassword.value;
    let newPassword = this.passwordForm.controls.newPassword.value;
    let confirmPassword = this.passwordForm.controls.confirmPassword.value;

    if (this.passwordForm.invalid) {
      return;
    }
    var pswCheck = false;
    const str = newPassword.toLowerCase().trim();
    const regex = /((\w)\2{1,})/g;
    const found = str.match(regex);
    const regex2 =  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    const found2 = str.match(regex2);
    this.DictCheckWrong(str);
    this.DictCheckRight(str);
    str.includes(this.currentUser.id);
    if (!this.bool1  && !this.bool2) {
        if (str.includes(this.currentUser.id)) {
            pswCheck = false;
            this.passwordForm.controls.newPassword.setErrors({ rules: true });
            return;
          } else if (found != null && found.length >= 1) {
            pswCheck = false;
            this.passwordForm.controls.newPassword.setErrors({ rules: true });
            return;
          } else if (found2 == null || found2.length < 2) {
            pswCheck = false;
            this.passwordForm.controls.newPassword.setErrors({ rules: true });
            return;
          } else {
            pswCheck = true;
          }
    } else if (this.bool1) {
        pswCheck = false;
        this.passwordForm.controls.newPassword.setErrors({ rules: true });
        return;
    } else if (this.bool2) {
        pswCheck = false;
        this.passwordForm.controls.newPassword.setErrors({ rules: true });
        return;
    }

    if (newPassword === confirmPassword && pswCheck == true) {
      this.passwordForm.controls.newPassword.setErrors(null);
      this.passwordForm.controls.confirmPassword.setErrors(null);
    } else {
      this.passwordForm.controls.newPassword.setErrors({ incorrect: true });
      this.passwordForm.controls.confirmPassword.setErrors({ incorrect: true });
      this._snackBar.open(this.langService.dictionary.no_confirm_password_match, null, {
        duration: 3500,
        panelClass: 'toast-error'
      });
    }


    if (this.passwordForm.valid) {
      this.isLoadingPassword = true;
      var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
      var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
      oldPassword = this.utilitiesService.encryptPass(oldPassword,keyString,ivString) + " " + keyString + " " + ivString;
      newPassword = this.utilitiesService.encryptPass(newPassword,keyString,ivString);
      confirmPassword = this.utilitiesService.encryptPass(confirmPassword,keyString,ivString);
      const data = {
        'oldpassword': oldPassword,
        'newpassword': newPassword,
        'newpassword-clone': confirmPassword,
        'show': 'on'
      };

      this.sysSettingsService.changeUserPassword(data).subscribe(result => {
        if (result.status === 200 && result.body && result.body.data.message === 'Salvato') {
          this.sysSettingsService.setChangedPassword(this.currentUser.id).subscribe( response => {
            if (response.Performed) {
              this.router.navigate(['dashboard']);
            } else {
              this._snackBar.open('Error', null, {
                duration: 3000,
                panelClass: 'toast-error'
              });
              return;
            }
          });
          
        } else if (result.status === 200 && result.body && result.body.data.message !== 'Salvato') {
          this.passwordForm.controls.oldPassword.setErrors({ incorrect: true });
          this._snackBar.open(result.body.data.message, null, {
            duration: 5500,
            panelClass: 'toast-error'
          });
        } else {
          this._snackBar.open(this.langService.dictionary.no_save_password_message, null, {
            duration: 3500,
            panelClass: 'toast-error'
          });
        }

        this.isLoadingPassword = false;
      });
    }
  }

  DictCheckWrong(str) {
    Object.entries(DictionaryPassword).forEach(([key, value]) => {
      if (str.startsWith(key) || str.endsWith(key) || str.includes(key)){
        this.bool1 = true;
      }
      this.bool1 = false;
    });
  }

DictCheckRight(str) {
    for (var i = 0; i < dictionaryTim.length; i++) {
      if (str.includes(dictionaryTim[i].Parole)) {
        var res = str.replace(dictionaryTim[i].Parole, '' ) ;
        if (res.length > 5) {
          this.bool2 = false;
          return;
        } else {
          this.bool2 = true;
          return;
        }
      } else {
      this.bool2 = false;
      }
    }
  }

  showRulesFunction() {
    this.showRules = true;
  }

  hideRules() {
    this.showRules = false;
  }

}
