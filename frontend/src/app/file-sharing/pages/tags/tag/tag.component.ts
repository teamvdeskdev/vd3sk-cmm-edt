import { Component, OnInit } from '@angular/core';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Utilities, FileSharingData } from 'src/app/file-sharing/utilities';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  data: boolean;
  done: boolean = true;
  dataValue: any = [];
  getpage: string = 'labels';
  _dict = new Dictionary();
  _utility = new Utilities();
  sendSidebar: any = [];

  moveSuccess: string = this._dict.getDictionary('move_done');

  constructor(
    private _services: FileSharingService,
    private _spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.showLoader();
    this._services.getListLabels().subscribe((result: any) => {
      if(result.status == 200){
        let response = result.body.multistatus.response;
        this.dataValue = this._utility.getTags(response);
        this.data = true;
        this.hideLoader();
      }else{
        this.data = false;
        this.hideLoader();
      }
    });
  }

  /** SHOW LOADER **/
  showLoader(){
    this.done = false;
    this._spinner.show();
  }

  /** HIDE LOADER **/
  hideLoader(){
    this._spinner.hide();
    this.done = true;
  }

  /** GET TAG FILES
   * Close all opened
   * Get list of all files with tag
   **/
  getTagFiles(element: any){
    if(element.open){
      element.open = !element.open;
    }else{
      this.showLoader();
      this.closeAlreadyOpen();
      if(element.fileList.length>0){
        element.open = !element.open;
        this.hideLoader();
      }else{
        this._services.getFilesByTags(element.id).subscribe((result: any) => {
          if(result.status == 200){
            if(result.body.multistatus.response){
              let response = result.body.multistatus.response;
              element.fileList = (!Array.isArray(response))? this._utility.getFilesByTags([response]) : this._utility.getFilesByTags(response);
              element.open = !element.open;
              this.hideLoader();
            }else{
              element.open = !element.open;
              this.hideLoader();
            }
          }else{
            element.open = !element.open;
            this.hideLoader();
          }
        });
      }
    }    
  }

  /** CLOSE ALREADY OPEN 
   * Before opening another set open of element on close
   **/
  closeAlreadyOpen(){
    for(var i in this.dataValue){
      if(this.dataValue[i].open){
        this.dataValue[i].open = !this.dataValue[i].open;
        break;
      }
    }
  }

  /** SEND TO SIDEBAR 
   * Send data from table to sidebar
   **/
  sendToSidebar($event: any){
    this.sendSidebar = $event;
  }

  /** ADD REMOVE FAVORITE
   * Toggle favorite on file/folder
   * Sidebar event
   **/
  addremoveFavorite($event: any){
    this.showLoader();
    let name = $event.path + $event.completename;
    this._services.addToFavorite(name, $event.favorite).subscribe((result: any)=>{
      if(result.status == 200){
        $event.favorite = !$event.favorite;
        this.hideLoader();
      }else{
        this.hideLoader();
      }
    });
  }

  /** DELETE DATA
   * Delete file or folder
   * Sidebar event
   **/
  deleteData($event: any){
    this.showLoader();
    let name = $event.path + $event.completename;
    this._services.delete(name).subscribe((result: any) => {
      if(result.status.toLowerCase() == 'success'){
        $event.hide = !$event.hide;
        this.sendSidebar = [];
        this.hideLoader();
      }else{
        this.hideLoader();
      }
    });
  }

  /** DOWNLOAD DATA
   * Download element
   * @param $event (any) element
   **/
  downloadData($event: any){
    let uri = $event.path + $event.completename;
    let name = $event.path + $event.name;
    this._services.download(uri, name, $event.extension, $event.name);
  }

  /** MOVE DATA
   * Move element from a folder to another
   * @param $event (any) obj with data, completename file, source and new destination
   **/
  moveData($event: any){
    this.showLoader();
    this._services.moveFileFolder($event.source + $event.name, $event.destination + $event.name).subscribe((result: any) => {
      if(result.status == 'success'){
        $event.data.path = $event.destination;
        this.hideLoader();
        this._snackBar.open(this.moveSuccess, '', {
          duration: 4000,
          panelClass: 'toast-success'
        });
      }
    }); 
  }

  copyData($event: any) {
    /*if (Array.isArray(val)) {
      for (var a = 0; a < val.length; a++) {
        let count = 1;
        for (var b in this.data) {
          if ((this.data[b].name.includes(val[a].name) && this.data[b].name.includes('(copy')) && this.data[b].extension == val[a].extension) {
            count = count + 1;
          }
        }

        let source = val[a].path + val[a].name + val[a].extension;
        let name = val[a].name + ' (copy ' + count + ')' + val[a].extension
        let destination = others.destination + name;
        this.fsService.copyFile(source, destination).subscribe((result: any) => {
          if(result.status == 'success'){
            this._snackBar.open(this.copySuccess, '', {
              duration: 4000,
              panelClass: 'toast-success'
            });
          }
         });
      }
      if (!others.destination || others.destination == '/') this.reload.emit('');
    } else {
      let count = 1
      for (var i in this.data) {
        if ((this.data[i].name.includes(val.name) && this.data[i].name.includes('(copy')) && this.data[i].extension == val.exte) {
          count = count + 1;
        }
      }

      let source = $event.source + $event.name;
      let name = val.name + ' (copy ' + count + ')' + val.exte
      let destination = $event.destination + name;
      this._services.copyFile(source, $event.destination).subscribe((result: any) => {
        if(result.status == 'success'){
          this._snackBar.open(this.copySuccess, '', {
            duration: 4000,
            panelClass: 'toast-success'
          });
        }        
      });
    }*/
  }

  /** CRYPT DATA
   * Crypt/decrypt element
   * @param $event (any) obj with data and check
   **/
  cryptData($event: any){
    this.showLoader();
    if($event.check){
      if($event.data.isFile){
        this._services.encryptFile($event.data.id).subscribe((result: any) => {
          $event.data.isCoding = false;
          if(result.Dto.encrypted) $event.data.coded = true;
          this.hideLoader();
        });
      }else{
        this._services.encryptFolder($event.data.id).subscribe((result: any) => {
          $event.data.isCoding = false;
          if(result.Dto.encrypted) $event.data.coded = true;
          this.hideLoader();
        });
      }
    }else{
      if($event.data.isFile){
        this._services.decryptFile($event.data.id).subscribe((result: any) => {
          $event.data.isCoding = false;
          $event.data.name = $event.data.name.replace('.ven', '');
          $event.data.completename = $event.data.completename.replace('.ven', '');
          if(result.Dto.decrypted) $event.data.coded = false;
          this.hideLoader();
        });
      }else{
        this._services.decryptFolder($event.data.id).subscribe((result: any) => {
          $event.data.isCoding = false;
          if(result.Dto.decrypted) $event.data.coded = false;
          this.hideLoader();
        });
      }
    }
  }

  renameToggle($event: any){
    $event.rename = !$event.rename;
  }

  renameData($event: any){
    this.showLoader();
    let data = $event.data;
    let path = (data.path == '/') ? '' : data.path;
    let source = path + data.completename;
    let destination = path + $event.name + data.extension;
    this._services.renameFileFolder(source, destination).subscribe((result: any) => {
      if(result.status.toLowerCase() == 'success'){
        data.completename = data.completename.replace(data.name, $event.name);
        data.name = $event.name;
        data.rename = !data.rename;
      }
      this.hideLoader();
    });
  }

}
