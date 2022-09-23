import { Component, OnInit } from '@angular/core';
import { Utilities } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminSettingsService } from '../../../services/admin-settings.service';
import { LanguageService } from 'src/app/settings/services/language.service';
import { MatTableDataSource } from '@angular/material/table';
import { settingsUser } from 'src/app/file-sharing/utilities';
import { globals } from 'src/config/globals';
import { AppConfig } from 'src/app/app-config';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { AnyARecord } from 'dns';

@Component({
  selector: 'app-singlegroup',
  templateUrl: './singlegroup.component.html',
  styleUrls: ['./singlegroup.component.scss']
})
export class SinglegroupComponent implements OnInit {
  util = new Utilities();
  data: any = [];
  groups: any = [];
  group: string = '';
  isdata: boolean = false;
  dataDone: boolean;
  pageUser = true;
  offset = 0;
  notscrolly = true;
  globalsVar: AppConfig;
  dataLength: number = 0;
  searchTerm = new FormControl();
  filteredUsers: any[] = [];
  checkusericon: boolean;
  serviceCall: any;
  choosenOnes: any;
  loading: boolean = false;
  done: boolean = false;
  static dataSourceStatic;
  dataSource: MatTableDataSource<settingsUser>;
  displayedColumns: string[] = ['id', 'image', 'username', 'password', 'email', 'role', 'groups', 'quota', 'others'];

  constructor(
    private adminService: AdminSettingsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public langService: LanguageService
  ) { 
    this.globalsVar = globals;
    this.searchTerm.valueChanges
      .pipe(startWith(''))
      .subscribe( term => {
        if(term && (term.length>0 || term.label.length>0)) this.checkusericon = true;
        else this.checkusericon = false;

        if(this.serviceCall)
          this.serviceCall.unsubscribe();

        if (term.length >= 3) {
          this.showLoader();
          let body = {notIn: [this.group], search: term}
          this.serviceCall = this.adminService.usergroupList(body).subscribe( response => {
            if(response.Performed){
              let users = this.util.userGroupsSettings(response.GroupUsers);
              if(users.length>0) this.filteredUsers = users;
              else{
                this.filteredUsers = [];
                this.showMessage(this.langService.dictionary.user_notfound, 'success');
              }
              this.hideLoader();
            }
          });
        }else{
          this.filteredUsers = [];
        }
      });
  }

  ngOnInit() {
    this.showLoader();
    const arraygroup = window.location.href.split('/');
    this.group = arraygroup[arraygroup.length - 1];
    this.group = this.group.replace(/%20/g, ' ');
    this.getUserByGroup(this.group);
  }

  async getUserByGroup(group: string) {
    this.showLoader();
    let body = { groupId: group }
    let waitService = await this.adminService.usergroupList(body).toPromise();
    if (waitService && waitService.Performed) {
      this.data = this.util.userGroupsSettings(waitService.GroupUsers);
      const groupsList = await this.adminService.userGetGroups().toPromise();
      this.groups = (groupsList.ocs.data.groups.length > 0) ? groupsList.ocs.data.groups : [];
      this.dataSource = SinglegroupComponent.dataSourceStatic = new MatTableDataSource<settingsUser>();
      this.dataSource.data = this.data;
      this.dataLength = this.dataSource.data.length;
      this.hideLoader();
      this.dataDone = true;
    } else {
      this.data = [];
      this.hideLoader();
      this.dataDone = false;
    }
    this.done = true;
  }

  // CLOSE LOADER
  hideLoader() {
    this.spinner.hide();
    this.isdata = true;
  }

  showLoader(){
    this.isdata = false;
    this.spinner.show();
  }

  showMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: ('toast-' + type)
    });
  }

  getUserAdd(user: any){
    this.choosenOnes = user;
  }

  async addUser(){
    if(!this.choosenOnes) return;

    this.showLoader();
    let waitService = await this.adminService.usersamlAddToGroup(this.choosenOnes.id, this.group).toPromise();
    if(waitService && waitService.Performed){
      this.showMessage(this.langService.dictionary.userAdded, 'success');
      this.hideLoader();
      this.ngOnInit();
    }else{
      this.showMessage(this.langService.dictionary.errorGroupAdd, 'error');
      this.hideLoader();
    }
  }

  async removeFromGroup(element: any){
    this.showLoader();
    let waitService = await this.adminService.usersamlRemoveFromGroup(element.id, this.group).toPromise();
    if(waitService && waitService.Performed){
      this.showMessage(this.langService.dictionary.userRemoved, 'success');
      this.hideLoader();
      this.ngOnInit();
    }else{
      this.showMessage(this.langService.dictionary.errorGroupDelete, 'error');
      this.hideLoader();
    }
  }

}
