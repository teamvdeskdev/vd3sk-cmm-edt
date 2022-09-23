import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../../../../components/edit-user-dialog/edit-user-dialog.component';
import { LanguageService } from 'src/app/settings/services/language.service';
import { AdminSettingsService } from 'src/app/settings/services/admin-settings.service';
import { FilterUserDialogComponent } from 'src/app/settings/components/filter-user-dialog/filter-user-dialog.component';
import { Utilities, settingsSamlUser } from 'src/app/file-sharing/utilities';
import { ConfirmDialogComponent, ConfirmDialogDataModel } from 'src/app/app-components/dialogs/confirm-dialog/confirm-dialog.component';
import { globals } from 'src/config/globals';
import { AppConfig } from 'src/app/app-config';

@Component({
  selector: 'app-samluser-table',
  templateUrl: './samluser-table.component.html',
  styleUrls: ['./samluser-table.component.scss']
})
export class SamluserTableComponent implements OnInit {
  static dataSourceStatic;
  quotaList: any = [];
  roleList: any = [];
  isdata = true;
  noUser = false;
  isUserManager: boolean;
  dataLength: number = 0;
  offset = 0;
  notscrolly = true;
  util = new Utilities();
  badgeCounter: number;
  globalsVar: AppConfig;
  @Input() data: any;
  @Input() tab: string;
  @Input() pageUser: any;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() enabledisable: EventEmitter<any> = new EventEmitter();
  @Output() updateall: EventEmitter<any> = new EventEmitter();
  @ViewChild('username') username: ElementRef<HTMLInputElement>;
  @ViewChild('password') password: ElementRef<HTMLInputElement>;
  @ViewChild('email') email: ElementRef<HTMLInputElement>;
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(
    private adminService: AdminSettingsService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public langService: LanguageService,
  ) { 
    this.globalsVar = globals;
  }

  dataSource: MatTableDataSource<settingsSamlUser>;
  displayedColumns: string[] = ['id', 'image', 'username', 'password', 'email', 'role', 'groups', 'modules', 'quota', 'others'];

  dialogSize = {
    width: '388px', // '36%', //'25%',
    height: '40%'
  };

  ngOnInit() {
    this.dataSource = SamluserTableComponent.dataSourceStatic = new MatTableDataSource<settingsSamlUser>();
    this.dataSource.data = this.data;
    this.dataLength = this.dataSource.data.length;
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
    this.badgeCounter = 0;
    const userManager = sessionStorage.getItem('userManager');
    if (userManager !== undefined && userManager === 'true') {
      this.isUserManager = true;
    } else {
      this.isUserManager = false;
    }
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

  /** USER MANAGER
   * Disable user manager
   * @param username (string) username
   */
   DisableuserManager(element) {
    const data = {
      "userId" : element.id,
      "isUserManager" : false
    };
    element.userManager = false;
    this.adminService.EnableUserManager(data).subscribe((result: any) => {
      this._snackBar.open(this.langService.dictionary.user_manager_disabled, '', {
        duration: 4000,
        panelClass: 'toast-success'
      });
    });
  }

  /** USER MANAGER
   * Activate user manager
   * @param username (string) username
   */
  EnableuserManager(element) {
    const data = {
      "userId" :  element.id,
      "isUserManager" : true
    };
    element.userManager = true;
    this.adminService.EnableUserManager(data).subscribe((result: any) => {
      this._snackBar.open(this.langService.dictionary.user_manager_enabled , '', {
        duration: 4000,
        panelClass: 'toast-success'
      });
    });
  }
  
  openConfirmDialog() {
    const dialogModel: ConfirmDialogDataModel = {
      title: this.langService.dictionary.deleteUserDialogTitle,
      content: this.langService.dictionary.deleteUserDialogContent,
      textCancelBtn: this.langService.dictionary.undo,
      textConfirmBtn: this.langService.dictionary.confirm
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogModel,
    });
    return dialogRef;
  }

  /** USER DELETE
   * Remove user from list
   * @param id (string) userid
   */
  userDelete(id: string) {
    this.showLoader();
    const dialogRef = this.openConfirmDialog();
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Confirm') {
        for (let i in this.data) {
          if (this.data[i].id == id) {
            const senddata = {
              id,
              index: i,
            };
            this.delete.emit(senddata);
            break;
          }
        }
      }
      this.closeLoader();
    })
  }

  /** ENABLE DISABLE USER
   * Send id to enable/disable user depending on the page
   * @param id (string) userid
   */
  enabledisableUser(id: string) {
    this.enabledisable.emit(id);
  }

  /** FILTER
   * Filter user list
   */
  filterUserList() {
    const userList = this.dataSource.data;
    const dialogRef = this.dialog.open(FilterUserDialogComponent, {
      width: '780px',
      data: { userList },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'newuserFilter');
    });
  }

  updateUser(element: any){
    this.updateall.emit(element)
  }

  /** USER UPDATE USER
   * Used for create and update
   * @param element (any -> obj)
   * @param value (string) value selected
   * @param element (string) type of value
   */
  async userUpdateUser(element: any, value: string, type: string) {
    if (type === 'role') {
      if (value === 'FGM') {
        this.EnableFolderManager(element);
        if (element.userManager === true) {
          this.DisableuserManager(element);
        }
        if (!element.groups.includes('admin')) {
          element.groups.push('admin');
          this.userLineUpdate(element, value);
        }
      } else if (value === 'Admin') {
        if (!this.isUserManager) {
          element.groups.push('admin');
          this.userLineUpdate(element, value);
          if (element.userManager === true) {
            this.DisableuserManager(element);
          }
          if (element.folderManager === true) {
            this.DisableFolderManager(element);
          }
        } else {
          this._snackBar.open(this.langService.dictionary.error_admin, '', {
            duration: 4000,
            panelClass: 'toast-error'
          });
          return;
        }
      } else if (value === 'GGU') {
        this.EnableuserManager(element);
        if (element.folderManager === true) {
          this.DisableFolderManager(element);
        }
        if (!element.groups.includes('admin')) {
          element.groups.push('admin');
          this.userLineUpdate(element, value);
        }
      } else if (value === 'User') {
        if (element.userManager === true) {
          this.DisableuserManager(element);
        }
        if (element.folderManager === true) {
          this.DisableFolderManager(element);
        }
        if (element.groups.includes('admin')) {
          const index = element.groups.findIndex(e=>e== 'admin');
          element.groups.splice(index,1);
          this.userLineUpdate(element, value);
        }
      }
      element.role = value;
    } 
  }

  async userLineUpdate(element: any, value){
    const user = {    
      nome: element.userinfo.nome,
      cognome: element.userinfo.cognome,
      email: element.email,
      matricola: element.userinfo.matricola,
      dataInserimento: element.userinfo.dataInserimento,
      dataCessazione: element.userinfo.dataCessazione,    
      uidResponsabile: element.userinfo.uidResponsabile,
      nominativoResponsabile: element.userinfo.nomeResponsabile + ' ' + element.userinfo.cognomeResponsabile,
      emailResponsabile: element.userinfo.emailResponsabile,
      quota : element.quota,
      profilo: value,
      gruppi : element.groups
    };

    let addGroup = await this.adminService.samluserCreateUpdate(user).toPromise();
    if(!addGroup.Performed){
      this._snackBar.open(this.langService.dictionary.error_update_user, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }
  }

   /** FOLDER MANAGER
   * Disable user manager
   * @param username (string) username
   */
    DisableFolderManager(element) {
      const data = {
        'userId' : element.id,
        'isFolderManager' : false
      };
      element.userManager = false;
      this.adminService.EnableFolderManager(data).subscribe((result: any) => {
        this._snackBar.open(this.langService.dictionary.folder_manager_disabled, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      });
    }
  
    /** FOLDER MANAGER
     * Activate user manager
     * @param username (string) username
     */
     EnableFolderManager(element) {
      const data = {
        'userId' :  element.id,
        'isFolderManager' : true
      };
      element.userManager = true;
      this.adminService.EnableFolderManager(data).subscribe((result: any) => {
        this._snackBar.open(this.langService.dictionary.folder_manager_enabled , '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      });
    }

  ngOnChanges(changes: SimpleChanges) {
    const data = changes.data;
    if ((data && data.previousValue) && JSON.stringify(data.currentValue) != JSON.stringify(data.previousValue)) {
      this.dataSource.data = data.currentValue;
    }
  }
}
