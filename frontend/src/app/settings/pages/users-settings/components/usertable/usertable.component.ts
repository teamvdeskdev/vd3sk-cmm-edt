import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { settingsUser } from 'src/app/file-sharing/utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../../../../components/edit-user-dialog/edit-user-dialog.component';
import { LanguageService } from 'src/app/settings/services/language.service';
import { AdminSettingsService } from 'src/app/settings/services/admin-settings.service';
import { FilterUserDialogComponent } from 'src/app/settings/components/filter-user-dialog/filter-user-dialog.component';
import { Utilities } from 'src/app/file-sharing/utilities';
import { ConfirmDialogComponent, ConfirmDialogDataModel } from 'src/app/app-components/dialogs/confirm-dialog/confirm-dialog.component';import { globals } from 'src/config/globals';
import { AppConfig } from 'src/app/app-config';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.scss']
})
export class UsertableComponent implements OnInit {
  globalsVar: AppConfig;
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
  @Input() data: any;
  @Input() groups: any;
  @Input() pageUser: any;
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() devices: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() group: EventEmitter<any> = new EventEmitter();
  @Output() resend: EventEmitter<any> = new EventEmitter();
  @Output() enabledisable: EventEmitter<any> = new EventEmitter();
  @Output() newgroup: EventEmitter<any> = new EventEmitter();
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

  dataSource: MatTableDataSource<settingsUser>;
  displayedColumns: string[] = ['id', 'image', 'username', 'password', 'email', 'role', 'groups', 'modules', 'quota', 'others'];

  dialogSize = {
    width: '388px', // '36%', //'25%',
    height: '40%'
  };

  ngOnInit() {
    this.dataSource = UsertableComponent.dataSourceStatic = new MatTableDataSource<settingsUser>();
    this.dataSource.data = this.data;
    this.dataLength = this.dataSource.data.length;
    const userManager = sessionStorage.getItem('userManager');
    if (userManager !== undefined && userManager === 'true') {
      this.isUserManager = true;
    } else {
      this.isUserManager = false;
    }
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

  toastMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-' + type
    });
  }

  /** USER MANAGER
   * Disable user manager
   * @param username (string) username
   */
   DisableuserManager(element) {
    const data = {
      'userId' : element.id,
      'isUserManager' : false
    };
    element.userManager = false;
    this.adminService.EnableUserManager(data).subscribe((result: any) => {
      this.toastMessage(this.langService.dictionary.user_manager_disabled, 'success');
    });
  }

  /** USER MANAGER
   * Activate user manager
   * @param username (string) username
   */
  EnableuserManager(element) {
    const data = {
      'userId' :  element.id,
      'isUserManager' : true
    };
    element.userManager = true;
    this.adminService.EnableUserManager(data).subscribe((result: any) => {
      this.toastMessage(this.langService.dictionary.user_manager_enabled, 'success');
    });
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
      this.toastMessage(this.langService.dictionary.folder_manager_disabled, 'success');
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
      this.toastMessage(this.langService.dictionary.folder_manager_enabled, 'success');
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

 

  /** USER REMOVE DEVICES
   * Remove devices from user
   * @param id (string) userid
   */
  userRemoveDevices(id: string) {
    this.showLoader();
    for (let i in this.data) {
      if (this.data[i].id == id) {
        this.devices.emit(id);
        break;
      }
    }
  }

  /** USER UPDATE USER
   * Used for create and update
   * @param element (any -> obj)
   * @param value (string) value selected
   * @param element (string) type of value
   */
  userUpdateUser(element: any, value: string, type: string) {
    if (type == 'quota' && element.quota != element.quotaValue) {
      let objSend;
      objSend = {
        id: element.id,
        value: (value == this.langService.dictionary.nolimits) ? 'none' : value,
        key: type,
      };
      this.update.emit(objSend);
    } else if (type === 'role') {
      if (value === 'FGM') {
        this.EnableFolderManager(element);
        if (element.userManager === true) {
          this.DisableuserManager(element);
        }
        if (!element.groups.includes('admin')) {
          const addGroup = 'admin';
          this.addGroup (element, addGroup);
          element.groups.push('admin');
        }
      } else if (value === 'Admin') {
        if (!this.isUserManager) {
          const addGroup = 'admin';
          this.addGroup (element, addGroup);
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
          const addGroup = 'admin';
          this.addGroup (element, addGroup);
          element.groups.push('admin');
        }
      } else if (value === 'User') {
        if (element.userManager === true) {
          this.DisableuserManager(element);
        }
        if (element.folderManager === true) {
          this.DisableFolderManager(element);
        }
        if (element.groups.includes('admin')) {
          const RemoveGroup = 'admin';
          this.RemoveGroup(element, RemoveGroup);
        }
      }
      element.role = value;
    } else {
      this.dialog.open(EditUserDialogComponent, {
        width: this.dialogSize.width,
        // height: this.dialogSize.height,
        data: { element, type }

      }).afterClosed().subscribe(result => {
        if (result != '' && result != undefined && type != 'newpassword' && type != 'newusername') {
          const newValue = result;
          this.showLoader();
          let objSend;

          objSend = {
            id: element.id,
            value: newValue,
            key: type,
          };
          this.update.emit(objSend);
        }
        if (result != '' && result != undefined && type == 'newpassword') {
          element.password = result;
        }
        if (result != '' && result != undefined && type == 'newusername') {
          element.username = result;
        }
        this.closeLoader();
      });
    }
  }

  /** ADD REMOVE GROUP
   * Add/remove group from user
   * @param group (string) added/removed group name
   * @param element (any -> obj)
   */
  addRemoveGroup(group: string, element: any) {
    if (element.id) {
      this.showLoader();
      let data;
      if (element.groups.includes(group)) {
         data = 'add';
      } else {
        'remove';
      }
      const objSend = {
        value: group,
        id: element.id,
        type: data,
      };
      this.group.emit(objSend);
    }
  }

  addGroup(element: any, group: string) {
    if (element.id) {
      this.showLoader();
      const objSend = {
        value: group,
        id: element.id,
        type: 'add',
      };
      this.group.emit(objSend);
    }
  }

  RemoveGroup(element: any, group: string) {
    if (element.id) {
      this.showLoader();
      const objSend = {
        value: group,
        id: element.id,
        type: 'remove',
      };
      this.group.emit(objSend);
    }
  }

  /** USER ADD USER
   * Create new user
   * @param element (any -> obj)
   */
  userAddUser(element: any) {
    this.showLoader();
    if (element.username && element.email && element.password.length >= 12) {
      const objSend = {
        userid: element.username,
        email: element.email,
        groups: element.groups,
        language: 'it',
        password: element.password,
        quota: (element.quota == this.langService.dictionary.nolimits) ? 'none' : element.quota,
        subadmin: [],
        displayName: element.accountname
      };
      this.create.emit(objSend);
    } else if (element.password.length <= 11) {
      this.closeLoader();
      this.toastMessage(this.langService.dictionary.password_short_12, 'error');
    } else {
      this.closeLoader();
      this.toastMessage(this.langService.dictionary.error_nodata, 'error');
    }
  }

  /** ENABLE DISABLE USER
   * Send id to enable/disable user depending on the page
   * @param id (string) userid
   */
  enabledisableUser(id: string) {
    this.enabledisable.emit(id);
  }

  /** RESEND MAIL
   * Resend welcome mail
   * @param id (string) userid
   */
  resendMail(id: string) {
    this.showLoader();
    this.resend.emit(id);
  }

  /** ADD NEW GROUP
   * Create new group
   */
  addNewGroup() {
    this.showLoader();
    this.newgroup.emit('');
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
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const data = changes.data;
    if ((data && data.previousValue) && JSON.stringify(data.currentValue) != JSON.stringify(data.previousValue)) {
      this.dataSource.data = data.currentValue;
    }
  }
}
