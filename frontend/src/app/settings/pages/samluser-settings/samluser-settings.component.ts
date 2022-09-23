import { Component, OnInit } from '@angular/core';
import { Utilities, settingsSamlUser } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SamluserDialogcreateComponent } from './components/samluser-dialogcreate/samluser-dialogcreate.component';
import { LanguageService } from 'src/app/settings/services/language.service';
import { AdminSettingsService } from 'src/app/settings/services/admin-settings.service';
import { UserdialogPasswordComponent } from 'src/app/settings/pages/users-settings/components/userdialog-password/userdialog-password.component';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { Router } from '@angular/router';
import { GlobalVariable } from 'src/app/globalviarables';

@Component({
  selector: 'app-samluser-settings',
  templateUrl: './samluser-settings.component.html',
  styleUrls: ['./samluser-settings.component.scss']
})
export class SamluserSettingsComponent implements OnInit {

  isdata: boolean = true;
  utilities =  new Utilities();
  notscrolly = true;
  offset = 0;
  data: any = [];
  search: string = '';
  dataLenght: number = 0;
  dataDone: boolean = false;
  pageUser: boolean = true;
  arrayApps: any = [];
  resultLenght: any;

  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    public langService: LanguageService,
    private adminSettingsService: AdminSettingsService,
    private authService: AuthenticationService,
    private router: Router,
    private _global: GlobalVariable,
  ) { }

  ngOnInit(): void {
    this.showLoader();
    const body = {
        'skip' : 0,
        'take' : 15,
        'active' : true,
        "samlOnly": true
       };
    this.adminSettingsService.userSearchUserList(body).subscribe((result: any) => {
      const response = result.Dtos;
      this.dataLenght = result.Dtos.length;
      if(this.dataLenght<15) this.notscrolly = true;
      this.data = this.utilities.elaborateSamlUserSettings(response, true, true);
      this.getApps();
    });
  }

  /** CLOSE LOADER */
  showLoader() {
    this.isdata = false;
    this.spinner.show();    
  }

  /** CLOSE LOADER */
  hideLoader() {
    this.spinner.hide();
    this.isdata = true;
  }

  /** SHOW MESSAGE
   * Show error or success message
   * @param message (string) message
   * @param type (string) message type (error, success)
   **/
   showMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: ('toast-' + type)
    });
  }

  /** ON SCROLL
   * On scroll load other users (5)
   */
   onScroll() {
    if(this.resultLenght<15){
      this.notscrolly = true;
      return;
    }

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
      "samlOnly": true
     };
    this.adminSettingsService.userSearchUserList(body).subscribe((result: any) => {
      if (result.Dtos.length == 0) {
        this.notscrolly = true;
        this.hideLoader();
      } else if(result.Dtos.length<15) {
        const response = result.Dtos;
        const data = this.utilities.elaborateSamlUserSettings(response, true, true);
        this.data = this.data.concat(data);
        this.dataLenght = this.data.length;
        this.resultLenght = result.Dtos.length;
        this.notscrolly = true;
        this.hideLoader();
      }else{
        const response = result.Dtos;
        const data = this.utilities.elaborateSamlUserSettings(response, true, true);
        this.data = this.data.concat(data);
        this.dataLenght = this.data.length;
        this.resultLenght = result.Dtos.length;
        this.notscrolly = true;
        this.hideLoader();
      }
    });
  }

  /** GET APPS
   * Get apps list project
   **/
  async getApps(){
    let waitService = await this.adminSettingsService.getAppsGuest().toPromise();
    if(waitService && waitService.Performed){
      this.arrayApps = waitService.EnabledApps;
    }else{
      this.showMessage(this.langService.dictionary.error_appslist, 'error');
    }
    this.hideLoader();
    this.dataDone = true;
  }

  searchUser(search = '' ) {
    this.showLoader();
    this.search = search;
    const body = {
      'skip' : 0,
      'take' : 15,
      'search' : search,
      'active' : true,
      "samlOnly": true
    };
    this.adminSettingsService.filteredUserList(body).subscribe((result: any) => {
      const response = result.Dtos;
      this.dataLenght = result.Dtos.length;
      this.data = this.utilities.elaborateSamlUserSettings(response, true, true);
      this.hideLoader();
      return this.data;
    });
  }

  /** CREATE NEW USER
   * Add USER -> password if needed -> add if password if correct
   * Used dialog for password
   * Used toast message on success add or wrong password
   */
   newUser() {
    let objectEmpty = new settingsSamlUser();
    const dialogRef = this.dialog.open(SamluserDialogcreateComponent, {
      autoFocus: false,
      data: {
        create : true,
        user: objectEmpty,
        appsList: this.arrayApps,
      },
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result && result!=undefined){
        this.showLoader();
        let waitService = await this.adminSettingsService.samluserCreateUpdate(result.data).toPromise();
        if(waitService.Performed){
          let user = {"userId" : waitService.Dto.uid, "isUserManager" : result.user};
          let waitUser = await this.adminSettingsService.EnableUserManager(user).toPromise();
          let folder = {"userId" :  waitService.Dto.uid, "isFolderManager" : result.folder};
          let waitFolder = await this.adminSettingsService.EnableFolderManager(folder).toPromise();
          let apps = {'userId': waitService.Dto.uid, 'vdeskApp': result.apps};
          let waitApps = await this.adminSettingsService.usersamlAddApps(apps).toPromise();
          this.hideLoader();
          this.ngOnInit();          
          this.showMessage(this.langService.dictionary.samluser_added_successfully, 'success');
        }else{
          this.hideLoader();
          this.showMessage(this.langService.dictionary.error_samluserAdd, 'error')
        }
      }
    });
  }

  updateAllData($event){
    const dialogRef = this.dialog.open(SamluserDialogcreateComponent, {
      autoFocus: false,
      data: {
        create : false,
        user: $event,
        appsList: this.arrayApps,
      },
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result && result!=undefined){
        this.showLoader();
        let waitService = await this.adminSettingsService.samluserCreateUpdate(result.data).toPromise();
        if(waitService.Performed){
          let user = {"userId" : waitService.Dto.uid, "isUserManager" : result.user};
          let waitUser = await this.adminSettingsService.EnableUserManager(user).toPromise();
          let folder = {"userId" :  waitService.Dto.uid, "isFolderManager" : result.folder};
          let waitFolder = await this.adminSettingsService.EnableFolderManager(folder).toPromise();
          let apps = {'userId': waitService.Dto.uid, 'vdeskApp': result.apps};
          let waitApps = await this.adminSettingsService.usersamlAddApps(apps).toPromise();
          this.hideLoader();
          this.ngOnInit();
          this.showMessage(this.langService.dictionary.samluser_updated_successfully, 'success');
        }else{
          this.hideLoader();
          this.showMessage(this.langService.dictionary.error_samluserUpdate, 'error')
        }
      }
    });
  }

  /** DELETE USER
   * Delete -> password if needed -> delete if password if correct
   * Used dialog for password
   * Used toast message on success delete or wrong password
   * @param $event (any -> obj) {id: userid, index: index of the user in this.data}
   */
  deleteUser($event: any) {
      this.adminSettingsService.userDeleteUser($event.id).subscribe((result: any) => {
        if (result.ocs.meta.statuscode == 100) {
          this.data[$event.index].hide = !this.data[$event.index].hide;
          this.hideLoader();
          this.showMessage(this.langService.dictionary.userdelete_success, 'success');
        } else if (result.ocs.meta.statuscode == 997) {
          const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
            width: '370px',
            height: '270px',
            data: {},
          });
          dialogRef.afterClosed().subscribe(password => {
            if (password) {
              this.adminSettingsService.confirmPassword(password).subscribe((result: any) => {
                if (result.status == 403) {
                  this.hideLoader();
                  this.showMessage(this.langService.dictionary.psw_error, 'error');
                } else {
                  this.deleteUser($event);
                }
              });
            } else {
              this.hideLoader();
            }
          });
        }
      });
  }

  async updateCurrentUser() {
    // Refresh the current user object
    const currentUser = await this.authService.getCurrentUser().toPromise();
    if (currentUser !== undefined && currentUser !== null) {
      // Update current user in service and in sessionStorage
      this.authService.currentUser = currentUser;
    }
  }

  async disableUser($event: string) {
    if(this.authService.isUserSaml){
      let waitService = await this.adminSettingsService.usersamlDisableUser($event).toPromise();
      if(waitService.Performed){
        for (let i in this.data) {
          if (this.data[i].id == $event) {
            this.data[i].hide = !this.data[i].hide;
            break;
          }
        }
        this.showMessage(this.langService.dictionary.userupdate_success, 'success');
      } else this.showMessage(this.langService.dictionary.userupdate_error, 'error');
      this.hideLoader();
    }else{
      this.adminSettingsService.userDisableUser($event).subscribe((result: any) => {
        if (result.ocs.meta.status == 'ok' || result.ocs.meta.statuscode == 100) {
          for (let i in this.data) {
            if (this.data[i].id == $event) {
              this.data[i].hide = !this.data[i].hide;
              break;
            }
          }
          this.hideLoader();
          this.showMessage(this.langService.dictionary.userupdate_success, 'success');
        } else if (result.ocs.meta.statuscode == 997) {
          const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
            width: '370px',
            height: '270px',
            data: {},
          });
          dialogRef.afterClosed().subscribe(password => {
            if (password) {
              this.adminSettingsService.confirmPassword(password).subscribe((result: any) => {
                if (result.status == 403) {
                  this.hideLoader();
                  this.showMessage(this.langService.dictionary.psw_error, 'error');
                } else {
                  this.disableUser($event);
                }
              });
            } else {
              this.hideLoader();
            }
          });
        }
      });
    }
  }

  goToDisabledUsers() {
    this.router.navigateByUrl('settings/samlusersdisabled-settings');
  }

}
