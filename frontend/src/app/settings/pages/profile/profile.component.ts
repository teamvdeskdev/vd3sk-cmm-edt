import { Component, OnInit, OnDestroy } from '@angular/core';
import { SystemSettingsService } from '../../services/system-settings.service';
import { globals } from 'src/config/globals';
import { MatDialog } from '@angular/material/dialog';
import { PictureDialogComponent } from '../../components/picture-dialog/picture-dialog.component';
import { VshareUploadDialogComponent } from '../../components/vshare-upload-dialog/vshare-upload-dialog.component';
import { Router } from '@angular/router';
import { LogoService } from 'src/app/app-services/logo.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { CacheService } from 'src/app/mail/services/cache.service';
// tslint:disable-next-line: max-line-length
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { CurrentUser } from 'src/app/app-model/common/user';
import { LanguageService } from '../../services/language.service';
import { UserdialogPasswordComponent } from '../users-settings/components/userdialog-password/userdialog-password.component';
import { LogoutService } from 'src/app/app-shared/logout.service';
import { DictionaryPassword } from './dictionaryQuery';
import dictionaryTim from './dictionaryTim.json';
import { IdleTimeService } from 'src/app/app-shared/idle-time.service';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { UtilitiesService } from 'src/app/app-services/utilities.service';

export interface UserData {
  id: string;
  label: string;
  value: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  currentUser: CurrentUser;
  displayNameString: string;
  profilePicUrl = '';
  usedSpaceString: string;
  usedSpaceStringEn: string;
  iconSpace: string;
  mySubscription: any;
  isLoading = false;
  nameForm: FormGroup;
  lastNameForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  nameIsChanging = false;
  lastnameIsChanging = false;
  emailIsChanging = false;
  passwordIsChanging = false;
  showEditPasswordInput = false;
  isLoadingPage = false;
  isLoadingPassword = false;
  SamlUSer:boolean;

  ELEMENT_DATA: UserData[] = [];
  displayedColumns: string[] = ['id', 'label', 'value', 'next'];
  dataSource;
  groupsString: string;
  guestUser: boolean;
  bool1: boolean;
  bool2: boolean;

  public dictionaryList: {Parole: string}[] = dictionaryTim;

  constructor(
    private router: Router,
    private sysSettingsService: SystemSettingsService,
    private dialog: MatDialog,
    private logoService: LogoService,
    private _snackBar: MatSnackBar,
    private authService: AuthenticationService,
    public cacheService: CacheService,
    private dataSharingService: DataSharingService,
    public langService: LanguageService,
    private logoutService: LogoutService,
    private idleTimeService: IdleTimeService,
    private adminService: AdminSettingsService,
    private utilitiesService: UtilitiesService,
  ) {
    // Init the nameForm
    this.nameForm = new FormGroup({
      fullName: new FormControl('')
    });
    // Init the emailForm
    this.emailForm = new FormGroup({
      email: new FormControl('')
    });
    // Init the passwordForm
    this.passwordForm = new FormGroup({
      password: new FormControl('password'),
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(128), Validators.pattern('^(?!.*\\s{2}).*$')]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(128), Validators.pattern('^(?!.*\\s{2}).*$')])
    });
  }

  get fullName() { return this.nameForm.get('fullName'); }
  get email() { return this.emailForm.get('email'); }
  get password() { return this.passwordForm.get('password'); }

  ngOnInit() {
    this.isLoadingPage = true;
    // Get the current user
    this.currentUser = this.authService.currentUser;

    // Set name input field
    if (this.currentUser.displayname) {
      this.nameForm.setValue({ fullName: this.currentUser.displayname });
    } else {
      this.nameForm.setValue({ fullName: '' });
    }

    // Set email input field
    if (this.currentUser.email) {
      this.emailForm.setValue({ email: this.currentUser.email });
    } else {
      this.emailForm.setValue({ email: '' });
    }

    // this.profilePicUrl = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + this.currentUser.id + `&size=120`;
    this.profilePicUrl = `${globals.endpoint}/setting/info/avatar/currentavatar?size=120&` + new Date().getTime();

    // Get the used space for current user
    const usedSpace = this.currentUser.quota.relative;
    const image = (usedSpace !== 0) ? (Math.ceil(usedSpace / 10) * 10) : 0;
    const usedGiga = Math.ceil(this.currentUser.quota.used / 1073741824); // 1073741824: bytes in 1 GB
    const totalGiga = Math.ceil(this.currentUser.quota.total / 1073741824);
    this.usedSpaceString = ' ' + usedSpace + '% - ' + usedGiga + ' GB utilizzati di ' + totalGiga + ' GB totali';
    this.usedSpaceStringEn = ' ' + usedSpace + '% - ' + usedGiga + ' GB used out of ' + totalGiga + ' GB total';
    this.iconSpace = 'assets/img/used_space/' + 'used_space-' + image + '.svg';

    // Get string for user groups
    const groups: any[] = this.currentUser.groups;
    this.groupsString = '';

    for (const index in groups) {
      if (index === (groups.length - 1).toString()) {
        this.groupsString += groups[index];
      } else {
        this.groupsString += groups[index] + ' | ';
      }
    }

    //Look for guest user
    if (this.currentUser.groups.includes('guest')) {
      this.guestUser = true;
    } else {
      this.guestUser = false;
    }

    this.setFormData();
    this.isLoadingPage = false;
    this.SamlUSer = this.authService.isUserSaml;
  }

  setFormData() {
    const ELEMENT_DATA = [
      { id: '1', label: this.langService.dictionary.full_name, value: this.nameForm.get('fullName').value },
      { id: '2', label: this.langService.dictionary.primary_email, value: this.emailForm.get('email').value },
      { id: '3', label: this.langService.dictionary.login_password, value: this.passwordForm.get('password').value },
      { id: '4', label: this.langService.dictionary.membership_groups, value: this.groupsString },
      { id: '5', label: this.langService.dictionary.used_space, value: sessionStorage.getItem('user_language') === 'it' ? this.usedSpaceString : this.usedSpaceStringEn },
      { id: '6', label: this.langService.dictionary.language, value: sessionStorage.getItem('user_language') },
      { id: '7', label: this.langService.dictionary.localization, value: sessionStorage.getItem('user_language') },
    ];

    this.dataSource = ELEMENT_DATA;
  }

  openFileExplorer() {
    document.getElementById('upload-file').click();
  }

  addFile(event: Event, files: FileList) {
    this.isLoading = true;
    const fileToUpload: File = files.item(0);

    // Call for file upload
    this.sysSettingsService.uploadAvatar(fileToUpload).subscribe(response => {
      this.isLoading = false;

      // Open dialog for file cropping
      const dialogRef = this.dialog.open(PictureDialogComponent, {
        data: event
      }
      );
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.isLoading = true;
          this.sysSettingsService.cropImage(data).subscribe(result => {
            if (result.message === 'success') {
              this.logoService.onProfilePictureChange(true);
              this.refreshPicture();
            }
          });
        }
      });
    });
  }

  deletePicture() {
    this.isLoading = true;
    this.sysSettingsService.deleteAvatar().subscribe(response => {
      if (response.message === 'success') {
        this.logoService.onProfilePictureChange(true);
        this.refreshPicture();
      }
    });
  }

  refreshPicture() {
    setTimeout(() => {
      this.isLoading = false;
      this.profilePicUrl = `${globals.endpoint}/setting/info/avatar/currentavatar?size=120&` + new Date().getTime();
    }, 3000);
  }

  openVShareUploadDialog() {
    // open dialog for file upload from vshare
    const dialogRef = this.dialog.open(VshareUploadDialogComponent, {
      width: '700px',
      height: '400px',
      data: { path: '/' }
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  updateDisplayName(fullNameValue: any) {
    this.isLoadingPage = true;
    this.nameIsChanging = false;
    if (this.authService.isUserSaml) {
      const data = {
        id : this.currentUser.id,
        key : 'display',
        value : fullNameValue
      };
      this.adminService.usersamlUpdateUser(data).subscribe(result => {
        if (result && result.Performed) {
          const snackBarRef = this._snackBar.open(this.langService.dictionary.save_fullname_msg, null, {
            duration: 4000,
            panelClass: 'toast-success'
          });
        } else {
          // GENERIC ERROR
          this._snackBar.open(this.langService.dictionary.no_save_fullname_msg, null, {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }
        this.isLoadingPage = false;
      });
    } else {
      const data = {
        key: 'displayname',
        value: fullNameValue
      };

      this.sysSettingsService.updateUser(this.currentUser.id, data).subscribe(result => {
        if (result && result.ocs && result.ocs.meta && result.ocs.meta.statuscode === 200) {
          const snackBarRef = this._snackBar.open(this.langService.dictionary.save_fullname_msg, null, {
            duration: 4000,
            panelClass: 'toast-success'
          });
        } else if (result && result.ocs && result.ocs.meta && result.ocs.meta.statuscode === 997) {
          // CONFIRM USER PASSWORD
          const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
            width: '370px',
            height: '270px',
            data: {},
          });
          dialogRef.afterClosed().subscribe(password => {
            if (password) {
              this.sysSettingsService.confirmPassword(password).subscribe((result: any) => {
                if (result.status === 403) {

                  this._snackBar.open(this.langService.dictionary.wrong_password, null, {
                    duration: 4000,
                    panelClass: 'toast-error'
                  });
                } else {
                  this.updateDisplayName(fullNameValue);
                }
              });
            }
          });
        } else {
          // GENERIC ERROR
          this._snackBar.open(this.langService.dictionary.no_save_fullname_msg, null, {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }

        this.isLoadingPage = false;
      });
    }
  }

  updateEmail(emailValue: any) {
    this.isLoadingPage = true;
    this.emailIsChanging = false;

    if (this.authService.isUserSaml) {
      const data = {
        id : this.currentUser.id,
        key : 'email',
        value : emailValue
      };
      this.adminService.usersamlUpdateUser(data).subscribe(result => {
        if (result && result.Performed) {
          const snackBarRef = this._snackBar.open(this.langService.dictionary.save_email_msg, null, {
            duration: 4000,
            panelClass: 'toast-success'
          });
        } else {
          // GENERIC ERROR
          this._snackBar.open(this.langService.dictionary.no_save_email_msg, null, {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }
        this.isLoadingPage = false;
      });

    } else {
      const data = {
        key: 'email',
        value: emailValue
      };

      this.sysSettingsService.updateUser(this.currentUser.id, data).subscribe(result => {
        if (result && result.ocs && result.ocs.meta && result.ocs.meta.statuscode === 200) {
          const snackBarRef = this._snackBar.open(this.langService.dictionary.save_email_msg, null, {
            duration: 4000,
            panelClass: 'toast-success'
          });
        } else if (result && result.ocs && result.ocs.meta && result.ocs.meta.statuscode === 997) {
          // CONFIRM USER PASSWORD
          const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
            width: '370px',
            height: '270px',
            data: {},
          });
          dialogRef.afterClosed().subscribe(password => {
            if (password) {
              this.sysSettingsService.confirmPassword(password).subscribe((result: any) => {
                if (result.status === 403) {

                  this._snackBar.open(this.langService.dictionary.wrong_password, null, {
                    duration: 4000,
                    panelClass: 'toast-error'
                  });
                } else {
                  this.updateEmail(emailValue);
                }
              });
            }
          });
        } else {
          // GENERIC ERROR
          this._snackBar.open(this.langService.dictionary.no_save_email_msg, null, {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }

        this.isLoadingPage = false;
      });
    }
  }

  editPassword() {
    this.showEditPasswordInput = !this.showEditPasswordInput;
  }

  savePassword() {
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
      this._snackBar.open(this.langService.dictionary.no_match_pwd, null, {
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
          const snackBarRef = this._snackBar.open(this.langService.dictionary.save_password_message, null, {
            duration: 6000,
            panelClass: 'toast-success'
          });
          snackBarRef.afterDismissed().subscribe(() => {
            this.logoutService.logoutUser();
            this.idleTimeService.stopIdle();
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

changeUserLanguage(selectedValue: any) {
    this.isLoadingPage = true;
    if (this.authService.isUserSaml) {
      const data = {
        id : this.currentUser.id,
        key : 'language',
        value : selectedValue
      };
      this.adminService.usersamlUpdateUser(data).subscribe(result => {
      if (result && result.Performed) {
        this.updateSessionUserLanguage(selectedValue);
        this.setFormData();

        const snackBarRef = this._snackBar.open(this.langService.dictionary.save_language_msg, null, {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else {
        // GENERIC ERROR
        this._snackBar.open(this.langService.dictionary.no_save_language_msg, null, {
          duration: 4000,
          panelClass: 'toast-error'
        });
      }
      this.isLoadingPage = false;
      });

    } else {
      const data = {
        key: 'language',
        value: selectedValue
      };

      this.sysSettingsService.updateUser(this.currentUser.id, data).subscribe(result => {

        if (result && result.ocs && result.ocs.meta && result.ocs.meta.statuscode === 200) {
          this.updateSessionUserLanguage(selectedValue);
          this.setFormData();

          const snackBarRef = this._snackBar.open(this.langService.dictionary.save_language_msg, null, {
            duration: 4000,
            panelClass: 'toast-success'
          });
        } else if (result && result.ocs && result.ocs.meta && result.ocs.meta.statuscode === 997) {
          // CONFIRM USER PASSWORD
          const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
            width: '370px',
            height: '270px',
            data: {},
          });

          dialogRef.afterClosed().subscribe(password => {

            if (password) {
              this.sysSettingsService.confirmPassword(password).subscribe((result: any) => {

                if (result.status === 403) {
                  this._snackBar.open(this.langService.dictionary.wrong_password, null, {
                    duration: 4000,
                    panelClass: 'toast-error'
                  });
                } else {
                  this.changeUserLanguage(selectedValue);
                }
              });
            }
          });
        } else {
          // GENERIC ERROR
          this._snackBar.open(this.langService.dictionary.no_save_language_msg, null, {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }
        this.isLoadingPage = false;
      });
    }
    this.ngOnInit();
  }

updateSessionUserLanguage(languageValue: string) {
    sessionStorage.setItem('user_language', languageValue);
    this.authService.updateLanguageCookie(languageValue);
    this.currentUser.language = languageValue;
    this.dataSharingService.changeUserLanguage.next(true);
  }

ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
