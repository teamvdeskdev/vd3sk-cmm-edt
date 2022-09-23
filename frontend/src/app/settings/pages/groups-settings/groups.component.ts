import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Utilities } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { globals } from 'src/config/globals';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserdialogPasswordComponent } from '../users-settings/components/userdialog-password/userdialog-password.component';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  util = new Utilities();
  data: boolean;
  userList: any = [];
  isdata: boolean;
  groupsList: any = [];
  toggleButton = false;


  @ViewChild('groupname') groupname: ElementRef<HTMLInputElement>;

  constructor(
    private router: Router,
    private adminService: AdminSettingsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public langService: LanguageService,
    private authService: AuthenticationService,
  ) {
    /*router.events.subscribe((val) => {
      if(val instanceof NavigationEnd){
        let arrayUrl = val.url.split('/');
        this.getUserByGroup(arrayUrl[arrayUrl.length-1])
      }
    })*/
   }

  ngOnInit() {
    this.showLoader();
    this.getGroupList();

    /*let arrayUrl = window.location.href.split('/');
    this.getUserByGroup(arrayUrl[arrayUrl.length-1]);*/
  }

  showLoader() {
    this.isdata = false;
    this.spinner.show();
  }

  closeLoader() {
    this.isdata = true;
    this.spinner.hide();
  }

  /** TOAST MESSAGE
   * Manage all message toast type
   **/
   toastMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-' + type
    });
  }

  /** GET GROUP LIST
   * Get all groups list
   * Then call for admin list
   */
  async getGroupList() {
    const groupsList = await this.adminService.userGetGroupsDetails().toPromise();
    if (groupsList.ocs.meta.statuscode == 100) {
      this.groupsList = (groupsList.ocs.data.groups.length > 0) ? groupsList.ocs.data.groups : [];
      for (let i in this.groupsList) {
        const admin = await this.adminService.userAdminGroups(this.groupsList[i].id).toPromise();
        if (admin.ocs.meta.statuscode == 100) {
          const adminList = [];
          if (admin.ocs.data.length > 0) {
            for (let a in admin.ocs.data) {
              adminList.push({
                name: admin.ocs.data[a],
                img: `${globals.endpoint}/setting/info/avatar/getavatar?user=` + admin.ocs.data[a] + `&size=30`,
              });
            }
          } else { this.groupsList[i].adminList = []; }
          this.groupsList[i].adminList = adminList;
          this.groupsList[i].adminCount = admin.ocs.data.length;
        } else {

        }
      }
      this.closeLoader();
      this.data = true;
    } else {

    }
  }

  /** DELETE GROUP
   * Delete a group
   * Use dialog for password confirm
   */
  async deleteGroup($event: any) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlRemoveGroup($event.id).toPromise();
      if(waitService.Performed){
        $event.hide = true;
        this.toastMessage(this.langService.dictionary.group_deleted_success, 'success');
      } else this.toastMessage(this.langService.dictionary.group_deleted_error, 'error');
      this.closeLoader();
    }else{
      const doneDelete = await this.adminService.userDeleteGroups($event.id).toPromise();
      if (doneDelete.ocs.meta.statuscode == 997) {
        const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
          width: '370px',
          height: '270px',
          data: {},
        });
        dialogRef.afterClosed().subscribe(password => {
          if (password) {
            this.adminService.confirmPassword(password).subscribe((result: any) => {
              if (result.status == 403) {
                this.closeLoader();
                this._snackBar.open(this.langService.dictionary.psw_error, '', {
                  duration: 4000,
                  panelClass: 'toast-error'
                });
              } else {
                this.deleteGroup($event);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      } else if (doneDelete.ocs.meta.statuscode == 100) {
        $event.hide = true;
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.group_deleted_success, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      }
    }    
  }

  toggleAddGroup() {
    this.toggleButton = !this.toggleButton;
  }

  async addGroup(element: string) {
    this.showLoader();
    if(element.length > 0) {
      if(this.authService.isUserSaml){
        let waitService = await this.adminService.usersamlAddGroup(element).toPromise();
        if(waitService.Performed){
          this.toggleButton = false;
          this.ngOnInit();
          this.toastMessage(this.langService.dictionary.new_group_create, 'success');
        } else this.toastMessage(this.langService.dictionary.newgroupcreate_error, 'error');
        this.closeLoader();
      }else{
        const createNew = await this.adminService.userCreateGroups(element).toPromise();
        if (createNew.ocs.meta.statuscode == 997) {
          const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
            width: '370px',
            height: '270px',
            data: {},
          });
          dialogRef.afterClosed().subscribe(password => {
            if (password) {
              this.adminService.confirmPassword(password).subscribe((result: any) => {
                if (result.status == 403) {
                  this.closeLoader();
                  this._snackBar.open(this.langService.dictionary.psw_error, '', {
                    duration: 4000,
                    panelClass: 'toast-error'
                  });
                } else {
                  this.addGroup(element);
                }
              });
            } else {
              this.closeLoader();
            }
          });
        } else if (createNew.ocs.meta.statuscode == 200) {
          this._snackBar.open(this.langService.dictionary.new_group_create, '', {
            duration: 4000,
            panelClass: 'toast-success'
          });
          this.toggleButton = false;
          this.ngOnInit();
        }
      }
    } else {
      this._snackBar.open(this.langService.dictionary.empty_name_group, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
      this.closeLoader();
    }
  }

}
