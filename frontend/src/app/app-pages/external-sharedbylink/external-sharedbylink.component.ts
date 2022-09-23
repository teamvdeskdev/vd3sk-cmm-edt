import { Component, OnInit } from '@angular/core';
import { FileSharingService } from '../../file-sharing/services/file-sharing.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AudioVideoComponent } from 'src/app/file-sharing/components/dialogs/audio-video/audio-video.component';
import { Utilities } from 'src/app/file-sharing/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, RouterModule } from '@angular/router';
import { DialogPdfComponent } from 'src/app/file-sharing/components/dialogs/dialog-pdf/dialog-pdf.component';
import { LanguageService } from 'src/app/app-services/language.service';
import { globals } from 'src/config/globals';
import { AppConfig } from 'src/app/app-config';

@Component({
  selector: 'app-external-sharedbylink',
  templateUrl: './external-sharedbylink.component.html',
  styleUrls: ['./external-sharedbylink.component.scss']
})

export class ExternalSharedbylinkComponent implements OnInit {
  util = new Utilities();
  owner: string;
  completename: string;
  url: string;
  download_name: string;
  dataowner: string;
  isProtected: boolean;
  authorization: string;
  isdata = true;
  noData: boolean;
  info = {};
  isFile =  false;
  extension = '';
  name = '';
  data;
  userpermissions = '';
  tableSidebar;
  token: string;
  openLoadList = false;
  arrayPath = [];
  hasPassword: boolean;
  inputvalue = '';
  hidedownload: boolean;
  alreadyDone = false;
  isSoloFile = false;
  done = false;

  // permissions
  allPermission;
  isReadable: boolean;
  isUpdateable: boolean;
  isDeletable: boolean;
  isCrearable: boolean;
  isSharable: boolean;
  globalsVar: AppConfig;

  constructor(
    private fsService: FileSharingService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private router: Router,
    public langService: LanguageService
  ) {
    this.globalsVar = globals;
  }

  ngOnInit() {
    this.onLoad();
  }

  onLoad(){
    this.arrayPath = [];
    let url = window.location.href;
    //url = (url.includes('http'))? url.replace('http', 'https') : url;
    const arrayUrl = window.location.href.split('/');
    let codedName = arrayUrl[arrayUrl.length - 1];
    this.token = codedName;

    if (codedName.indexOf('?path=') > 0) {
      const index = codedName.indexOf('?path=');
      let arrayPath = decodeURIComponent(codedName.slice(index + '?path='.length)).split('/');
      this.token = decodeURIComponent(codedName.slice(0, index));
      arrayPath = arrayPath.filter(item => item.length > 0);
      for (let g in arrayPath) {
        const pathObj = {
          id: g,
          name: arrayPath[g]
        };
        this.arrayPath.push(pathObj);
      }
      codedName = codedName.slice(0, index);
    }

    this.authorization = 'Basic ' + window.btoa(codedName + ' :');
    this.fsService.convertLink(url).subscribe(async(result: any) => {
      if(sessionStorage.length>0 && sessionStorage.getItem('pass').length>0){
        let waitService = await this.fsService.getPasswordLink(this.token, sessionStorage.getItem('pass')).toPromise();
        if(waitService.message == 200){
          if (!waitService.ispassword) {
            if(this.inputvalue) sessionStorage.setItem('pass', this.inputvalue);            
            this.hasPassword = !result.ispassword;
            this.alreadyDone = true;
            this.loadWithPass(waitService);
          } else {
            this.hasPassword = result.ispassword;
            this._snackBar.open(this.langService.dictionary.psw_error, '', {
              duration: 4000,
              panelClass: 'toast-error'
            });
          }
          this.spinner.hide();
          this.done = true;
        }          
      }else{       
        this.hasPassword = result.ispassword; 
        if(!this.hasPassword){
          this.loadWithoutPass(result);
        }
      }      
    });
  }

  onNewTxt(event) {}

  loadWithoutPass(result) {
    this.hidedownload = result.hidedownload;
    this.owner = result.dataowner;
    this.completename = result.name;
    this.url = result.url;
    this.dataowner = this.langService.dictionary.shared_by;
    this.isProtected = (result.dataprotected == 'true') ? true : false;

    for (let i in this.util.allData) {
      for (let x in this.util.allData[i]) {
        if (this.completename.includes(this.util.allData[i][x])) {
          this.isFile = true;
          this.extension = this.util.allData[i][x];
          this.name = this.completename.replace(this.extension, '');
          break;
        }
      }
    }

    if (this.extension.length == 0 && this.name.length == 0) { this.name = this.completename; }

    this.info = {
      owner: this.owner,
      name: this.name,
      completename: this.completename,
      extension: this.extension,
      isFile: this.isFile,
      url: this.url
    };

    if (this.isProtected) {
      // debugger;
    } else {
      const getUrl = window.location.href;
      let pathUrl = '';
      if (getUrl.includes('?path=')) {
        const indexUrl = getUrl.indexOf('?path=') + '?path='.length;
        pathUrl = getUrl.slice(indexUrl);
      }
      if(pathUrl.length>0){
        this.fsService.openFolderPublic(pathUrl, this.authorization).subscribe((result: any) => {
          if(result.body.multistatus.response.href) this.isSoloFile = true;
          let response = this.util.getPublicFile(result.body.multistatus.response, this.isSoloFile, this.info);
          if('userpermissions' in response){
            this.data = response.dataValue;
            this.noData = false;
            this.userpermissions = response.userpermissions;
            this.getPermissions(this.userpermissions);
            this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
            this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
          } else {
            this.allPermission = response.permissions;
            this.data = [];
            this.noData = true;
          }
          this.isdata = true;
        });
      } else {
        this.fsService.dataFilePublic(pathUrl, this.authorization).subscribe((result: any) => {
          if(result.body.multistatus.response.href) this.isSoloFile = true;
          let response = this.util.getPublicFile(result.body.multistatus.response, this.isSoloFile, this.info);
          if('userpermissions' in response){
            this.data = response.dataValue;
            this.noData = false;
            this.userpermissions = response.userpermissions;
            this.getPermissions(this.userpermissions);
            this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
            this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
          }else if(this.isSoloFile){
            this.allPermission = response.permissions;
            this.data = response;
            this.noData = true;
          }else{
            this.allPermission = response.permissions;
            this.data = [];
            this.noData = true;
          }
          this.isdata = true;
        });
      }
    }
  }

  loadWithPass(result) {
    let password = (this.inputvalue)? this.inputvalue : sessionStorage.getItem('pass');
    this.authorization = 'Basic ' + window.btoa(this.token + ':' + password);

    if (!this.hasPassword) {
      this.hidedownload = result.hidedownload;
      this.owner = result.dataowner;
      this.completename = result.name;
      this.url = result.url;
      this.dataowner = this.langService.dictionary.shared_by;
      this.isProtected = (result.dataprotected == 'true') ? true : false;

      for (let i in this.util.allData) {
        for (let x in this.util.allData[i]) {
          if (this.completename.includes(this.util.allData[i][x])) {
            this.isFile = true;
            this.extension = this.util.allData[i][x];
            this.name = this.completename.replace(this.extension, '');
            break;
          }
        }
      }

      if (this.extension.length == 0 && this.name.length == 0) { this.name = this.completename; }

      this.info = {
        owner: this.owner,
        name: this.name,
        completename: this.completename,
        extension: this.extension,
        isFile: this.isFile,
        url: this.url
      }

      if(this.isProtected){
        //debugger;
      }else{
        let getUrl = window.location.href;
        let pathUrl = '';
        if (getUrl.includes('?path=')) {
          const indexUrl = getUrl.indexOf('?path=') + '?path='.length;
          pathUrl = getUrl.slice(indexUrl);
        }
        this.fsService.dataFilePublic(pathUrl,this.authorization).subscribe((result: any) => {
          if(pathUrl.length>0){
            if(result.body.multistatus.response.href){
              let response = this.util.getPublicFile(result.body.multistatus.response, true, this.info);
              this.data = [];
              if('permissions' in response) this.userpermissions = response.permissions;
              this.allPermission = this.userpermissions;      
              this.noData = true;
            }else{
              let response = this.util.getPublicFile(result.body.multistatus.response, this.isSoloFile, this.info);
              if('userpermissions' in response){
                this.data = response.dataValue;
                this.userpermissions = response.userpermissions;
                this.getPermissions(this.userpermissions);
                this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
                this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
              }
            }
            this.isdata = true
          }else{
            if(result.body.multistatus.response.href) this.isSoloFile = true;
            let response = this.util.getPublicFile(result.body.multistatus.response, this.isSoloFile, this.info);
            if('userpermissions' in response){
              this.data = response.dataValue;
              this.userpermissions = response.userpermissions;
              this.getPermissions(this.userpermissions);
              this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
              this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
            }else if(this.isSoloFile){
              this.allPermission = response.permissions;
              this.data = response;
              this.noData = true;
            }else{
              this.allPermission = response.permissions;
              this.data = [];
              this.noData = true;
            }
            this.isdata = true;
          }          
        });
      }
    }
  }

  getPermissions(data) {
    if (data) {
      this.allPermission = {
        isReadable: (data.includes('G')) ? true : false,
        isUpdateable: (data.includes('W')) ? true : false,
        isDeletable: (data.includes('D')) ? true : false,
        isCrearable: (data.includes('CK')) ? true : false,
        isSharable: (data.includes('R')) ? true : false,
      };
    }
  }

  /** NAVIGATE FOLDER
   * Navigate folder on table name click
   * @param $event (any) folder element
   **/
  navigateFolder($event) {
    if (!$event.isfile) {
      let path = (($event.completepath.charAt(0)=='/')? '' : '/') + decodeURIComponent($event.completepath);
      this.arrayPath.push({id: this.arrayPath.length, name: $event.name.replace(/\//g, '')});
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['index.php/s/', this.token ], { queryParams: { path: path } }));
    } else {
      if (this.util.allData.text.includes($event.extension) || this.util.allData.spredsheet.includes($event.extension) ||
      this.util.allData.powerpoint.includes($event.extension) || this.util.allData.richtext.includes($event.extension)) {
        //let FilePath = $event.path + (($event.realname)? $event.realname : $event.name) + $event.extension;
        let path = (($event.completepath.charAt(0)=='/')? '' : '/') + decodeURIComponent($event.completepath);
        this.openOnlyOffice($event.name + $event.extension, $event.id, path);
      }/*else if(this.util.allData.pdf.includes($event.extension)){
        let uri = $event.completepath;
        this.fsService.getBody(uri).subscribe((result: any) => {
          var reader = new FileReader();
          reader.readAsDataURL(result.body);
          reader.onloadend = function () {
            return reader.result;
          }

          var interval = setInterval(function(){
            if(reader.result){
              clearInterval(interval);
              this.openDialogPdf($event, reader.result);
            }
          }.bind(this), 1000);

        });
      }else{
        if(this.util.allData.video.includes($event.extension) || this.util.allData.audio.includes($event.extension) ||
        this.util.allData.image.includes($event.extension)) this.openDialogAudioVideo($event);
      }*/
    }
  }

  openDialogPdf(data, base) {
    const dialogRef = this.dialog.open(DialogPdfComponent, {
      width: '70%',
      height: '85%',
      data: { data, base }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /** OPEN ONLY OFFICE **/
  openOnlyOffice(name: string, id, FilePath?: string) {
    id = (!this.isSoloFile) ? id : 0;
    const fullName =  (FilePath) ? '%252F' + FilePath.replace(/\//g, '%252F') : name;
    const navigate = this.router.serializeUrl(
      this.router.createUrlTree([`/onlyoffice/${'id=' + id + '&name=' + fullName + '&sharetoken=' + this.token}`])
    );
    const fileTab = window.open(navigate, '_blank');

    if (FilePath !== undefined) {
      // Track the file update in log collector
      const updateCheckInterval = setInterval(async function() {
        if (fileTab.closed) {
          let TimeTabCLosed = await this.fsService.getTimeClosed().toPromise();
          setTimeout( async() => {
            let waitService = await this.fsService.getAllFiles(FilePath).toPromise();
            if(waitService.status == 200) {
              let getLastModified = waitService.body.multistatus.response.propstat[0].prop.getlastmodified;
              if(getLastModified) {
                let TimeNow = TimeTabCLosed.timestamp * 1000;
                let dataReal = new Date(getLastModified).getTime();
                var compreso = dataReal >= (TimeNow - 15000) && dataReal <= (TimeNow + 15000);
                if(compreso) {
                  this.fsService.trackFileUpdate(FilePath).subscribe((result: any) => {
                  });
                }
              }
            }
          }, 15000);
          clearInterval(updateCheckInterval);
        }
      }.bind(this), 5000);
    }
  }

  /** NAVIGATE PATH
   * Navigate path on name click
   * If navigate home with reInit else go to path
   * @param $event (any) check: boolean (home/path), path: string (name path)
   **/
  navigatePath($event) {
    if ($event.check) {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['index.php/s/', this.token ]));
    } else {
      const arraycheck = this.arrayPath.map(e => e.id == $event.path);
      const indexcheck = arraycheck.findIndex(e => e);
      const finalName = this.arrayPath.filter(e => e.id <= indexcheck).map(e => e.name).join('/');
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate(['index.php/s/', this.token ], { queryParams: { path: finalName } }));
    }
  }

  reload($event) {
    this.onLoad();
  }

  /*checkDuplicated(item: any){
    debugger;
    let arrayCheckOld = [], arrayCheckNew = [];
    if(item.length>0){
      let name = item[0].name;
      for(var a in this.data){
        if(this.data[a].completeName == name){
          arrayCheckOld.push(this.data[a]);
          arrayCheckNew.push(item[0]);
        }
      }
    }else{
      for(var a in item.files){
        for(var b in this.data){
          if(item.files[a].name == this.data[b]){
            arrayCheckOld.push(this.data[b]);
            arrayCheckNew.push(item.files[a]);
          }
        }
      }
    }
  }*/

  toggleLoadNew() {
    this.openLoadList = !this.openLoadList;
  }

  checkPassword() {
    if (this.inputvalue.length > 0) {
      this.spinner.show();
      this.fsService.getPasswordLink(this.token, this.inputvalue).subscribe((result: any) => {
        this.spinner.hide();
        this.done = true;
        if (!result.ispassword) {
          sessionStorage.setItem('pass', this.inputvalue);
          this.hasPassword = !this.hasPassword;
          this.alreadyDone = true;
          this.loadWithPass(result);
        } else {
          this._snackBar.open(this.langService.dictionary.psw_error, '', {
            duration: 4000,
            panelClass: 'toast-error'
          });
        }
      });
    } else {
      this._snackBar.open(this.langService.dictionary.pws_error_no_pws, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }
  }

  /** OPEN DIALOG AUDIO-VIDEO FILE **/
  openDialogAudioVideo(data): void {
    this.fsService.getUrl(data).subscribe((result: any) => {
      const dialogRef = this.dialog.open(AudioVideoComponent, {
        width: '50%',
        height: '50%',
        data: {data, href: result}
      });

      dialogRef.afterClosed().subscribe(result => {});
    });
  }

  createOnlyOffice(event: any) {
  }

}
