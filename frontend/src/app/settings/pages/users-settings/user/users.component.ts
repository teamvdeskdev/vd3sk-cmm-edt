import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Utilities } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserdialogPasswordComponent } from '../components/userdialog-password/userdialog-password.component';
import { UserdialogGroupComponent } from '../components/userdialog-group/userdialog-group.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminSettingsService } from '../../../services/admin-settings.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/settings/services/language.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { NewUserDialogComponent } from '../../../components/new-user-dialog/new-user-dialog.component';
import { GlobalVariable } from 'src/app/globalviarables';
import { UploadNewuserFileComponent } from 'src/app/settings/components/upload-newuser-file/upload-newuser-file.component';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  util = new Utilities();
  data: any = [];
  groups: any = [];
  isdata = false;
  dataDone = false;
  pageUser = true;
  offset = 0;
  notscrolly = true;
  spinnerOn = false;
  search: string;
  searchname: string;
  dataLenght: any;
  @Output() group: EventEmitter<any> = new EventEmitter();
  resultLenght: any;
  isTim: boolean;
  globalsVar: any;
  responsePage: boolean = false;
  ResumeData: any;

  constructor(
    private adminService: AdminSettingsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private router: Router,
    public langService: LanguageService,
    private authService: AuthenticationService,
    private _global: GlobalVariable,
  ) {
    this.globalsVar = globals;
   }

  ngOnInit() {
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    this.data = [];
    this.groups = [];
    if (!this.spinnerOn) {
      this.isdata = false;
      this.spinner.show();
    }

    const body = {
        'skip' : 0,
        'take' : 15,
        'active' : true,
       };
    this.adminService.userSearchUserList(body).subscribe((result: any) => {
      const response = result.Dtos;
      this.dataLenght = result.Dtos.length;
      this.data = this.util.elaborateUserSettingsNew(response, true, true);
      this.adminService.userGetGroups().subscribe((result: any) => {
        this.groups = (result.ocs.data.groups.length > 0) ? result.ocs.data.groups : [];
        this.closeLoader();
        this.dataDone = true;
      });
    });
  }

  /** SEARCH
   * when write load filtered users (15)
   */
  searchUser(search = '' ) {
      if (!this.spinnerOn) {
        this.isdata = false;
        this.spinner.show();
      }
      this.search = search;
      const body = {
        'skip' : 0,
        'take' : 15,
        'search' : search,
        'active' : true,
      };
      this.adminService.filteredUserList(body).subscribe((result: any) => {
        const response = result.Dtos;
        this.dataLenght = result.Dtos.length;
        this.data = this.util.elaborateUserSettingsNew(response, true, false);
        this.closeLoader();
        this.dataDone = true;
        return this.data;
      });
  }

  /** ON SCROLL
   * On scroll load other users (5)
   */
  onScroll() {
    this.isdata = false;
    this.spinner.show();
    this.notscrolly = false;
    if (this.dataLenght > 0) {
      this.offset = this.dataLenght;
    }
    const body = {
      'skip' : this.offset,
      'take' : 15,
      'search' : this.search,
      'active' : true,
     };
    this.adminService.userSearchUserList(body).subscribe((result: any) => {
        if (result.Dtos.length === 0) {
          this.notscrolly = true;
          this.closeLoader();
        } else {
          const response = result.Dtos;
          const data = this.util.elaborateUserSettingsNew(response, true, false);
          this.data = this.data.concat(data);
          this.dataLenght = this.offset + response.length;
          this.notscrolly = true;
          this.closeLoader();
        }
    });
  }

  /** CLOSE LOADER */
  closeLoader() {
    this.spinner.hide();
    this.isdata = true;
  }

  toastMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-' + type
    });
  }

  /** DELETE USER
   * Delete -> password if needed -> delete if password if correct
   * Used dialog for password
   * Used toast message on success delete or wrong password
   * @param $event (any -> obj) {id: userid, index: index of the user in this.data}
   */
  async deleteUser($event: any) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlDeleteUser($event.id).toPromise();
      if(waitService.Performed){
        this.data[$event.index].hide = !this.data[$event.index].hide;
        this.toastMessage(this.langService.dictionary.userdelete_success, 'success');
      } else this.toastMessage(this.langService.dictionary.userdelete_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userDeleteUser($event.id).subscribe((result: any) => {
        if (result.ocs.meta.statuscode == 100) {
          this.data[$event.index].hide = !this.data[$event.index].hide;
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.userdelete_success, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.deleteUser($event);
              });
            } else this.closeLoader();
          });
        }
      });
    }    
  }

  /** REMOVE USER DEVICES
   * Remove devices -> password if needed -> remove if password if correct
   * Used dialog for password
   * Used toast message on success remove or wrong password
   * @param $event (string) userid
   */
  async removeUserDevices($event: string) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlWipeDevices($event).toPromise();
      if(waitService.Performed) this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
      else this.toastMessage(this.langService.dictionary.userupdate_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userRemoveDevices($event).subscribe((result: any) => {
        if (result.ocs.meta.statuscode == 200) {
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.removeUserDevices($event);
              });
            } else this.closeLoader();
          });
        }
      });
    }
  }

  async updateUser($event) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlUpdateUser($event).toPromise();
      if(waitService.Performed){
        for (let i in this.data) {
          if (this.data[i].id == $event.id) {
            if ($event.key == 'displayname') { this.data[i].accountname = $event.value; }
            if ($event.key == 'password') { this.data[i].password = $event.value; }
            if ($event.key == 'email') { this.data[i].email = $event.value; }
            if ($event.key == 'quota') { this.data[i].quotaValue = $event.value; }
          }
        }
        this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
      } else this.toastMessage(this.langService.dictionary.userupdate_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userUpdateUser($event).subscribe((result: any) => {
        if (result.ocs.meta.statuscode == 200) {
          for (let i in this.data) {
            if (this.data[i].id == $event.id) {
              if ($event.key == 'displayname') { this.data[i].accountname = $event.value; }
              if ($event.key == 'password') { this.data[i].password = $event.value; }
              if ($event.key == 'email') { this.data[i].email = $event.value; }
              if ($event.key == 'quota') { this.data[i].quotaValue = $event.value; }
              this.closeLoader();
              this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.updateUser($event);
              });
            } else this.closeLoader();
          });
        } else if (result.ocs.meta.statuscode == 103) {
          this.closeLoader();
          this.toastMessage(result.ocs.meta.message, 'error');
        }
      });
    }
  }

  async updateCurrentUser() {
    // Refresh the current user object
    const currentUser = await this.authService.getCurrentUser().toPromise();
    if (currentUser !== undefined && currentUser !== null) {
      // Update current user in service and in sessionStorage
      this.authService.currentUser = currentUser;
    }
  }

  addRemoveGroup($event: any) {
    if ($event.type == 'add') {
      this.addGroupUser($event);
    } else {
      this.removeGroupUser($event);
    }
  }

  /** ADD GROUP USER
   * Add group -> password if needed -> add if password if correct
   * Used dialog for password
   * Used toast message on success add or wrong password
   * @param element (any) obj with value(groupid), id(userid), data(add/remove)
   */
  async addGroupUser(element: any) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlAddToGroup(element.id, element.value).toPromise();
      if(waitService.Performed){
        this.updateCurrentUser();
        this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
      } else this.toastMessage(this.langService.dictionary.userupdate_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userAddGroup(element.id, element.value).subscribe((result: any) => {
        if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
          this.updateCurrentUser();
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.addGroupUser(element);
              });
            } else this.closeLoader();
          });
        }
      });
    }
  }

  /** REMOVE GROUP USER
   * Remove group -> password if needed -> remove if password if correct
   * Used dialog for password
   * Used toast message on success remove or wrong password
   * @param element (any) obj with value(groupid), id(userid), data(add/remove)
   */
  async removeGroupUser(element: any) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlRemoveFromGroup(element.id, element.value).toPromise();
      if(waitService.Performed){
        this.updateCurrentUser();
        this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
      } else this.toastMessage(this.langService.dictionary.userupdate_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userRemoveGroup(element.id, element.value).subscribe((result: any) => {
        if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
          this.updateCurrentUser();
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'success');
                } else this.removeGroupUser(element);
              });
            } else this.closeLoader();
          });
        }
      });
    }
  }

  /** CREATE NEW USER
   * Add USER -> password if needed -> add if password if correct
   * Used dialog for password
   * Used toast message on success add or wrong password
   */
  newUser() {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      width: '780px',
      data: {type : 'newUser'},
    });
    dialogRef.afterClosed().subscribe(result => {
      const user = result.userSend;
      const role = result.userRole;
      if (user !== null && user !== undefined && user !== '') {
        this.newUserCreate(user, role);
      }
    });
  }


  newUserFile(){
    this.responsePage = false;
    const dialogRef = this.dialog.open(UploadNewuserFileComponent, {
      width: '580px',
      height: '430px',
      data: {type : 'newUser', page: this.responsePage, data: this.ResumeData},
    });
    dialogRef.afterClosed().subscribe(data => {
      this.isdata = false;
      this.spinner.show();
      this.adminService.uploadNewUser(data).subscribe(response => {
        if(response){
          this.responsePage = true;
          this.ResumeData = response;
          const dialogRef = this.dialog.open(UploadNewuserFileComponent, {
            width: '580px',
            height: '430px',
            data: {type : 'newUser', page: this.responsePage, data: this.ResumeData},
          });
          this.closeLoader();
          dialogRef.afterClosed().subscribe(data => { 
          });
        } else {
          this._snackBar.open(this.langService.dictionary.upload_error, '', {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }
      });
    });
  }

  /** CREATE NEW USER
   * Add USER -> password if needed -> add if password if correct
   * Used dialog for password
   * Used toast message on success add or wrong password
   * @param user (any) obj with value(groupid), id(userid), data(add/remove)
   * Open confirm New user Dialog with resume
   */
  async newUserCreate(user,role) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlAddUser(user).toPromise();
      if(waitService.Performed){
        if (role == "GGU") {
          this.EnableuserManager(waitService.User);
        } else if (role == "FGM") {
          this.EnableFolderManager(waitService.User);
        }
        this.spinnerOn = !this.spinnerOn;
        this._snackBar.open((`${this.langService.dictionary.user + user.displayName + this.langService.dictionary.created}`), '', {
          duration: 4000,
          panelClass: 'toast-grey'
        });
        this.ngOnInit();
        this.spinnerOn = !this.spinnerOn;
        this.ngOnInit();
        this.toastMessage(this.langService.dictionary.user_created, 'success');
      }else this.toastMessage(this.langService.dictionary.usercreate_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userAddUser(user).subscribe((result: any) => {
        if (result.ocs.meta.statuscode === 200) {
          if (role == "GGU") {
            this.EnableuserManager(result.ocs.data.id);
          } else if (role == "FGM") {
            this.EnableFolderManager(result.ocs.data.id);
          }
          this.spinnerOn = !this.spinnerOn;
          this._snackBar.open((`${this.langService.dictionary.user + user.displayName + this.langService.dictionary.created}`), '', {
            duration: 4000,
            panelClass: 'toast-grey'
          });
          this.ngOnInit();
        } else if (result.ocs.meta.statuscode === 997) {
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.newUserCreate(user,role);
              });
            } else this.closeLoader();
          });
        } else if (result.ocs.meta.statuscode === 102) {
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.error_known_user, 'error');
        } else if (result.ocs.meta.statuscode === 103) {
          this.closeLoader();
          this.toastMessage(result.ocs.meta.message, 'error');
        } else {
          this.closeLoader();
          this.toastMessage(result.ocs.meta.message, 'error');
        }
      });
    }
  }


   /** USER MANAGER
   * Activate user manager
   * @param username (string) username
   */
    EnableuserManager(username) {
     const data = {
       'userId' :  username,
       'isUserManager' : true
     };
     this.adminService.EnableUserManager(data).subscribe((result: any) => {
       this.toastMessage(this.langService.dictionary.user_manager_enabled, 'success');
     });
   }
 
   /** FOLDER MANAGER
    * Activate user manager
    * @param username (string) username
    */
    EnableFolderManager(username) {
     const data = {
       'userId' :  username,
       'isFolderManager' : true
     };
     this.adminService.EnableFolderManager(data).subscribe((result: any) => {
       this.toastMessage(this.langService.dictionary.folder_manager_enabled, 'success');
     });
   }
 
  async createUser($event: any) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlAddUser($event).toPromise();
      if(waitService.Performed){
        this.spinnerOn = !this.spinnerOn;
        this.ngOnInit();
        this.toastMessage(this.langService.dictionary.user_created, 'success');
      } else this.toastMessage(this.langService.dictionary.userupdate_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userAddUser($event).subscribe((result: any) => {
        if (result.ocs.meta.statuscode == 200) {
          this.spinnerOn = !this.spinnerOn;
          this.toastMessage(this.langService.dictionary.user_created, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.createUser($event);
              });
            } else this.closeLoader();
          });
        } else if (result.ocs.meta.statuscode == 102) {
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.error_known_user, 'error');
        } else if (result.ocs.meta.statuscode == 103) {
          this.closeLoader();
          this.toastMessage(result.ocs.meta.message, 'error');
        }
      });
    }
  }

  async disableUser($event: string) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlDisableUser($event).toPromise();
      if(waitService.Performed){
        for (let i in this.data) {
          if (this.data[i].id == $event) {
            this.data[i].hide = !this.data[i].hide;
            break;
          }
        }
        this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
      } else this.toastMessage(this.langService.dictionary.userupdate_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userDisableUser($event).subscribe((result: any) => {
        if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
          for (let i in this.data) {
            if (this.data[i].id == $event) {
              this.data[i].hide = !this.data[i].hide;
              break;
            }
          }
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.userupdate_success, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.disableUser($event);
              });
            } else this.closeLoader();
          });
        }
      });
    }
  }

  /** RESEND MAIL
   * Resend mail -> password if needed -> resend if password if correct
   * Used dialog for password
   * Used toast message on success send or wrong password
   * @param $event (string) userid
   */
  async resendMail($event: string) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlResendMail($event).toPromise();
      if(waitService.Performed) this.toastMessage(this.langService.dictionary.resend_mail, 'success');
      else this.toastMessage(this.langService.dictionary.resendmail_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userSendWelcomeMail($event).subscribe((result: any) => {
        if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.resend_mail, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.resendMail($event);
              });
            } else this.closeLoader();
          });
        }
      });
    }
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
        if (name) this.methodAddNewGroup(name);
        else this.closeLoader();
      });
    }
  }

  /** METHOD ADD NEW GROUP
   * Create new group or if needed password open up a dialog
   */
  async methodAddNewGroup(name: string) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminService.usersamlAddGroup(name).toPromise();
      if(waitService.Performed){
        this.groups.push(name);
        this.toastMessage(this.langService.dictionary.group_created, 'success');
      } else this.toastMessage(this.langService.dictionary.groupcreated_error, 'error');
      this.closeLoader();
    }else{
      this.adminService.userCreateGroups(name).subscribe((result: any) => {
        if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 200) {
          this.groups.push(name);
          this.closeLoader();
          this.toastMessage(this.langService.dictionary.group_created, 'success');
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
                  this.toastMessage(this.langService.dictionary.psw_error, 'error');
                } else this.addNewGroup(name);
              });
            } else this.closeLoader();
          });
        }
      });
    }
  }

  goToDisabledUsers() {
    this.router.navigateByUrl('settings/disabled-user-settings');
  }

}
