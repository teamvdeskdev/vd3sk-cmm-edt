import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateComponent } from './components/dialog-create/dialog-create.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { settingsGuest } from 'src/app/file-sharing/utilities';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AdminSettingsService } from 'src/app/settings/services/admin-settings.service';
import { Utilities, userGuest } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserdialogPasswordComponent } from '../users-settings/components/userdialog-password/userdialog-password.component';
import { globals } from 'src/config/globals';
import { AppConfig } from 'src/app/app-config';
import { DtoCardEmailCountsResponse } from 'src/app/app-model/dashboard/CardEmailCountsResponse';

@Component({
  selector: 'app-guests-settings',
  templateUrl: './guests-settings.component.html',
  styleUrls: ['./guests-settings.component.scss']
})
export class GuestsSettingsComponent implements OnInit, AfterViewInit {
  util = new Utilities();
  searchname: string = '';
  oldSearch: string = '';
  searchEmpty: boolean = false;
  isLoading: boolean = true;
  guestList: any = [];
  bodyEmpty: boolean;
  dataLength: number = 0;
  pageSize: number = 6;
  displayedColumns: string[] = ['id', 'info', 'actions'];
  dataSource: MatTableDataSource<settingsGuest>;
  pageEvent: PageEvent;
  globalsVar: AppConfig;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public langService: LanguageService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _services: AdminSettingsService,
    private _spinner: NgxSpinnerService,
  ) { 
    this.dataSource = new MatTableDataSource();
    this.globalsVar = globals;
  }

  ngOnInit(): void {
    this.showLoader();
    this.getGuestList();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  /** GET GUEST LIST
   * Get list of guests and add it to table
   **/
  async getGuestList(){
    let waitService = await this._services.getGuestList('guest').toPromise();
    if(waitService.Performed){
      if(waitService.Dto.users){
        this.guestList = this.util.getGuests(waitService.Dto.users);
        this.clearList(this.guestList);
        this.hideLoader();
      }else{
        this.hideLoader();
      }
    }else{
      this.hideLoader();
      this.showMessage('System error', 'error');
    }    
  }

  /** SHOW LOADER
   * Show spinner
   **/
  showLoader(){
    this.isLoading = false;
    this._spinner.show();    
  }

  /** HIDE LOADER 
   * Hide spinner
   **/
  hideLoader() {
    this._spinner.hide();
    this.isLoading = true;
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

  /** CLEAR LIST
   * Update list and paginator after every change
   * @param list (any) guest list
   **/
  clearList(list: any){
    this.dataSource = new MatTableDataSource(list);
    this.dataLength = list.length;
    this.bodyEmpty = (list.length>0)? false : true;
    this.dataSource.paginator = this.paginator;
  }

  async openDialogCreate(){
    let awaitService = await this._services.getAppsGuest().toPromise();
    if(awaitService.Performed){
      let objectEmpty = new userGuest();
      let year = new Date().getFullYear();
      let month = new Date().getMonth()+1 + '';
      let day = new Date().getDate() + '';
      objectEmpty.start = year + '-' + ((month.length>1)? month : '0'+month) + '-' + ((day.length>1)? day : '0'+day);
      objectEmpty.end = (year + 1) + '-' + ((month.length>1)? month : '0'+month) + '-' + ((day.length>1)? day : '0'+day);

      this.dialog.open(DialogCreateComponent, {
        autoFocus: false,
        data: {
          icons: awaitService.EnabledApps,
          update: objectEmpty,
          create: true, 
        }
  
      }).afterClosed().subscribe(async result => {
        if(!result) return;
        else{
          this.showLoader();
          let groupsArray = [];
          for(let b in result.apps){
            groupsArray.push(result.apps[b].name);
          }
          let startArray = result.info.start.split('/');
          let dateStart = (new Date( startArray[2], startArray[1] - 1, startArray[0]).getTime())/1000;
          let endArray = result.info.end.split('/');
          let dateEnd = (new Date( endArray[2], endArray[1] - 1, endArray[0]).getTime())/1000;
          let body = {
            email: result.info.email,
            username: result.info.username,
            name: result.info.name,
            surname: result.info.surname,
            company: result.info.company,
            start: dateStart,
            end: dateEnd,
            guest: true,
            apps: groupsArray,
            nameRef: result.info.managerName,
            surnameRef: result.info.managerSurname,
            emailRef: result.info.managerMail,
            manager: result.info.managerUid,
          };
          let waitService = await this._services.registerGuest(body).toPromise();
          if(waitService.Performed){
            if(waitService.Dto.registrationStatus == 0){
              this.showMessage(this.langService.dictionary.guest_added_successfully, 'success');
              this.addGuest(body, result);
            }else{
              if(waitService.Dto.message.includes('Il nome utente è già utilizzato')) {
                this.showMessage(this.langService.dictionary.guest_existing_username, 'error');
              }else{
                this.showMessage(this.langService.dictionary.guest_existing_mail, 'error');
              }
            }
            this.hideLoader();
          }else{
            if(waitService.Dto.checkSMTP == 2) this.showMessage(this.langService.dictionary.smtp_baderror, 'error');
            else this.showMessage(this.langService.dictionary.smtp_noerror, 'error');            
            this.hideLoader();
          }
        }
  
      });
    }else{

    }
  }

  /** ADD GUEST
   * Create guest object after confirm mail for list
   * @param element (any) guest datas
   **/
  addGuest(element: any, result: any){
    let objectEmpty = new userGuest();
    objectEmpty.id = element.username;
    objectEmpty.name = element.name;
    objectEmpty.surname = element.surname
    objectEmpty.email = element.email;
    objectEmpty.company = element.company;
    objectEmpty.managerId = element.manager;
    objectEmpty.managerName = element.nameRef;
    objectEmpty.managerSurname = element.surnameRef;
    objectEmpty.managerMail = element.emailRef;
    let arrayStart = result.info.start.split('/');
    let datestart = arrayStart[2] + '-' + ((arrayStart[1].length>1)? arrayStart[1] : ('0'+arrayStart[1])) + '-' + ((arrayStart[0].length>1)? arrayStart[0] : ('0'+arrayStart[0]));
    objectEmpty.start = datestart;
    let arrayDate = result.info.end.split('/');
    let dateend = arrayDate[2] + '-' + ((arrayDate[1].length>1)? arrayDate[1] : ('0'+arrayDate[1])) + '-' + ((arrayDate[0].length>1)? arrayDate[0] : ('0'+arrayDate[0]));
    objectEmpty.end = dateend;

    objectEmpty.apps = element.apps;
    objectEmpty.appsString = element.apps.join(' + ');
    this.guestList.push(objectEmpty);
    this.clearList(this.guestList);
  }

  async updateGuest(element){
    let awaitService = await this._services.getAppsGuest().toPromise();
    if(awaitService.Performed){
      this.dialog.open(DialogCreateComponent, {
        autoFocus: false,
        data: {
          icons: awaitService.EnabledApps,
          update: element,
          create: false,
        }
  
      }).afterClosed().subscribe(async result => {
        if(!result) return;
        else{
          this.showLoader();
          let groupsArray = [];
          for(let b in result.apps){
            groupsArray.push(result.apps[b].name);
          }
          let startArray = result.info.start.split('/');
          let firstDate = startArray[2] + '-' + startArray[1] + '-' + startArray[0];
          let localOffset = (-1) * new Date(firstDate).getTimezoneOffset() * 60000;
          let dateStart = Math.round(new Date(new Date(firstDate).getTime() + localOffset).getTime() / 1000);
          let endArray = result.info.end.split('/');
          let secondDate = endArray[2] + '-' + endArray[1] + '-' + endArray[0];
          let localOffset2 = (-1) * new Date(secondDate).getTimezoneOffset() * 60000;
          let dateEnd = Math.round(new Date(new Date(secondDate).getTime() + localOffset2).getTime() / 1000);
          let body = {
            email: result.info.email,
            username: result.info.username,
            name: result.info.name,
            surname: result.info.surname,
            company: result.info.company,
            start: dateStart,
            end: dateEnd,
            guest: true,
            apps: groupsArray,
            nameRef: result.info.managerName,
            surnameRef: result.info.managerSurname,
            emailRef: result.info.managerMail,
            manager: result.info.managerUid,
          };
          let waitService = await this._services.updateGuest(body).toPromise();
          if(waitService.Performed){
            if(waitService.Performed){
              this.showMessage(this.langService.dictionary.guest_updated_successfully, 'success');
              this.updateOldGuest(element, body, result);
            }else{
              this.showMessage(this.langService.dictionary.guest_existing_mail, 'error');
            }
            this.hideLoader();
          }else{
            if(waitService.Dto.checkSMTP == 2) this.showMessage(this.langService.dictionary.smtp_baderror, 'error');
            else this.showMessage(this.langService.dictionary.smtp_noerror, 'error');            
            this.hideLoader();
          }
        }
  
      });
    }else{

    }
  }

  /** UPDATE OLD GUEST
   *  Get old guest and update changed values
   * @param element (any) old values
   * @param body (any) new values
   **/
  updateOldGuest(element: any, body: any, result: any){
    if(element.email != body.email) element.email = body.email;
    if(element.company != body.company) element.company = body.company;
    if(element.managerId != body.manager) element.managerId = body.manager;
    if(element.managerName != body.nameRef) element.managerName = body.nameRef;
    if(element.managerSurname != body.surnameRef) element.managerSurname = body.surnameRef;
    if(element.managerMail != body.emailRef) element.managerMail = body.emailRef;
    if(element.apps.toString() != body.apps.toString()){
      element.apps = body.apps;
      element.appsString = body.apps.join(' + ');
    }
    let arrayDate = result.info.end.split('/');
    let dateend = arrayDate[2] + '-' + ((arrayDate[1].length>1)? arrayDate[1] : ('0'+arrayDate[1])) + '-' + ((arrayDate[0].length>1)? arrayDate[0] : ('0'+arrayDate[0]));
    element.end = dateend;
  }

  async deleteGuest(id: any){
    this.showLoader();
    let waitService = await this._services.userDeleteUser(id).toPromise();
    if (waitService.ocs.meta.statuscode == 100) {
      let index = this.guestList.findIndex(x => x.id == id);
      this.guestList.splice(index, 1);
      this.clearList(this.guestList);
      this.hideLoader();
      this.showMessage(this.langService.dictionary.userdelete_success, 'success');
    } else if (waitService.ocs.meta.statuscode == 997) {
      this.hideLoader();
      const dialogRef = this.dialog.open(UserdialogPasswordComponent, {
        width: '370px',
        height: '270px',
        data: {},
      });
      dialogRef.afterClosed().subscribe(password => {
        if (password) {
          this.showLoader();
          this._services.confirmPassword(password).subscribe((result: any) => {
            if (result.status == 403) {
              this.hideLoader();
              this.showMessage(this.langService.dictionary.psw_error, 'error');
            } else {
              this.deleteGuest(id);
            }
          });
        } else {
          this.hideLoader();
        }
      });
    }
  }

  resetGuestPassword(user: any) {
    const data =
      {
        "email": user.email,
        "username": user.id
      }
    this._services.resetGuestUser(data).subscribe((result: any) => {
      if(result.Performed == true){
        this.showMessage(this.langService.dictionary.guest_reset_successfully, 'success');
      } else {
        this.showMessage(this.langService.dictionary.update_failure, 'error');
      }
    })
  }

  /** SEARCH GUEST
   * Search guest on keyup
   * Check if new search value is different from old one then update it
   * Update list and paginator
   **/
  searchGuest(){
    if(this.guestList.length>0){
      if(this.oldSearch != this.searchname){
        this.oldSearch = this.searchname;
        let arraySearch = (this.searchname.length>0)? this.guestList.filter(x => x.name.toLowerCase().includes(this.searchname) || x.surname.toLowerCase().includes(this.searchname)) : this.guestList;
        this.dataSource = new MatTableDataSource(arraySearch);
        this.dataLength = arraySearch.length;
        this.searchEmpty = (arraySearch.length>0)? false : true;
        this.bodyEmpty = false;
        this.dataSource.paginator = this.paginator;
      }
    }    
  }

  /** RESET SEARCH
   * Close icon bind
   * Reset all the values before search
   **/
  resetSearch(){
    if(this.guestList.length>0){
      this.searchEmpty = false;
      this.searchname = '', this.oldSearch = '';    
      this.dataSource = new MatTableDataSource(this.guestList);
      this.dataLength = this.guestList.length;    
      this.bodyEmpty = false;
      this.dataSource.paginator = this.paginator;
    }    
  }

}
