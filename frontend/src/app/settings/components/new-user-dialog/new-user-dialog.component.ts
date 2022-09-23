import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Domain, DomainToAdd } from '../../../app-model/admin-settings/DomainModel';
import { UserSettingsModel } from '../../../app-model/admin-settings/UserSettingsModel';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';
import { UserdialogPasswordComponent } from 'src/app/file-sharing/components/dialogs/userdialog-password/userdialog-password.component';
import { DictionaryPassword } from './../../pages/profile/dictionaryQuery';
import dictionaryTim from './../../pages/profile/dictionaryTim.json';


export class NewUser {
  id?: number;
  name?: string;
  email?: string;
  groups?: string[];
  quota?: any;
  username?: string;
  password?: string;
  role? : string;
}

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewUserDialogComponent implements OnInit {

  user = new NewUser();
  element: UserSettingsModel;
  type: string;
  newValue: string;
  wait = false;
  isLoading = false;
  showError = false;
  passwordForm: FormGroup;
  usernameForm: FormGroup;
  nameForm: FormGroup;
  emailForm: FormGroup;
  quotaList: any = [];
  groups: any = [];
  isdata = true;
  resumeDispley: boolean;
  selected = [];
  typePassword: any;
  hide = true;
  hidePsw = true;
  bool1: boolean;
  bool2: boolean;
  showRules: boolean;
  roleList: { id: number; name: string; }[];

  constructor(
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: NewUser},
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private adminSettingsService: AdminSettingsService,
    public langService: LanguageService,

  ) {

    this.resumeDispley = false;
    dialogRef.disableClose = false;
    this.newValue = null;
  

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

     // Init the nameForm
     this.nameForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

     // Init the emailForm
     this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }
//
  ngOnInit(): void {
    this.quotaList = [
      {id: 0, name: '1 GB'},
      {id: 1, name: '5 GB'},
      {id: 2, name: '10 GB'},
      {id: 3, name: this.langService.dictionary.nolimits}
    ];
    this.roleList = [
      {id: 0, name: 'Admin'},
      {id: 1, name: 'GGU'},
      {id: 2, name: 'User'},
      {id: 3, name: 'FGM'}
    ];
    this.groups = [];
    this.adminSettingsService.userGetGroups().subscribe((result: any) => {
      this.groups = (result.ocs.data.groups.length > 0) ? result.ocs.data.groups : [];
    });
  }


   /** SHOW LOADER */
   showLoader() {
    this.isdata = false;
    this.spinner.show();
  }

  /** CLOSE LOADER */
  closeLoader() {
    this.spinner.hide();
    this.isdata = true;
  }

  next(user) {
      const newPassword = this.passwordForm.controls.newPassword.value;
      const confirmPassword = this.passwordForm.controls.confirmPassword.value;
      this.passwordForm.markAllAsTouched();
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
      str.includes(this.user.username);
      if (!this.bool1  && !this.bool2) {
          if (str.includes(this.user.username)) {
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
      if (newPassword === confirmPassword) {
        this.passwordForm.controls.newPassword.setErrors(null);
        this.passwordForm.controls.confirmPassword.setErrors(null);
        this.resumeDispley = true;
      } else {
        //this.passwordForm.controls.newPassword.setErrors({ incorrect: true });
        this.passwordForm.controls.confirmPassword.setErrors({ incorrect: true });
        this._snackBar.open(this.langService.dictionary.no_confirm_password_match, null, {
          duration: 3500,
          panelClass: 'toast-error'
        });
      }
  }
  deleteSelect(groups,group){
      let Groups = groups.filter(function (e) {
        return e !=group;
      });
      this.user.groups =  Groups;
      return this.user.groups;
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

  confirm(user) {
    this.showLoader();
    if (user.username && user.email && user.password.length >= 12) {
      if (user.role == "Admin") {
        if (user.groups !== undefined) {
          user.groups.push('admin');
        } else {
          let arrayGroups = ['admin'];
          user.groups = arrayGroups;
        }
      } else if (user.role == "GGU") {
        if (user.groups !== undefined) {
          user.groups.push('admin');
        } else {
          let arrayGroups = ['admin'];
          user.groups = arrayGroups;
        }
      } else if (user.role == "FGM") {
        if (user.groups !== undefined) {
          user.groups.push('admin');
        } else {
          let arrayGroups = ['admin'];
          user.groups = arrayGroups;
        }
      }
      const objSend = {
        userid: user.username,
        email: user.email,
        groups: user.groups,
        language: 'it',
        password: user.password,
        quota: (user.quota == this.langService.dictionary.nolimits) ? 'none' : user.quota,
        subadmin: [],
        displayName: user.name
      };
      this.dialogRef.close(
        {userSend : objSend,
        userRole : user.role });
    } else if (user.password.length <= 11) {
      this.closeLoader();
      this._snackBar.open(this.langService.dictionary.password_short_12, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    } else {
      this.closeLoader();
      this._snackBar.open(this.langService.dictionary.error_nodata, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }
  }

  toastMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-' + type
    });
  }

  hideError() {
    this.showError = false;
  }

  changeTypeInput(input) {
    this.showRules = true;
    if (this.hide) {
      input.type = 'password';
    } else {
      input.type = 'text';
    }
    this.showError = false;
  }

  hideRules() {
    this.showRules = false;
  }

  changeTypeInputComfirm(input) {
    if (this.hidePsw) {
      input.type = 'password';
    } else {
      input.type = 'text';
    }
    this.showError = false;
  }

  showPassword() {
    this.hide = !this.hide;
  }
  showPasswordconfirm() {
    this.hidePsw = !this.hidePsw;
  }
}

