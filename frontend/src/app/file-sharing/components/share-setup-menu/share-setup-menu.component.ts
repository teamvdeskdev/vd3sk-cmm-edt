import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ShareService } from '../../services/share.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/file-sharing/format-datepicker';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { formatDate } from '@angular/common';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-share-setup-menu',
  templateUrl: './share-setup-menu.component.html',
  styleUrls: ['./share-setup-menu.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ShareSetupMenuComponent implements OnInit, OnChanges {
  edit = false;
  reshare = false;
  create = false;
  change = false;
  delete = false;
  read = false;
  expiration = false;
  expirationForm: FormGroup;
  hideDownload = false;
  linkPermissions = false;
  pwdCheck = false;
  passwordForm: FormGroup;
  nameCheck = false;
  nameForm: FormGroup;
  @Input() selectedShare: any;
  @Input() folderZero: boolean;
  @Input() isOwner: boolean;
  @Input() isTim: boolean;
  @Input() expirationProject: any;
  @Output() dateChange: EventEmitter<MatDatepickerInputEvent<any>>;
  @Output() reshares = new EventEmitter<any>();
  dict = new Dictionary();
  checkLength: boolean = false;
  checkLenghtName: boolean = false;
  menuEdit: boolean;
  minDate: Date;
  maxDate: any;

  updateCheckDisable: boolean = false;
  downloadCheckDisable: boolean = false;
  passwordCheckDisable: boolean = false;
  nameCheckDisable: boolean = false;
  dateCheckDisable: boolean = false;
  isShareOwner = false;
  user = sessionStorage.getItem('user');

  // DICTIONARY VARIABLES ---
  dictEdit: string = this.dict.getDictionary('edit_label');
  dictReshare: string = this.dict.getDictionary('reshare_label');
  dictCreate: string = this.dict.getDictionary('create_label');
  dictChange: string = this.dict.getDictionary('change_label');
  dictDelete: string = this.dict.getDictionary('delete_label');
  dictReadOnly: string = this.dict.getDictionary('read_only_label');
  dictExpiration: string = this.dict.getDictionary('set_expiration');
  dictExpirationDate: string = this.dict.getDictionary('expiration_date');
  dictDeleteShare: string = this.dict.getDictionary('delete_share_bt');
  dictAllowEdit: string = this.dict.getDictionary('allow_edit_label');
  dictPreventDownload: string = this.dict.getDictionary('prevent_download_label');
  dictSetPassword: string = this.dict.getDictionary('set_password_label');
  dictDeleteLink: string = this.dict.getDictionary('delete_link_bt');
  dictSetName: string = this.dict.getDictionary('set_name_label');
  pswErrorShort: string = this.dict.getDictionary('psw_error_short');
  pswErrorCommon: string = this.dict.getDictionary('psw_error_common');
  systemError: string = this.dict.getDictionary('error_system');
  shareDelete: string = this.dict.getDictionary('share_deleted');
  pswOk: string = this.dict.getDictionary('psw_done');
  nameUpdated: string = this.dict.getDictionary('name_updated')
  sharePermission: any;
  expirationdate: any;
  //

  constructor(
    private shareService: ShareService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    ) {

    // Init the expirationForm
    this.expirationForm = new FormGroup({
      date: new FormControl('')
    });
    // Init the passwordForm
    this.passwordForm = new FormGroup({
      password: new FormControl('')
    });
    // Init the nameForm
    this.nameForm = new FormGroup({
      name: new FormControl('')
    });
   }

   get date() { return this.expirationForm.get('date'); }
   get password() { return this.passwordForm.get('password'); }
   get name() { return this.nameForm.get('name'); }

  ngOnInit() {
    let date = new Date();
    this.minDate = new Date((date.setDate(date.getDate() + 1)));
    this.maxDate = (this.expirationProject)? new Date(this.expirationProject) : '';
    if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
    this.loadPermission();

    if (!this.isTim) {
      this.menuEdit = true;
    } else {
      this.menuEdit = (this.folderZero && this.isOwner) ? true : false;
      this.isShareOwner = (this.selectedShare.sub_owner !== undefined && this.selectedShare.sub_owner) ? (this.selectedShare.sub_owner === this.user) : false;
    }

    // Set the expiration date to show, if exist
    if (this.selectedShare.expiration !== undefined && this.selectedShare.expiration !== null) {
      const expDate = new Date(this.selectedShare.expiration);
      this.expirationForm.setValue({date: expDate});
      this.expiration = true;
    }

    // If it's a link share, set the existing options
    if (this.selectedShare.share_type === 3) {
      // Set hideDownload
      this.hideDownload = (this.selectedShare.hide_download === 1) ? true : false;

      // Set linkPermissions
      this.linkPermissions = (this.selectedShare.permissions > 1) ? true : false;

      // Set password
      if (this.selectedShare.password !== undefined && this.selectedShare.password !== null) {
        this.passwordForm.setValue({password: this.selectedShare.password});
        this.pwdCheck = true;
      } else {
        this.pwdCheck = false;
      }

      // Set name using note field
      if (this.selectedShare.note !== undefined && this.selectedShare.note !== null && this.selectedShare.note !== '') {
        this.nameForm.setValue({name: this.selectedShare.note});
        this.nameCheck = true;
      } else {
        this.nameCheck = false;
      }

    }
  }


  async loadPermission(){
      const data = {
        nodeId: this.selectedShare.file_source,
        userId: this.selectedShare.share_with,
      };
      if(this.isTim){
        let userPermissionFather = await this.shareService.getUserPermission(data).toPromise();
        if (userPermissionFather.Performed){
          if(userPermissionFather.Expiration != null) {
            const date = new Date (userPermissionFather.Expiration.date);
            this.expirationdate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
            this.expiration = true;
          }
          this.sharePermission = userPermissionFather.Permissions;
        } else {
          this._snackBar.open(this.dict.getDictionary('error_system'), '', {
            duration: 4000,
            panelClass: ('toast-error')
          });
          return;
        }
      } else {
        this.sharePermission = this.selectedShare.permissions;
      }
      // If it's a nominal share, set permissions to show
      if (this.selectedShare.share_type === 0) {
        if (this.selectedShare.item_type === 'folder') {
          switch (this.sharePermission) {
            case 31: // FOLDER ALL
                this.edit = true;
                this.reshare = true;
                this.create = true;
                this.change = true;
                this.delete = true;
                break;
            case 15: // edit + create + change + delete
                this.edit = true;
                this.create = true;
                this.change = true;
                this.delete = true;
                break;
            case 29: // reshare + create + delete
                this.reshare = true;
                this.create = true;
                this.delete = true;
                break;
            case 27: // reshare + change + delete
                this.reshare = true;
                this.change = true;
                this.delete = true;
                break;
            case 23: // reshare + change + create
                this.reshare = true;
                this.change = true;
                this.create = true;
                break;
            case 25: // reshare + delete
                this.reshare = true;
                this.delete = true;
                break;
            case 21: // reshare + create
                this.reshare = true;
                this.create = true;
                break;
            case 19: // reshare + change
                this.reshare = true;
                this.change = true;
                break;
            case 13: // delete + create
                this.delete = true;
                this.create = true;
                break;
            case 11: // change + delete
                this.change = true;
                this.delete = true;
                break;
            case 7: // change + create
                this.change = true;
                this.create = true;
                break;
            case 17: // reshare
                this.reshare = true;
                break;
            case 9: // delete
                this.delete = true;
                break;
            case 5: // create
                this.create = true;
                break;
            case 3: // change
                this.change = true;
                break;
            case 1: // read only
                this.read = true;
                break;
          }
        }

        if (this.selectedShare.item_type === 'file') {
          switch (this.sharePermission) {
            case 19: // FILE ALL
                this.edit = true;
                this.reshare = true;
                break;
            case 17: // reshare
                this.reshare = true;
                break;
            case 3: // edit
                this.edit = true;
                break;
            case 31: //TIM reshare (all)
                this.reshare = true;
                this.edit = true;
                break;
            case 15: //TIM edit + create + change + delete
                this.edit = true;
                break;
            case 29: //TIM reshare + create + delete
                this.edit = true;
                this.reshare = true;
                break;
            case 27: //TIM reshare + change + delete
                this.edit = true;
                this.reshare = true;
                break;
            case 23: //TIM reshare + change + create
                this.edit = true;
                this.reshare = true;
                break;
            case 25: //TIM reshare + delete
                this.edit = true;
                this.reshare = true;
                break;
            case 21: //TIM reshare + create
                this.edit = true;
                this.reshare = true;
                break;
            case 13: //TIM delete + create
                this.edit = true;
                break;
            case 11: //TIM change + delete
                this.edit = true;
                break;
            case 7: //TIM change + create
                this.edit = true;
                break;
            case 9: //TIM delete
                this.edit = true;
                break;
            case 5: //TIM create
                this.edit = true;
                break;
            case 1: //TIM read only
                this.read = true;
                break;
          }
        }
      }
    }

  /**
   * Detect the parent @Input value changes
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes[propName]) {
        const chng = changes[propName];
        const cur  = JSON.stringify(chng.currentValue);
        const prev = JSON.stringify(chng.previousValue);
      }
    }
  }

  /**
   * Update the permissions value on the checked value changing
   * @param permissionType
   * @param permissionValue
   */
  updatePermissions(permissionType: any, permissionValue: any) {
    const PERMISSION_READ = 1;
    let newPermissionsValue = 0;
    if(this.isTim) {
      if (permissionValue.checked === true) { // ADD PERMISSON
        if (this.selectedShare.item_type === 'folder') {
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = (this.selectedShare.permissions >= 17) ? 31 : 15;
              break;
            case 'reshare':
              newPermissionsValue = 31;
              break;
            case 'create':
              newPermissionsValue = this.selectedShare.permissions + 5 - PERMISSION_READ;
              break;
            case 'change':
              newPermissionsValue = this.selectedShare.permissions + 3 - PERMISSION_READ;
              break;
            case 'delete':
              newPermissionsValue = this.selectedShare.permissions + 9 - PERMISSION_READ;
              break;
          }
        } else { // FILE
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = this.selectedShare.permissions + 3 - PERMISSION_READ;
              break;
            case 'reshare':
              newPermissionsValue = 19;
              break;
          }
        }

      } else { // REMOVE PERMISSION
        if (this.selectedShare.item_type === 'folder') {
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = 1;
              break;
            case 'reshare':
              newPermissionsValue = this.selectedShare.permissions - 17 + PERMISSION_READ;
              break;
            case 'create':
              newPermissionsValue = (this.selectedShare.permissions > 17) ? this.selectedShare.permissions -  17 + PERMISSION_READ - 5  + PERMISSION_READ : this.selectedShare.permissions - 5 + PERMISSION_READ;
              break;
            case 'change':
              newPermissionsValue = (this.selectedShare.permissions > 17) ? this.selectedShare.permissions -  17 + PERMISSION_READ - 3 + PERMISSION_READ : this.selectedShare.permissions - 3 + PERMISSION_READ;
              break;
            case 'delete':
              newPermissionsValue = (this.selectedShare.permissions > 17) ? this.selectedShare.permissions - 17 + PERMISSION_READ - 9 + PERMISSION_READ : this.selectedShare.permissions - 9 + PERMISSION_READ;
              break;
          }
        } else { // FILE
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = 1;
              break;
            case 'reshare':
              newPermissionsValue = this.selectedShare.permissions - 17 + PERMISSION_READ;
              break;
          }
        }
      }
    } else {
      if (permissionValue.checked === true) { // ADD PERMISSON
        if (this.selectedShare.item_type === 'folder') {
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = (this.selectedShare.permissions >= 17) ? 31 : 15;
              break;
            case 'reshare':
              newPermissionsValue = this.selectedShare.permissions + 17 - PERMISSION_READ;
              break;
            case 'create':
              newPermissionsValue = this.selectedShare.permissions + 5 - PERMISSION_READ;
              break;
            case 'change':
              newPermissionsValue = this.selectedShare.permissions + 3 - PERMISSION_READ;
              break;
            case 'delete':
              newPermissionsValue = this.selectedShare.permissions + 9 - PERMISSION_READ;
              break;
          }
        } else { // FILE
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = this.selectedShare.permissions + 3 - PERMISSION_READ;
              break;
            case 'reshare':
              newPermissionsValue = this.selectedShare.permissions + 17 - PERMISSION_READ;
              break;
          }
        }

      } else { // REMOVE PERMISSION
        if (this.selectedShare.item_type === 'folder') {
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = (this.selectedShare.permissions >= 17) ? 17 : 0;
              break;
            case 'reshare':
              newPermissionsValue = this.selectedShare.permissions - 17 + PERMISSION_READ;
              break;
            case 'create':
              newPermissionsValue = this.selectedShare.permissions - 5 + PERMISSION_READ;
              break;
            case 'change':
              newPermissionsValue = this.selectedShare.permissions - 3 + PERMISSION_READ;
              break;
            case 'delete':
              newPermissionsValue = this.selectedShare.permissions - 9 + PERMISSION_READ;
              break;
          }
        } else { // FILE
          switch (permissionType) {
            case 'edit':
              newPermissionsValue = this.selectedShare.permissions - 3 + PERMISSION_READ;
              break;
            case 'reshare':
              newPermissionsValue = this.selectedShare.permissions - 17 + PERMISSION_READ;
              break;
          }
        }
      }
    }
    const data: any = {
      permissions: newPermissionsValue
    };
    this.shareService.updateShare(this.selectedShare.id, data).subscribe( result => {
      // Trigger the reshares event to the parent component
      this.reshares.emit(this.selectedShare.id);
    });

  }

  onCheckSetExpiration(value: any) {
    if (value.checked === false) {
      const data: any = {
        expireDate: ''
      };
      this.shareService.updateShare(this.selectedShare.id, data).subscribe( result => {
        // Trigger the reshares event to the parent component
        this.reshares.emit(this.selectedShare.id);
      });
    }
  }

  /**
   * Update the expiration date on the date changing
   * @param dateValue
   * @param id
   */
  updateExpiration(dateValue: any, id: any) {
    this.updateCheckDisable = true;
    this.passwordCheckDisable = true;
    this.nameCheckDisable = true;
    this.downloadCheckDisable = true;
    const form: any = {
      expireDate: dateValue
    };

    if(this.isTim){
      let tryDate = dateValue.split("-");
      var newDate = new Date( tryDate[2], tryDate[1] - 1, tryDate[0]).getTime();
      let nowDate = new Date().getTime();
      if(newDate > nowDate) this.selectedShare.flagExp = false;
      else this.selectedShare.flagExp = true;
    }
    

    this.shareService.updateShare(id, form).subscribe( result => {
      let date = dateValue.split("-");
      this.updateCheckDisable = false;
      this.passwordCheckDisable = false;
      this.nameCheckDisable = false;
      this.downloadCheckDisable = false;
      this.selectedShare.expiration = date[2] + '-' + date[1] + '-' + date[0] + ' 00:00:00';
      let expDate = new Date(this.selectedShare.expiration);
      this.expirationForm.setValue({date: expDate});
      // Trigger the reshares event to the parent component
      this.reshares.emit(this.selectedShare.id);
    });
  }

  updateHideDownload(value: any) {
    this.updateCheckDisable = true;
    this.passwordCheckDisable = true;
    this.nameCheckDisable = true;
    if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
    else this.dateCheckDisable = true;
    let data: any = {};
    if (value.checked === true) {
      data = { hideDownload: 'true' };
    } else {
      data = { hideDownload: 'false' };
    }

    this.shareService.updateShare(this.selectedShare.id, data).subscribe( result => {
      // Trigger the reshares event to the parent component
      this.updateCheckDisable = false;
      this.passwordCheckDisable = false;
      this.nameCheckDisable = false;
      if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
      else this.dateCheckDisable = false;
      this.reshares.emit(this.selectedShare.id);
    });
  }

  updateLinkPermissions(value: any) {
    this.downloadCheckDisable = true;
    this.passwordCheckDisable = true;
    this.nameCheckDisable = true;
    if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
    else this.dateCheckDisable = true;
    let data: any = {};
    if (value.checked === true) {
      if(this.selectedShare.item_type == 'folder')
        data = { permissions: 15 };
      else data = { permissions: 3 };
    } else {
      data = { permissions: 1 };
    }

    this.shareService.updateShare(this.selectedShare.id, data).subscribe( result => {
      this.downloadCheckDisable = false;
      this.passwordCheckDisable = false;
      this.nameCheckDisable = false;
      if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
      else this.dateCheckDisable = false;
      // Trigger the reshares event to the parent component
      this.reshares.emit(this.selectedShare.id);
    });
  }

  onCheckSetPassword(value: any) {
    const pwd = this.passwordForm.get('password').value;
    if (value.checked === false && pwd !== '') {
      const data: any = {
        password: ''
      };
      this.shareService.updateShare(this.selectedShare.id, data).subscribe( result => {
        // Trigger the reshares event to the parent component
        this.reshares.emit(this.selectedShare.id);
      });
    }
  }

  updatePassword(pwdValue: any, id: any) {
    this.downloadCheckDisable = true;
    this.updateCheckDisable = true;
    this.nameCheckDisable = true;
    if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
    else this.dateCheckDisable = true;
    if(pwdValue.length >= 8){
      const form: any = {
        password: pwdValue
      };
      this.shareService.updateShare(id, form).subscribe( result => {
        if(result.status==400){
          this._snackBar.open(this.pswErrorCommon, '', {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }else{
          this._snackBar.open(this.pswOk, '', {
            duration: 4000,
            panelClass: 'toast-success'
          });
          this.downloadCheckDisable = false;
          this.updateCheckDisable = false;
          this.nameCheckDisable = false;
          if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
          else this.dateCheckDisable = false;
          // Trigger the reshares event to the parent component
          this.reshares.emit(this.selectedShare.id);
        }        
      });
    }else{
      this._snackBar.open(this.pswErrorShort, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }    
  }

  onCheckSetName(value: any) {
    const pwd = this.nameForm.get('name').value;
    if (value.checked === false && pwd !== '') {
      const data: any = {
        note: ''
      };
      this.shareService.updateShare(this.selectedShare.id, data).subscribe( result => {
        // Trigger the reshares event to the parent component
        this.reshares.emit(this.selectedShare.id);
      });
    }
  }

  updateName(nameValue: any, id: any) {
    this.downloadCheckDisable = true;
    this.updateCheckDisable = true;
    this.passwordCheckDisable = true;
    if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
    else this.dateCheckDisable = true;
    const form: any = {
      note: nameValue
    };
    this.shareService.updateShare(id, form).subscribe( result => {
      this.downloadCheckDisable = false;
      this.updateCheckDisable = false;
      this.passwordCheckDisable = false;
      if(this.isTim) this.dateCheckDisable = (this.expirationProject)? true : false;
      else this.dateCheckDisable = false;
      // Trigger the reshares event to the parent component
      this.reshares.emit(this.selectedShare.id);
      this._snackBar.open(this.nameUpdated, '', {
        duration: 4000,
        panelClass: 'toast-success'
      });
    });
  }

  /**
   * Delete the share on the click of the delete button
   * @param id
   */
  deleteShare(id: any) {
    this.shareService.deleteShare(id).subscribe( result => {
      if(result.status == 200){
        // Trigger the reshares event to the parent component
        this.reshares.emit(this.selectedShare.id);
        this._snackBar.open(this.shareDelete, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      }else{
        this._snackBar.open(this.systemError, '', {
          duration: 4000,
          panelClass: 'toast-error'
        });
      }      
    });
  }

  /** CHECK PASSWORD LENGTH
   * Manage icon class for password
   * @param element (string) passowrd value
   **/
  checkPasswordLength(element:string){
    if(element.length>=8 && !this.checkLength){
      this.checkLength = true;
    }else if(element.length<=8 && this.checkLength){
      this.checkLength = false;
    }
    
  }

  checkNameLength(element:string){
    if(element.length>=1 && !this.checkLenghtName){
      this.checkLenghtName = true;
    }else if(element.length<=1 && this.checkLenghtName){
      this.checkLenghtName = false;
    }
  }

}
