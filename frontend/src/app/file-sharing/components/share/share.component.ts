import { Component, OnInit, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ShareService } from '../../services/share.service';
import { Dictionary } from '../../dictionary/dictionary';
import { Utilities } from '../../utilities';
import { NotificationsService } from 'src/app/app-services/notifications.service';
import { DeleteServiceAllfiles } from 'src/app/file-sharing/services/sidebar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globals } from 'src/config/globals';
import { AppConfig } from 'src/app/app-config';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { forEach, result } from 'lodash';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../format-datepicker';
import { exit } from 'process';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})
export class ShareComponent implements OnInit, OnChanges, AfterViewInit {

  /* Share Tab Variables */
  @Input() share: any = {};
  @Input() coded;
  @Input() page;
  util = new Utilities();
  shareData: any  = {};
  shareLinkData: any = {};
  searchTerm = new FormControl();
  myUsers = [];
  filteredUsers: any[] = [];
  users: any[];
  tabSelectedIndex = 0;
  resharesList: any[] = [];
  sharedList: any[] = [];
  filePath = '';
  fileId = '';
  type = '';
  dict = new Dictionary();
  loading = false;
  loadingLink = false;
  checkusericon: boolean;
  serviceCall: any;
  globalsVar: AppConfig;
  isTim: boolean = false;

  // DICTIONARY VARIABLES ---
  dictShareTagTitle: string = this.dict.getDictionary('share_tag_title');
  dictShareFrom: string = this.dict.getDictionary('share_from_td');
  dictSearchPlaceholder: string = this.dict.getDictionary('search_placeholder'); 
  dictReportSharing: string = this.dict.getDictionary('report_sharing');
  dictCreateLink: string = this.dict.getDictionary('create_link_label');
  dictNoSharing: string = this.dict.getDictionary('no_sharing_msg');
  dictSharedLink: string = this.dict.getDictionary('shared_link_td');
  dictCopyLink: string = this.dict.getDictionary('tt_copy_link');
  dictShare: string = this.dict.getDictionary('shareconfig');
  dictActions: string = this.dict.getDictionary('actions');
  dictOwner: string = this.dict.getDictionary('owner');
  dictNoSharePermission: string = this.dict.getDictionary('noshare_permission');
  noShareEver: string = this.dict.getDictionary('noShareEver');
  dictName: string = this.dict.getDictionary('shared_name');
  dictSurname: string = this.dict.getDictionary('shared_surname');
  dictUid: string = this.dict.getDictionary('shared_uid');
  dictEmail: string = this.dict.getDictionary('shared_email');
  dictDate: string = this.dict.getDictionary('shared_date');
  dictExpiration: string = this.dict.getDictionary('expiration_date');
  dictRemoved: string = this.dict.getDictionary('status');
  dictPermissions: string = this.dict.getDictionary('shared_permissions');
  dictEmptyReport: string = this.dict.getDictionary('empty_report');
  dictFileTitle: string = this.dict.getDictionary('file_title');
  dictMessagePermission: string = this.dict.getDictionary('permission_message');
  dictError_system: string = this.dict.getDictionary('error_system');
  no_father_sharing: string = this.dict.getDictionary('no_father_sharing');
  dictSetProjExpiration: string = this.dict.getDictionary('setProjExpiration');
  dictRemoveProjExpiration: string = this.dict.getDictionary('removeProjExpiration');
  //
  head = [[ this.dictName , this.dictSurname, this.dictUid, this.dictEmail, this.dictDate, this.dictExpiration, this.dictRemoved]];
  inProgress: boolean;
  isFolder: boolean = false;
  user = sessionStorage.getItem('user');
  OwnerFolderZero: boolean;
  FolderZero: boolean;
  isOwner: boolean;
  sharePermission: any;
  resharesFatherList: any;
  absoluteFatherList: any = [];
  fatherReshareList: any = [];
  projExpirationForm: FormGroup;
  minDate: Date;
  expirationDate: any;
  setProjExp: boolean = false;
  controlPage: boolean;

  constructor(
    private shareService: ShareService,
    private notificationService: NotificationsService,
    private _deleteservice: DeleteServiceAllfiles,
    private _snackBar: MatSnackBar,
  ) {
    this.globalsVar = globals;

    // Init the expirationForm
    this.projExpirationForm = new FormGroup({
      projExpDate: new FormControl('')
    });
  }

  get projExpDate() { return this.projExpirationForm.get('projExpDate'); }

  ngOnInit() {
    this.controlPage = (this.page.includes('share') || this.page=='protected' || this.page=='attachmentsvpec')? true : false;
    let date = new Date();
    this.minDate = new Date((date.setDate(date.getDate() + 1)));
    this.load();
    if(this.isTim){
      this.fatherSahringList(this.share.path);
    }
  }

  async load() {
    this.FolderZero = (this.share.path == "") ? true : false;
    this.isOwner = (this.share.owner == this.user) ? true : false;
    if (!this.share.extension) { this.isFolder = true; }
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    this.checkusericon = false;
    this.filePath = this.share.path + ((this.share.path.charAt(this.share.path.length-1) != '/')? '/' : '' ) + this.share.name + this.share.extension;
    this.fileId = this.share.id;
    this.type = this.share.type;
    this.shareService.getFile(this.fileId).subscribe(async result => {

      // reshares: get the list of users to whom I shared something
      let response1 = await this.shareService.reshares(this.filePath).toPromise();
      if(response1.status != 404){
        this.resharesList = response1.body.ocs.data;

        if(this.isTim){
          let nowDate = new Date().getTime();
          this.resharesList.forEach((element) => {
            if(element.expiration){
              let getDate = element.expiration.split(" ");
              let tryDate = getDate[0].split("-");
              var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
              if((expDate < nowDate) && element.uid_file_owner == sessionStorage.user) element.flagExp = true;
              else element.flagExp = false;
            }else element.flagExp = false;   
          });

          if(!this.FolderZero && this.resharesList.length>0){
            this.getAbsolute(this.share.path.split('/')[0]);
          }

          //Get project expiration date
          if(this.share.path) this.getExpirationDate('/' + this.share.path.split('/')[0]);
          else this.getExpirationDate(this.filePath);
        }        

        // Sort reshares list by share_type, value 3 (=link) precede value 0
        this.resharesList = this.resharesList.sort((a, b) => (a.share_type < b.share_type) ? 1 : ((b.share_type < a.share_type) ? -1 : 0));
        // Set profile_pic_url field for each element
        this.resharesList.forEach(element => {
          if (element.share_with) {
            element.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + element.share_with + `&size=20`;
          }
        });
        // Add to reshares list items the showSetupMenu flag
        this.addShowSetupMenuFlag(this.resharesList);
      }

      // file shared with me: get the list of users who shared something with me
      let response2 = await this.shareService.filesSharedWithMe(this.filePath).toPromise();
      if(response2.status != 404){
        this.sharedList = response2.body.ocs.data;
        // Set profile_pic_url field for each element
        this.sharedList.forEach(element => {
          if (element.uid_owner) {
            element.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + element.uid_owner + `&size=20`;
          }
        });

      // get resource file
      this.shareService.getResourceFile(this.fileId).subscribe( resp3 => {});
      }
    });

    // Search field handler
    this.searchTerm.valueChanges
      .pipe(startWith(''))
      .subscribe( term => {
        if(term && (term.length>0 || term.label.length>0)) this.checkusericon = true;
        else this.checkusericon = false;

        if (this.serviceCall) { this.serviceCall.unsubscribe(); }
          
        if (term.length >= 3) {
          this.serviceCall = this.shareService.searchUserForShareComponent(term, this.fileId).subscribe( response => {
            let usersListSearch =  response.body.ocs.data.users;
            let users: any[] = [];
            let usersFiltered: any[] = [];
            usersListSearch.forEach(element => {
              if(!element.uuid){
                usersFiltered.push(element);
              }
            }); 
            users = this.util.getResponseUserListShare(usersFiltered);
            let exactusers: any[] = [];
            exactusers = this.util.getResponseUserListShare(response.body.ocs.data.exact.users);
            if (this.isTim) { // Caso VDESK TIM
              const notSharedUsers = this.removeShared(users); 
              this.filteredUsers = notSharedUsers;

            } else { // Caso VDESK STANDARD
              if (exactusers.length > 0) {             
                this.filteredUsers = [...exactusers, ...users];             
              } else {
                this.filteredUsers = users;
              }
            }            
          });          
        } else {
          this.filteredUsers = [];
          if (this.serviceCall) { this.serviceCall.unsubscribe(); }
        }
      });
  }

  async onProjExpirationClick() {
    this.setProjExp = !this.setProjExp;
    if (!this.setProjExp && this.projExpirationForm.get('projExpDate').value) {
      this.projExpirationForm.setValue({projExpDate: ''}); // clear proj expiration on remove
      this.expirationDate = '';
      // Remove project expiration 
      const path = this.share.path + ((this.share.path.charAt(this.share.path.length-1) != '/')? '/' : '' ) + this.share.name + this.share.extension;
      const result = await this.shareService.closeProject(path, '').toPromise();
      if (result.status == 200) {
        // reshares
        const result2 = await this.shareService.reshares(path).toPromise();
        this.resharesList = result2.body.ocs.data;

        if(this.isTim){          
          let nowDate = new Date().getTime();
          this.resharesList.forEach((element) => {
            if(element.expiration){
              let getDate = element.expiration.split(" ");
              let tryDate = getDate[0].split("-");
              var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
              if((expDate < nowDate) && element.uid_file_owner == sessionStorage.user) element.flagExp = true;
              else element.flagExp = false;
            }else element.flagExp = false;
          });
        }
            
        // Sort reshares list by share_type, value 3 (=link) precede value 0
        this.resharesList = this.resharesList.sort((a, b) => (a.share_type < b.share_type) ? 1 : ((b.share_type < a.share_type) ? -1 : 0));
        // Set profile_pic_url field for each element
        this.resharesList.forEach(element => {
          if (element.share_with) {
            element.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + element.share_with + `&size=20`;
              
            this._deleteservice.toggle(element.file_source, 'share', '0', '');
          }
        });
        // Add to reshares list items the showSetupMenu flag
        this.addShowSetupMenuFlag(this.resharesList);
      }
    }
  }

  async setProjExpiration(dateValue) {
    let datechunk = dateValue.split('-');
    let yyyy = datechunk[2];
    let mm = datechunk[1];
    let dd = datechunk[0];
    let dateExp = new Date(yyyy, (mm-1), dd).getTime();
    let expiration = yyyy + '-' + mm + '-' + dd + ' 00:00:00';
    let path = this.share.path + ((this.share.path.charAt(this.share.path.length-1) != '/')? '/' : '' ) + this.share.name + this.share.extension;

    let result = await this.shareService.closeProject(path, expiration).toPromise();
    if (result.status == 200) {
      this.expirationDate = dateExp;
      let result2 = await this.shareService.reshares(path).toPromise();
      this.resharesList = result2.body.ocs.data;

      if(this.isTim){          
        let nowDate = new Date().getTime();
        this.resharesList.forEach((element) => {
          if(element.expiration){
            let getDate = element.expiration.split(" ");
            let tryDate = getDate[0].split("-");
            var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
            if((expDate < nowDate) && element.uid_file_owner == sessionStorage.user) element.flagExp = true;
            else element.flagExp = false;
            if(expDate > dateExp) element.expiration = expiration;
          }else element.flagExp = false;
        });
      }
          
      // Sort reshares list by share_type, value 3 (=link) precede value 0
      this.resharesList = this.resharesList.sort((a, b) => (a.share_type < b.share_type) ? 1 : ((b.share_type < a.share_type) ? -1 : 0));
      // Set profile_pic_url field for each element
      this.resharesList.forEach(element => {
        if (element.share_with) {
          element.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + element.share_with + `&size=20`;
            
          this._deleteservice.toggle(element.file_source, 'share', '0', '');
        }
      });
      // Add to reshares list items the showSetupMenu flag
      this.addShowSetupMenuFlag(this.resharesList);
    }
  }

  removeShared(users: any[]): any[] {
    const result = users.filter( userItem => {
      let thereIs = false;
      for (let i = 0, len = this.resharesList.length; i < len ; i++) {
        if (userItem.id === this.resharesList[i].share_with) {
          thereIs = true;
        }
      }
      if (!thereIs) return userItem;
    });
    return result;
  }

  /**
   * Add the showSetupMenu flag on each item of the passed array
   * @param array the reshares list
   */
  addShowSetupMenuFlag(array: any[]) {
    array.forEach( item => item.showSetupMenu = false );
  }

  /**
   * Detect changes on @Input object for share component
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    const share = changes.share;
    if (share.currentValue) {
      this.ngOnInit();
    }
  }

  ngAfterViewInit() {}

  displayFn(user: any): string {
    return (user && user.label) ? user.label : '';
  }

/**
   * search folder father share list
   * @param filePathFather
   */ 

  async fatherSahringList (filePathFather){
    let fatherShairngList = await this.shareService.reshares(filePathFather).toPromise();
    this.resharesFatherList = fatherShairngList.body.ocs.data;

    if(this.isTim){
      let nowDate = new Date().getTime();
      this.resharesFatherList.forEach((element) => {
        if(element.expiration){
          let getDate = element.expiration.split(" ");
          let tryDate = getDate[0].split("-");
          var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
          if((expDate < nowDate) && element.uid_file_owner == sessionStorage.user) element.flagExp = true;
          else element.flagExp = false;
        }else element.flagExp = false;        
      });
    }  

    this.resharesFatherList.forEach(element => {
      if(!this.fatherReshareList.includes(element.share_with)){
        this.fatherReshareList.push(element.share_with);
      }
    });
  }

  /** GET ABSOLUTE
   * get the absolute father of the path
   **/
  async getAbsolute(filePathFather){
    let fatherSharingList = await this.shareService.reshares('/' + filePathFather).toPromise();
    this.absoluteFatherList = fatherSharingList.body.ocs.data;
    let nowDate = new Date().getTime();

    if(this.resharesList.length>0){
      this.resharesList.forEach((element) => {
        if(sessionStorage.user == element.uid_file_owner){
          this.absoluteFatherList.forEach((exe) =>{
            if(exe.share_with == element.share_with && exe.expiration){
              let getDate = exe.expiration.split(" ");
              let tryDate = getDate[0].split("-");
              var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
              if((expDate < nowDate)) element.flagExp = true;
              else element.flagExp = false;
            }else element.flagExp = false;
          });
        }        
      }); 
    }
  }

  /** GET EXPIRATION DATE
   * Get project expiration date
   **/
  async getExpirationDate(filePathFather){
    let expirationDate = await this.shareService.findCloseDate(filePathFather).toPromise();
    if(expirationDate.body.ocs.data){
      let date = new Date(expirationDate.body.ocs.data)
      this.projExpirationForm.setValue({projExpDate: date});
      this.expirationDate = date.getTime();
      this.setProjExp = true;
    }else{
      this.projExpirationForm.setValue({projExpDate: ''});
      this.expirationDate = '';
      this.setProjExp = false;
    }
  }

  /**
   * Insert the share for searched user
   * @param user
   */
  async insertShare(user: any) {
    if(this.isTim && !this.FolderZero && !this.fatherReshareList.includes(user.id)){
      this._snackBar.open(this.dict.getDictionary('no_father_sharing'), '', {
        duration: 4000,
        panelClass: ('toast-error')
      });
      this.searchTerm.reset('');
      return;
    }
    const data = {
      nodeId: this.fileId,
      userId: user.id,
    };
    if(this.isTim && this.FolderZero){
      if(this.share.classimage == 'folder') { //FOLDER
        this.sharePermission = 7; // create + change
      } else { //FILE
        this.sharePermission = 3; //edit
      }
    } else if(this.isTim && !this.FolderZero) {
      let resultPermission = await this.shareService.getUserPermission(data).toPromise();
      
      if(resultPermission.Expiration){
        let nowDate = new Date().getTime();
        let getDate = resultPermission.Expiration.date.split(" ");
        let tryDate = getDate[0].split("-");
        var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
        if(expDate<nowDate){
          this._snackBar.open(this.dict.getDictionary('no_father_sharing'), '', {
            duration: 4000,
            panelClass: ('toast-error')
          });
          return;
        }
      }

      if (resultPermission.Performed) {
        if (this.share.classimage == 'folder') {  //FOLDER
            this.sharePermission = resultPermission.Permissions;
        } else { //FILE
            if (resultPermission.Permissions > 17 ) {
              this.sharePermission = 19;
            } else if (resultPermission.Permissions == 1) {
              this.sharePermission = 1;
            } else {
              this.sharePermission = 3;
            }
        }
      } else {
          this._snackBar.open(this.dict.getDictionary('error_system'), '', {
            duration: 4000,
            panelClass: ('toast-error')
          });
          return;
        }
    } else {
      this.sharePermission = Number(this.share.permission);
    }
    if(user != null && typeof user === 'object'){
      if(!this.share.reshare){
        this._snackBar.open(this.dict.getDictionary('noSharePermission'), '', {
          duration: 4000,
          panelClass: ('toast-error')
        });
        return;
      }
      
      this.checkusericon = false;
      this.loading = true;
      const formData = {
        shareType: 0,
        shareWith: user.id,
        permissions: this.sharePermission,
        path: this.filePath,
      };
      this.shareService.insertShare(formData).subscribe(async result => {
        if ( result.status == 404) {
          this._snackBar.open(this.dict.getDictionary('noSharePermission'), '', {
            duration: 4000,
            panelClass: ('toast-error')
          });
          this.loading = false;
          return;

        } else if(result.status == 403) {
          this.loading = false;
          this.searchTerm.reset('');
          return;

        } else {
          
          this.shareData = result.body.ocs.data;
          let shortMessage = this.dict.getDictionary('file_shared');
          let longMessage = this.shareData.displayname_owner + this.dict.getDictionary('file_shared_you');
          let link = 'filesharing?name=' + this.shareData.path;

          if (this.isTim) {
            const projExpiration = this.projExpirationForm.get('projExpDate').value;
            if (projExpiration) {
              const yyyy = projExpiration.getFullYear();
              const mm = projExpiration.getMonth() + 1;
              const dd = projExpiration.getDate();
              const formattedDate: string = dd.toString() + '-' + mm.toString() + '-' + yyyy.toString();
              const form = { expireDate: formattedDate };
              await this.shareService.updateShare(this.shareData.id, form).toPromise();
            }
          }

          let notification = await this.notificationService.createNotification(user.id, shortMessage, longMessage, link).toPromise();
          if(notification.status == 200){
            // reshares
            this.shareService.reshares(this.shareData.path).subscribe( result2 => {
              this.resharesList = result2.body.ocs.data;

              if(this.isTim){          
                let nowDate = new Date().getTime();
                this.resharesList.forEach((element) => {
                  if(element.expiration){
                    let getDate = element.expiration.split(" ");
                    let tryDate = getDate[0].split("-");
                    var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
                    if((expDate < nowDate) && element.uid_file_owner == sessionStorage.user) element.flagExp = true;
                    else element.flagExp = false;
                  }else element.flagExp = false;
                  // Check projExpiration to setup flagProjExp
                  if (this.projExpirationForm.get('projExpDate').value) { element.flagProjExp = true; }
                  else { element.flagProjExp = false; }
                });
              }
              
              // Sort reshares list by share_type, value 3 (=link) precede value 0
              this.resharesList = this.resharesList.sort((a, b) => (a.share_type < b.share_type) ? 1 : ((b.share_type < a.share_type) ? -1 : 0));
              // Set profile_pic_url field for each element
              this.resharesList.forEach(element => {
                if (element.share_with) {
                  element.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + element.share_with + `&size=20`;
                
                  this._deleteservice.toggle(element.file_source, 'share', '0', '');
                }
              });
              // Add to reshares list items the showSetupMenu flag
              this.addShowSetupMenuFlag(this.resharesList);
      
              // Clear input field
              this.searchTerm.reset('');
      
              this.loading = false;
            });
          }
        }
      });
    }
  }

  /**
   * Insert a share link
   */
  insertShareLink(event: any) {
    event.stopPropagation();
    if(!this.share.reshare){
      this._snackBar.open(this.dict.getDictionary('noSharePermission'), '', {
        duration: 4000,
        panelClass: ('toast-error')
      });
      return;
    }

    this.loadingLink = true;

    const formData = {
      shareType: 3,
      permissions: this.type === 'folder' ? 31 : 27,
      path: this.filePath,
    };
    this.shareService.insertShare(formData).subscribe( result => {
      this.shareLinkData = result.body.ocs.data;

      // reshares
      this.shareService.reshares(this.shareLinkData.path).subscribe( result2 => {
        this.resharesList = result2.body.ocs.data;

        if(this.isTim){          
          let nowDate = new Date().getTime();
          this.resharesList.forEach((element) => {
            if(element.expiration){
              let getDate = element.expiration.split(" ");
              let tryDate = getDate[0].split("-");
              var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
              if((expDate < nowDate) && element.uid_file_owner == sessionStorage.user) element.flagExp = true;
              else element.flagExp = false;
            }else element.flagExp = false;
          });
        }
        // Sort reshares list by share_type, value 3 (=link) precede value 0
        this.resharesList = this.resharesList.sort((a, b) => (a.share_type < b.share_type) ? 1 : ((b.share_type < a.share_type) ? -1 : 0));
        // Set profile_pic_url field for each element
        this.resharesList.forEach(element => {
          if (element.share_with)
            element.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + element.share_with + `&size=20`;

            this._deleteservice.toggle(element.file_source, 'share', '3', '');
        });
        // Add to reshares list items the showSetupMenu flag
        this.addShowSetupMenuFlag(this.resharesList);

        let idtoopen;
        for(var i in this.resharesList){
          if(!idtoopen || idtoopen < this.resharesList[i].id) idtoopen = this.resharesList[i].id;
        }
        this.toggleShareSetupMenu(idtoopen);
        this.loadingLink = false;
      });
    });
  }

  /**
   * Show/Hide the share setup menu on click event
   * @param id
   */
  toggleShareSetupMenu(id: any) {
    for (const item of this.resharesList) {
      if (item.id === id && !item.showSetupMenu) {
        item.showSetupMenu = true;
      } else {
        item.showSetupMenu = false;
      }
    }
  }

  /**
   * Handle the reshares event trigged by share setup changes
   * @param $event
   */
  resharesEventHandler($event) {
    this.resharesList.forEach(element => {
      if (element.id === $event) {
        this.shareService.reshares(element.path).subscribe( result => {
          this.resharesList = result.body.ocs.data;

          if(this.isTim){          
            let nowDate = new Date().getTime();
            this.resharesList.forEach((element) => {
              if(element.expiration){
                let getDate = element.expiration.split(" ");
                let tryDate = getDate[0].split("-");
                var expDate = new Date( tryDate[0], tryDate[1] - 1, tryDate[2]).getTime();
                if((expDate < nowDate) && element.uid_file_owner == sessionStorage.user) element.flagExp = true;
                else element.flagExp = false;
              }else element.flagExp = false;
            });
          }

          for(var i in this.resharesList){
            if (this.resharesList[i].id === $event) {
              this.resharesList[i].showSetupMenu = true;
            }
          }
          // Sort reshares list by share_type, value 3 (=link) precede value 0
          this.resharesList = this.resharesList.sort((a, b) => (a.share_type < b.share_type) ? 1 : ((b.share_type < a.share_type) ? -1 : 0)); 
          // Set profile_pic_url field for each element
          this.resharesList.forEach(elem => {
            if (elem.share_with) {
              elem.profile_pic_url = `${globals.endpoint}/setting/info/avatar/getavatar?user=` + elem.share_with + `&size=20`;
            }
          });
          // Add to reshares list items the showSetupMenu flag
          //this.addShowSetupMenuFlag(this.resharesList);
        });
      }
    });
  }

  //WIP: DECOMMENTARE AL FIX LINK
  copyLink(value: string) {
    //WIP: sistemare per vdemo
    //value = (value.includes('vdesk-demo.liveboxcloud.com'))? value.replace('vdesk-demo.liveboxcloud.com', 'localhost:4200') : value;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  reportDownload(event:any){
    this.inProgress = true;
    this.PdfFunction(this.filePath).then(data => {
      if( data && data[0][1].length == 0){
        this.inProgress = false;
            this._snackBar.open(this.dictEmptyReport, null, {
              duration: 4000,
              panelClass: 'toast-error'
            });
        return;
      } else if ( data ) {
        const doc = new jsPDF('l', 'mm', 'a4');
        var pageWidth = doc.internal.pageSize.getWidth()/15;
        var pageWidth2 = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        doc.setFontSize(16);
        doc.text( `  ${this.dictFileTitle}`, pageWidth2 / 2, 12, 'center');
        doc.setFontSize(16);
        doc.text(`  ${this.filePath}`,pageWidth2 / 2, 20, 'center' );
        doc.setFontSize(16);
        doc.text( `  ${this.dictOwner}: ${data[0][0][0]}`, 11, 35);
        doc.setTextColor(100);

        (doc as any).autoTable({
          head: this.head,
          margin: { top: 40 },
          body: data[0][1],
          theme: 'grid',
          didDrawCell: data => {
          },
          tableWidth: 'wrap',

          headStyles: {
            fillColor: [0, 57, 106],
            fontSize: 10,
          },

          columnStyles: {
            0: {cellWidth: pageWidth*2.0},
            1: {cellWidth: pageWidth*2.0},
            2: {cellWidth: pageWidth*1.5},
            3: {cellWidth: pageWidth*3.0},
            4: {cellWidth: pageWidth*2.0},
            5: {cellWidth: pageWidth*2.0},
            6: {cellWidth: pageWidth*1.3},
          }
        })
        let folderName = this.filePath;
        let date = new Date();
        let humanDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + ':' + date.getMinutes();
        let name = folderName + 'SharingActivities' + humanDate + '.pdf';
        doc.save(name);
        this.inProgress = false;
      }
    }
      );
    
  }


  async PdfFunction(fileName: string) : Promise<any> {
   let result = [];
   let resultOwner = [];
   let resultShared = [];
   let waitService = await this.shareService.getShareActivityPfd(fileName).toPromise();
   if(waitService.message){
    this._snackBar.open(this.dictMessagePermission, null, {
      duration: 4000,
      panelClass: 'toast-error'
    });
    this.inProgress = false;
    return;
   } else {
          for(var a in waitService.data){
              let that = waitService.data[a];
              let sharedAt = that.sharedAt;
              let name = that.firstname;
              let surname = that.lastname;
              let uid = that.uid;
              let email = that.email;
              let permissions = that.permissions;
              let expiration;
              if(that.expiration){
                let expDate = new Date(that.expiration);
                let day = (expDate.getDate().toString().length>1)? expDate.getDate() : '0' + expDate.getDate();
                let month = ((expDate.getMonth() + 1).toString().length>1)? expDate.getMonth() + 1 : '0' + (expDate.getMonth() + 1);
                let hour = (expDate.getHours().toString().length>1)? expDate.getHours() : '0' + expDate.getHours();
                let minute = (expDate.getMinutes().toString().length>1)? expDate.getMinutes() : '0' + expDate.getMinutes();
                expiration = day + '/' + month + '/' + expDate.getFullYear() + ' ' + hour + ':' + minute;
              }else {
                expiration = '';
              }
              let removed = (that.note)? this.dict.getDictionary('removed') : '';

              resultShared.push([name, surname, uid, email, sharedAt, expiration, removed]);
          }
          let owner = waitService.shareInfo.owner;
          resultOwner.push([owner]);
          result.push([resultOwner,resultShared])
      return result;
    }
  }
}
