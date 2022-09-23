import { Component, OnInit } from '@angular/core';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Utilities } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserdialogPasswordComponent } from '../userdialog-password/userdialog-password.component';
import { UserdialogGroupComponent } from '../userdialog-group/userdialog-group.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminSettingsService } from '../../../../services/admin-settings.service';
import { LanguageService } from 'src/app/settings/services/language.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})
export class UserSearchComponent implements OnInit {
  util = new Utilities();
  data: any = [];
  groups: any = [];
  isdata = false;
  dataDone = false;
  pageUser = true;
  offset = 0;
  notscrolly = true;
  spinnerOn = false;
  namequery = '';
  noData: boolean;
  getpage = 'search-result';


  constructor(
    private adminService: AdminSettingsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public langService: LanguageService
  ) { }

  ngOnInit() {
    this.route.params.subscribe( parameter => {
      this.namequery = parameter.query;

      this.data = [];
      this.groups = [];
      if (!this.spinnerOn) {
        this.isdata = false;
        this.spinner.show();
      }

      this.adminService.userSearchUser(this.offset, this.namequery).subscribe((result: any) => {
        const response = result.ocs.data.users;
        this.data = this.util.elaborateUserSettings(response, true, true);
        this.adminService.userGetGroups().subscribe((result: any) => {
          this.groups = (result.ocs.data.groups.length > 0) ? result.ocs.data.groups : [];
          this.closeLoader();
          this.dataDone = true;
          this.noData = (this.data.length > 1) ? false : true;
        });
      });
    });
  }

  // CLOSE LOADER
  closeLoader() {
    this.spinner.hide();
    this.isdata = true;
  }



  /** DELETE USER
   * Delete -> password if needed -> delete if password if correct
   * Used dialog for password
   * Used toast message on success delete or wrong password
   * @param $event (any -> obj) {id: userid, index: index of the user in this.data}
   */
  deleteUser($event: any) {
    this.adminService.userDeleteUser($event.id).subscribe((result: any) => {
      if (result.ocs.meta.statuscode == 100) {
        this.data[$event.index].hide = !this.data[$event.index].hide;
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.userdelete_success, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.deleteUser($event);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      }
    });
  }

  /** REMOVE USER DEVICES
   * Remove devices -> password if needed -> remove if password if correct
   * Used dialog for password
   * Used toast message on success remove or wrong password
   * @param $event (string) userid
   */
  removeUserDevices($event: string) {
    this.adminService.userRemoveDevices($event).subscribe((result: any) => {
      if (result.ocs.meta.statuscode == 200) {
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.userupdate_success, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.removeUserDevices($event);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      }
    });
  }

  updateUser($event) {
    this.adminService.userUpdateUser($event).subscribe((result: any) => {
      if (result.ocs.meta.statuscode == 200) {
        for (let i in this.data) {
          if (this.data[i].id == $event.id) {
            if ($event.key == 'displayname') { this.data[i].accountname = $event.value; }
            if ($event.key == 'password') { this.data[i].password = $event.value; }
            if ($event.key == 'email') { this.data[i].email = $event.value; }
            if ($event.key == 'quota') { this.data[i].quotaValue = $event.value; }
            this.closeLoader();
            this._snackBar.open(this.langService.dictionary.userupdate_success, '', {
              duration: 4000,
              panelClass: 'toast-success'
            });
            break;
          }
        }
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.updateUser($event);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      } else if (result.ocs.meta.statuscode == 103) {
        this.closeLoader();
        this._snackBar.open(result.ocs.meta.message, '', {
          duration: 4000,
          panelClass: 'toast-error'
        });
      }
    });
  }

  addRemoveGroup($event: any) {
    if ($event.type == 'add') {
      this.addGroupUser($event);
    } else { this.removeGroupUser($event); }
  }

  /** ADD GROUP USER
   * Add group -> password if needed -> add if password if correct
   * Used dialog for password
   * Used toast message on success add or wrong password
   * @param element (any) obj with value(groupid), id(userid), data(add/remove)
   */
  addGroupUser(element: any) {
    this.adminService.userAddGroup(element.id, element.value).subscribe((result: any) => {
      if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.userupdate_success, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.addGroupUser(element);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      }
    });
  }

  /** REMOVE GROUP USER
   * Remove group -> password if needed -> remove if password if correct
   * Used dialog for password
   * Used toast message on success remove or wrong password
   * @param element (any) obj with value(groupid), id(userid), data(add/remove)
   */
  removeGroupUser(element: any) {
    this.adminService.userRemoveGroup(element.id, element.value).subscribe((result: any) => {
      if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.userupdate_success, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.removeGroupUser(element);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      }
    });
  }

  createUser($event: any) {
    this.adminService.userAddUser($event).subscribe((result: any) => {
      if (result.ocs.meta.statuscode == 200) {
        this.spinnerOn = !this.spinnerOn;
        this._snackBar.open(this.langService.dictionary.user_created, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
        this.ngOnInit();
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.createUser($event);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      } else if (result.ocs.meta.statuscode == 102) {
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.error_known_user, '', {
          duration: 4000,
          panelClass: 'toast-error'
        });
      } else if (result.ocs.meta.statuscode == 103) {
        this.closeLoader();
        this._snackBar.open(result.ocs.meta.message, '', {
          duration: 4000,
          panelClass: 'toast-error'
        });
      }
    });
  }

  disableUser($event: string) {
    this.adminService.userDisableUser($event).subscribe((result: any) => {
      if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
        for (let i in this.data) {
          if (this.data[i].id == $event) {
            this.data[i].hide = !this.data[i].hide;
            break;
          }
        }
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.userupdate_success, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.disableUser($event);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      }
    });
  }

  /** RESEND MAIL
   * Resend mail -> password if needed -> resend if password if correct
   * Used dialog for password
   * Used toast message on success send or wrong password
   * @param $event (string) userid
   */
  resendMail($event: string) {
    this.adminService.userSendWelcomeMail($event).subscribe((result: any) => {
      if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.resend_mail, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.resendMail($event);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      }
    });
  }

  /** ON SCROLL
   * On scroll load other users (25)
   */
  onScroll() {
    this.isdata = false;
    this.spinner.show();
    this.notscrolly = false;
    if (this.data.length > 0) {
      this.offset = this.data.length;
    }
    this.adminService.userSearchUser(this.offset, this.namequery).subscribe((result: any) => {
      if (result.ocs.meta.statuscode == 200) {
        if (result.ocs.data.users.length == 0) {
          this.notscrolly = true;
          this.closeLoader();
        } else {
          const response = result.ocs.data.users;
          const data = this.util.elaborateUserSettings(response, true, false);
          this.data = this.data.concat(data);
          this.notscrolly = true;
          this.closeLoader();
        }
      }
    });
  }

  /** ADD NEW GROUP
   * Manages the new group dialog
   */
  addNewGroup(name: string) {
    if (name) {
      this.methodAddNewGroup(name);
    } else {
      const dialogRef = this.dialog.open(UserdialogGroupComponent, {
        width: '370px',
        height: '270px',
        data: {},
      });
      dialogRef.afterClosed().subscribe(name => {
        if (name) { this.methodAddNewGroup(name); }
        else { this.closeLoader(); }
      });
    }
  }

  /** METHOD ADD NEW GROUP
   * Create new group or if needed password open up a dialog
   */
  methodAddNewGroup(name: string) {
    this.adminService.userCreateGroups(name).subscribe((result: any) => {
      if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 200) {
        this.groups.push(name);
        this.closeLoader();
        this._snackBar.open(this.langService.dictionary.group_created, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      } else if (result.ocs.meta.statuscode == 997) {
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
                this.addNewGroup(name);
              }
            });
          } else {
            this.closeLoader();
          }
        });
      }
    });
  }

  goToDisabledUsers() {
    this.router.navigateByUrl('settings/disabled-user-settings');
  }

}
