import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from '../../../file-sharing/dictionary/dictionary';
import { FileSharingService } from '../../../file-sharing/services/file-sharing.service';
import { Utilities } from '../../../file-sharing/utilities';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogTableComponent } from '../../../file-sharing/components/dialog-table/dialog-table.component';
import { TableComponent } from '../../../file-sharing/components/table/table.component';


@Component({
  selector: 'app-vshare-upload-dialog',
  templateUrl: './vshare-upload-dialog.component.html',
  styleUrls: ['./vshare-upload-dialog.component.scss']
})
export class VshareUploadDialogComponent implements OnInit {

  dict = new Dictionary();
  @ViewChild('valuenamefolder') searchInput: ElementRef;
  class: string;
  noData: boolean;
  util = new Utilities();
  dataValue = [];
  movepath = '';
  source: string;
  getdata: any;
  name: string;
  inputFolder: boolean;
  dataSend: any;

  // DICTIONARY VARIABLES ---
  dictCancel: string = this.dict.getDictionary('cancel');
  dictLoad: string = this.dict.getDictionary('confirm')
  // ---

  constructor(
    private fsService: FileSharingService,
    public dialogRef: MatDialogRef<VshareUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      if (Array.isArray(data)) {
        this.getdata = data;
      } else {
        this.source = data.path + data.name + data.extension;
        this.name = data.name;
        this.getdata = data;
      }
    }
   }

  ngOnInit() {

    this.class = 'dialog';
    this.inputFolder = false;

    // Check if old path is HOME or another folder
    if (Array.isArray(this.getdata)) {
      for (const a in this.getdata) {
        if (this.getdata[a].path == '/') {
          this.getAllFolders();
          break;
        } else {
          this.navigateFolder(this.getdata[a].path);
          break;
        }
      }
    } else {
      (this.getdata.path == '/') ? this.getAllFolders() : this.navigateFolder(this.getdata.path);
    }
  }

  /** GET ALL FOLDERS
   * Call service all file on home
   * Response changed to return only folders
   **/
  getAllFolders(){
    this.fsService.getAllFiles('').subscribe((result: any) => {
      const response = result.body.multistatus.response;

      if (response.length > 0 && !response.href) {
        this.noData = false;

        if (!Array.isArray(this.getdata)) {
          this.dataValue = this.util.getResponseAllFiles(response, false, this.name);
        } else {
          this.dataValue = this.util.getResponseAllFolder(response, false, this.getdata);
        }

        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        this.movepath = '';
      } else {
        this.noData = true;
      }
    });
  }

  /** NAVIGATE FOLDER
   * Navigate folder (not home)
   **/
  navigateFolder($event){
    if(this.inputFolder) this.toggleInput();
    let path;
    if(!$event){
      this.getAllFolders();
    }else{
      if(!$event.isfile){
        if($event === Object($event)) this.movepath = $event.name;
        else this.movepath = this.movepath + '/' + $event;
  
        path = this.movepath;
  
        this.fsService.getOpenFolder(path).subscribe((result: any) => {
          let response = result.body.multistatus.response;
          if(response.length>0 && !response.href){
            this.noData = false;
  
            this.dataValue = this.util.getResponseAllFiles(response, false, this.movepath);
  
            if(this.dataValue.length>0){
              this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
              this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
            }else{
              this.noData = true;
            }
          }else{
            this.noData = true;
          }
        });
      }else{
        this.dataSend = $event;
      }
    }
  }

  toggleInput(){
    this.inputFolder = !this.inputFolder;
  }

  /** ON CONFIRM CLICK
   * @param $event type event
   * Send data back to sidebar
   * event : type event: 'm': move / 'c': copy
   * destination : new path of file/folder (no mane and extension)
   **/
  onConfirmClick(): void {
    if(this.dataSend){
      this.dialogRef.close(this.dataSend);
    }
  }

  /** ON NO CLICK
   * Close dialog on click or click outside dialog
   **/
  onNoClick(): void {
    let data = {
      source: '',
      destination: ''
    }
    this.dialogRef.close(data);
  }

  save() {

  }

}

