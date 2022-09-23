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
import { Utilities } from 'src/app/file-sharing/utilities';

export class NewUser {
  id?: number;
  name?: string;
  email?: string;
  groups?: string[];
  quota?: any;
  username?: string;
  password?: string;
}

export class settingsUser{
  id: string = '';
  username: string = '';
  accountname: string = '';
  password: string = '';
  email: string = '';
  groups: any = [];
  modules: any = [];
  quota: string = '';
  quotaValue: string = '';
  image: string = '';
  hide: boolean = false;
  create: boolean = true;
  userManager:boolean = false;
}

@Component({
  selector: 'app-filter-user-dialog',
  templateUrl: './filter-user-dialog.component.html',
  styleUrls: ['./filter-user-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class FilterUserDialogComponent implements OnInit {

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
  util = new Utilities();
  datas: any = [];

  constructor(
    public dialogRef: MatDialogRef<FilterUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: NewUser},
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private adminSettingsService: AdminSettingsService,
    public langService: LanguageService
  ) { }

  ngOnInit(): void {
    this.quotaList = [
      {id: 0, name: '1 GB'},
      {id: 1, name: '5 GB'},
      {id: 2, name: '10 GB'},
      {id: 3, name: this.langService.dictionary.nolimits}
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

  hideError() {
    this.showError = false;
  }

  /** CONFIRM AND CLOSE DIALOG */
  confirm(userFilter){
    const SearchQuota = userFilter.quota[0];
    const SearchGroups = userFilter.groups[0];
    const body = {
      'skip' : 0,
      'take' : 10 // numero simbolico in attesa di nuova chiamata
     };
    this.adminSettingsService.filteredUserList(body).subscribe((result: any) => {
      const UserFilteredList = result.Dtos;
      this.datas = this.util.elaborateUserSettingsNew(UserFilteredList, true, true);
      this.dialogRef.close({
        data: this.datas,
        counterAppliedFilters: '5'});
    });
  }

  /** REMOVE GROUP FILTER */
  deleteSelectGroups(groups,group){
      let Groups = groups.filter(function (e) {
        return e !=group;
      });
      this.user.groups =  Groups;
      return this.user.groups;
  }

  /** REMOVE QUOTA FILTER */
  deleteSelectQuota(quotas,quota){
    let Quota = quotas.filter(function (e) {
      return e !=quota;
    });
    this.user.quota =  Quota;
    return  this.user.quota;
}

}
