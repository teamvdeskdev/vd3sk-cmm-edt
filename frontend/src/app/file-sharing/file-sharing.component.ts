import { Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { FileSharingService } from './services/file-sharing.service';
import { Dictionary } from './dictionary/dictionary';
import { FileSharingData, Utilities } from './utilities';
import { NavigationEnd, Router } from '@angular/router';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';
import { GlobalVariable } from 'src/app/globalviarables';
import { DigitalSignatureService } from './components/digital-signature/digital-signature.service';
import { SignedDocumentRootResponse } from './model/SignedDocumentRootResponse';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';
import { DataSharingService } from '../app-services/data-sharing.service';
import { MailService } from '../mail/services/mail.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreatefileDialogComponent } from 'src/app/file-sharing/components/dialogs/createfile-dialog/createfile-dialog.component';
import { globals } from 'src/config/globals';
import { ReportModel } from './model/share';
import { AuthenticationService } from '../app-shared/authentication.service';

@Component({
  selector: 'app-file-sharing',
  templateUrl: './file-sharing.component.html',
  styleUrls: ['./file-sharing.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class FileSharingComponent implements OnInit, OnDestroy {
  util = new Utilities();
  dict = new Dictionary();
  panelOpenState = false;
  showAllFiles = true;
  isSideOpen: boolean;
  controltrick: boolean;
  currentpage: string;
  screen: boolean;
  isSharedOpen: boolean;
  usedSpace: string;
  iconSpace: string;
  isActivity: boolean;
  isFilesharing: boolean;
  isSettings: boolean;
  //openLoadList: boolean;
  editmode: boolean = true;
  pathchanged: string;
  isBackgroundSending = false;
  isVpecInstalled: boolean = this._const.isVpecInstalled;
  dataValue: FileSharingData[] = [];
  GFM: boolean = false;
  signedDocumentRootFolder: string;
  reportValue = [];
  notCustom: boolean = false;
  notShare: boolean = false;

  // Dictionary  
  dictLabels: string = this.dict.getDictionary('labels');
  dictShares: string = this.dict.getDictionary('shares');
  dictCreate: string = this.dict.getDictionary('creates');
  dictRecent: string = this.dict.getDictionary('recents');
  tooltipTextClose: string = this.dict.getDictionary('close');
  dictAllFiles: string = this.dict.getDictionary('all-files');
  dictFavorites: string = this.dict.getDictionary('favorites');
  dictPEC: string = this.dict.getDictionary('attachmentsvpec');
  dictMail: string = this.dict.getDictionary('attachmentsMail');
  dictSharedYou: string = this.dict.getDictionary('shared-by-you');
  dictSignature: string = this.dict.getDictionary('signed-document');
  dictGroupFolder: string = this.dict.getDictionary('group_folder');
  dictActivity: string = this.dict.getDictionary('vshare_activity');
  dictOneActivity: string = this.dict.getDictionary('activities');
  dictSettings: string = this.dict.getDictionary('vshare_settings');
  dictOnlySettings: string = this.dict.getDictionary('settings')
  dictDeletedFiles: string = this.dict.getDictionary('deleted_files');
  dictSharedLink: string = this.dict.getDictionary('shared-by-link');
  dictVShareFiles: string = this.dict.getDictionary('tt_vshare_files');
  dictSharesRemoved: string = this.dict.getDictionary('shares-deleted');
  dictSharedOthers: string = this.dict.getDictionary('shared-by-others');
  dictProtectedFiles: string = this.dict.getDictionary('protected_files');
  dictExternalArchives: string = this.dict.getDictionary('externalarchives');
  dictVShareSettings: string = this.dict.getDictionary('tt_vshare_settings');
  dictVShareActivities: string = this.dict.getDictionary('tt_vshare_activities');
  dictOperationFailed: string = this.dict.getDictionary('operation_failed');
  dictOperationSuccess: string = this.dict.getDictionary('operation_success');
  dictSendMailInProgress: string = this.dict.getDictionary('send_mail_in_progress');
  dictFileName: string = this.dict.getDictionary('file_sharing_name');
  dictFileDate: string = this.dict.getDictionary('date');
  dictFileOwner: string = this.dict.getDictionary('owner');
  dictFileType: string = this.dict.getDictionary('type');
  dictFileShareWith: string = this.dict.getDictionary('share_with');
  dictErrorEmptyReport: string = this.dict.getDictionary('empty_report');

  tools: any;
  globalsVar: any;

  changePathSub: Subscription;
  sendMailInBackSub: Subscription;
  noData: boolean;
  isTim: boolean;

  constructor(
    public router: Router,
    private fsService: FileSharingService,
    public _const: GlobalVariable,
    private digitalSignatureService: DigitalSignatureService,
    private buttonGroup: GroupFolderButton,
    private dataSharingService: DataSharingService,
    private mailService: MailService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthenticationService,
  ) {
    this.globalsVar = globals;
    let folderManager = sessionStorage.getItem('folderManager');
    if (folderManager !== undefined && folderManager === 'true') {
      this.GFM = true;
    } else {
      this.GFM = false;
    }


    const url = window.location.href.split('/');
    if (url[3] === 'filesharing' && url[4].includes('activities-')) {
      this.isActivity = true;
      this.isFilesharing = false;
      this.isSettings = false;
    } else if (url[3] === 'filesharing' && url[4].includes('settings-')) {
      this.isSettings = true;
      this.isFilesharing = false;
      this.isActivity = false;
    } else {
      this.isFilesharing = true;
      this.isActivity = false;
      this.isSettings = false;
    }


    this.changePathSub = this.dataSharingService.currentPath.subscribe(path => {
      this.pathchanged = path;
    });

    // Subscription for the sendMsgInBackground observable
    this.sendMailInBackSub = this.dataSharingService.sendMsgInBackground.subscribe(dialogResult => {
      if (this._const.sendmail.length > 0 && this._const.app === 'vShare') {
        this.sendMailInBackground(dialogResult);
      }
    });
  }

  ngOnInit() {
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    if(this.globalsVar.customCustomer.toLowerCase() == 'notariato'){
      this.notCustom = true;
      this.notShare = (sessionStorage.getItem('groups').includes('notbox-firma'))? true : false;
    }
    //this.openLoadList = false;
    this.isSideOpen = true;
    this.controltrick = false;
    this.getCurrentpage();

    if (this.currentpage == 'group-folder' || this.currentpage == 'attachmentsvpec' ||
      this.currentpage == 'externalarchives' || this.currentpage == 'protectedfile' ||
      this.currentpage == 'labels' || this.currentpage == 'signed-documents-folder') {
      this.editmode = false;
    }

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && val.url === '/filesharing/signed-documents-folder') {
        this.updatePathAndCurrentPage('signed-documents-folder');
      }
  });

    this.buttonGroup.change.subscribe(data => {
      this.editmode = data;
    });

    this.getUsedSpace();
    this.isSharedOpen = (window.location.href.includes('shared')) ? true : false;
    if (this.isSharedOpen) this.panelOpenState = true;
    this.screen = (window.innerWidth > 1024) ? true : false;

    this.dataSharingService.selectVshareFromHeader.subscribe(result => {
      if (result) {
        this.dataSharingService.selectVshareFromHeader.next(false);
        this.isFilesharing = true;
        this.isActivity = false;
        this.isSettings = false;
        this.updatePathAndCurrentPage('all-files');
      }
    });
  }

  updatePathAndCurrentPage(path: string) {
    //this.pathchanged = path + '_cleanArray';
    this.currentpage = path;
    setTimeout(() => {
      this.dataSharingService.changePath(path + '_cleanArray');
    });
  }

  toggleClickScreen(drawer) {
    drawer = drawer.toggle();
    this.controltrick = !this.controltrick;
  }

  /** GET CURRENT PAGE
   * Get url and check the pages
   * Updated with 2 array for activities/normal pages list
   **/
  getCurrentpage() {
    let url = this.router.url;
    let array = [
      'all-files', 'recents', 'favorites', 'shares', 'shared-by-you', 'shared-by-others',
      'shared-by-link', 'labels', 'deleted', 'group-folder', 'externalarchives', 'attachmentsvpec',
      'protectedfile', 'signed-documents-folder', 'vflow'
    ];

    let arrayactivities = [
      'activities-all', 'activities-your', 'activities-others', 'activities-favorites', 'activities-filechanges',
      'activities-security', 'activities-fileshares', 'activities-calendar', 'activities-task'
    ];

    let arraysettings = [
      'settings-activitiesandnotifications', 'settings-externalarchives', 'settings-applications',
      'settings-groupfolders', 'settings-users', 'settings-disableuser', 'settings-ldapuser', 'settings-samluser'
    ];

    let arraycheck = (url.includes('activities-')) ? arrayactivities : ((url.includes('settings-')) ? arraysettings : array);
    for (var i in arraycheck) {
      if (url.includes(arraycheck[i])) {
        this.currentpage = arraycheck[i];
        break;
      }
    }
  }

  /** LIST SHARE TOGGLE
   * Use jquery
   * Toggle list shared
   **/
  listShareToggle() {
    //@ts-ignore
    if ($('.listShareDropdown').is(':hidden')) {
      //@ts-ignore
      $('.listShareDropdown').slideDown();
      this.panelOpenState = true;
    } else {
      //@ts-ignore
      $('.listShareDropdown').slideUp();
      this.panelOpenState = false;
    }
  }

  /** **/
  getUsedSpace() {
    this.fsService.getStorageSpace().subscribe((result: any) => {
      let usedSpace = result.body.data.usedSpacePercent;
      let allSpace = result.body.data.freeSpace;
      let humanSpace = this.util.getWeight(allSpace);
      let image = (usedSpace != 0) ? (Math.ceil(usedSpace / 10) * 10) : 0;
      this.usedSpace = usedSpace + '% ' + this.dict.getDictionary('on') + ' ' + humanSpace + ' ' + this.dict.getDictionary('used');
      this.iconSpace = 'assets/img/used_space/' + 'used_space-' + image + '.svg';
    });
  }

  activitySelected() {
    this.isActivity = true;
    this.isFilesharing = false;
    this.isSettings = false;
    this.updatePathAndCurrentPage('activities-all');
    this.router.navigateByUrl('filesharing/activities-all');
  }

  fileshSelected() {
    this.isFilesharing = true;
    this.isActivity = false;
    this.isSettings = false;
    this.updatePathAndCurrentPage('all-files');
    this.router.navigateByUrl('filesharing/all-files');
  }

  settingsSelected() {
    this.isSettings = true;
    this.isFilesharing = false;
    this.isActivity = false;
    let path = '';
    if(this.GFM) path = 'settings-groupfolders';
    else{
      if(this._const.isUserAdmin) path = 'settings-externalarchives';
      else if(this.globalsVar.enableVdpa) path = 'settings-signaturesettings';
    }
    this.updatePathAndCurrentPage(path);
    this.router.navigateByUrl('filesharing/' + path);
  }

  /*toggleLoadNew(){
    this.openLoadList = !this.openLoadList;
  }*/

  openDialogCreate() {
    const dialogRef = this.dialog.open(CreatefileDialogComponent, {
      width: '780px',
      height: '340px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      //debugger;
      // if(!result){
      //   const load = true;
      //   this.fsService.setInfoLoad(load);
      // }
    });
  }


  showSuccessToast(message) {
    this._snackBar.open(message, '', {
      duration: 3000,
      panelClass: 'toast-success'
    });
  }

  showErrorToast(message) {
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-error'
    });
  }

  sendMailInBackground(dialogResult) {
    this.isBackgroundSending = true;
    this.mailService.sendMail(dialogResult.message).subscribe(
      (result: any) => {
        if (this._const.sendmail.length > 0) {
          this._const.sendmail = [];
          this._const.app = '';
        }
        this.isBackgroundSending = false;

        if (result) {
          this.showSuccessToast(this.dictOperationSuccess);
        } else {
          this.showErrorToast(this.dictOperationFailed);
        }

      },
      error => {
        // sendMail failed
        if (this._const.sendmail.length > 0) {
          this._const.sendmail = [];
          this._const.app = '';
        }
        this.isBackgroundSending = false;
        this.showErrorToast(this.dictOperationFailed + ' ' + error.message);
      }
    );
  }

  async downloadReport() {
    let list = await this.getListShare();
    if(!this.noData){
      let string = "";
      // tslint:disable-next-line: forin
      for( const i in list) {
        let sharingName = "";
        for( const x in list[i].share_with) {
          if(sharingName == "") {
            sharingName = list[i].share_with[x];
          } else {
            sharingName = sharingName + ' , ' + list[i].share_with[x];
          }
        }
        // tslint:disable-next-line: max-line-length
        const substring = `${this.dictFileName}:  ${list[i].file_name},      ${this.dictFileDate}:  ${list[i].date},      ${this.dictFileOwner}:  ${list[i].displayname_owner},      ${this.dictFileType}:  ${list[i].share_type},      ${this.dictFileShareWith}:  ${sharingName}'\n'`;
        string = string + substring;
      }
      var csvData = new Blob([string], {type: 'text/csv;charset=utf-8;'});
      var csvURL = window.URL.createObjectURL(csvData);
      var tempLink = document.createElement('a');
      tempLink.href = csvURL;
      let date = new Date();
      let humanDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes();
      tempLink.setAttribute('download', 'SharingReport'+ humanDate +'.csv');
      tempLink.click();
    } else {
      this._snackBar.open( this.dictErrorEmptyReport, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }
  }


  async getListShare() {
    let getSharedByYou = await this.fsService.getSharedByYou().toPromise();
    // Format array data for the table
    let sharedByYouData: any[] = [];
    sharedByYouData = this.util.getShareFormattedResponse(getSharedByYou.body.ocs.data, 'byYou');
    // Get shared by others from server
    let getSharedByOthers = await this.fsService.getSharedByOthers().toPromise();
    // Retrieve the first array data
    let data1: any[] = [];
    data1 = getSharedByOthers.body.ocs.data;

    let getsharedRemote = await this.fsService.getSharedByOthersRemote().toPromise();
    // Retrieve the second array data
    let data2: any[] = [];
    data2 = getsharedRemote.body.ocs.data;

    // Merge first and second array data for "shared by others"
    data1 = [...data1, ...data2];

    // Format array data for the table
    let sharedByOthersData: any[] = [];
    sharedByOthersData = this.util.getShareFormattedResponse(data1, 'byOthers');

    if (sharedByYouData.length > 0 || sharedByOthersData.length > 0) {
            // data array is not empty
            this.noData = false;

            // Fill the table to display
            this.dataValue = [...sharedByYouData, ...sharedByOthersData];

            this.dataValue.sort((a, b) => (a.lastUpdate < b.lastUpdate) ? 1 : -1);
            // Eliminate duplicates between "shared by you" and "shared by others"
            /*
            this.dataValue = this.mergeObjectsInUnique(fullData, 'name');
            */

          } else {
            this.noData = true;
          }
    const array = this.dataValue;
    let currentUser = this.authService.currentUser;
    // tslint:disable-next-line: forin
    for (const i in array) {
      const objValue = {} as ReportModel;

      objValue.file_name = array[i].name;
      objValue.share_type = array[i].type;
      objValue.date = array[i].dateReal;
      objValue.displayname_owner = (array[i].owner != '') ? array[i].owner : currentUser.displayname;
      // objValue.share_with = array[i].name;
      if (array[i].shareWith.length === 0) {
        objValue.share_with = [];
    } else if (array[i].shareWith !== undefined && array[i].shareWith.length > 0) {
        objValue.share_with = array[i].shareWith;
    } else {
        objValue.share_with = [array[i].shareWith];
    }
      this.reportValue.push(objValue);
    }
    return this.reportValue;
  }


  ngOnDestroy() {
    if (this.changePathSub) {
      this.changePathSub.unsubscribe();
    }
    if (this.sendMailInBackSub) {
      this.sendMailInBackSub.unsubscribe();
    }
  }
}

