import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Utilities } from 'src/app/file-sharing/utilities';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { LanguageService } from 'src/app/app-services/language.service';

@Component({
  selector: 'app-movecopy-dialog',
  templateUrl: './movecopy-dialog.component.html',
  styleUrls: ['./movecopy-dialog.component.scss']
})
export class MovecopyDialogComponent implements OnInit {

  @ViewChild('valuenamefolder') searchInput: ElementRef;
  class: string;
  noData: boolean;
  util = new Utilities();
  dataValue;
  source: string;
  getdata: any;
  name: string;
  inputFolder: boolean;
  completename: string;
  arrayPath = [];
  authorization: string;

  constructor(
    private fsService: FileSharingService,
    public langService: LanguageService,
    public dialogRef: MatDialogRef<MovecopyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.getdata = data.data;
      this.authorization = data.authorization;
      this.completename = data.completename;
    }
   }

  ngOnInit() {
    this.arrayPath = [];
    this.class = 'dialog';
    this.inputFolder = false;

    // Check if old path is HOME or another folder
    if(Array.isArray(this.getdata)){
      for(var a in this.getdata){
        if(this.getdata[a].path == '/'){
          this.getAllFolders();
          break;
        }else{
          this.navigateFolder(this.getdata[a].path);
          break;
        }
      }
    }else{
      if(this.getdata.path == '/') this.getAllFolders();
      else this.navigateFolder(this.getdata.path);
    }
  }

  /** GET ALL FOLDERS
   * Call service all file on home
   * Response changed to return only folders
   **/
  getAllFolders(){
    this.fsService.dataFilePublic('', this.data.authorization).subscribe((result: any) => {
      let response = result.body.multistatus.response;

      if(response.length>0 && !response.href){
        this.noData = false;

        let checkArrayName = [];
        if(Array.isArray(this.getdata)){
          for(var i in this.getdata){
            if(!this.getdata[i].isfile){
              checkArrayName.push(this.getdata[i].name);
            }
          }
        }else{
          checkArrayName.push(this.getdata.name);
        }

        if(!Array.isArray(this.getdata)) this.dataValue = this.util.getPublicFolder(response, this.data.data, checkArrayName);
        else this.dataValue = this.util.getPublicFolder(response, '', checkArrayName);

        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
      }else{
        this.noData = true;
      }
    });
  }

  /** NAVIGATE FOLDER
   * Navigate folder (not home)
   **/
  navigateFolder($event){
    let name = '/'+ decodeURIComponent($event.completepath);
    let finalName = (this.arrayPath.length>0)? this.arrayPath.map(e => e.name).join('/') + name : name;
    this.arrayPath.push({id: this.arrayPath.length, name: name.replace(/\//g, '')});
    this.fsService.openFolderPublic(finalName, this.authorization).subscribe((result: any) => {
      if(Array.isArray(result.body.multistatus.response)){
        this.dataValue = this.util.getPublicFolder(result.body.multistatus.response, '', []);
        this.dataValue.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
        this.noData = false;
      }else{
        this.noData = true;
        this.dataValue = [];
      }
    });
  }

  navigatePath($event){
    if($event.check){
      this.ngOnInit();
    }else{
      let arraycheck = this.arrayPath.map(e => e.id == $event.path);
      let indexcheck = arraycheck.findIndex(e => e);
      let finalName = this.arrayPath.splice(0, indexcheck).join('/');
      this.fsService.openFolderPublic(finalName, this.authorization).subscribe((result: any) => {
        if(Array.isArray(result.body.multistatus.response)){
          this.dataValue = this.util.getPublicFolder(result.body.multistatus.response, '', []);
          this.dataValue.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
          this.dataValue.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
          this.noData = false;
        }else{
          this.noData = true;
          this.dataValue = [];
        }
      });
    }
  }

  toggleInput(){
    this.inputFolder = !this.inputFolder;
  }

  createNewFolder(name: string){
    /*if(name.length>0){
      let folder = ( !! this.movepath)? this.movepath + '/' : '';
      DialogTableComponent.dataSourceStatic.data.push(DialogTableComponent.utilStatic.getFolderElement(name, false));
      DialogTableComponent.dataSourceStatic.filter = "";
      DialogTableComponent.fsServiceStatic.createFolder(folder + name).subscribe((result: any) => {});
      TableComponentLink.createNewFolder(name);
      this.toggleInput();
    }*/
  }

  /** ON CONFIRM CLICK
   * @param $event type event
   * Send data back to sidebar
   * event : type event: 'm': move / 'c': copy
   * destination : new path of file/folder (no mane and extension)
   **/
  onConfirmClick($event: string): void {
    let destination = (this.arrayPath.length>0)? this.arrayPath.map(e => e.name).join('/') : '';
    let data = {
      destination: destination +'/',
      event: $event
    }
    this.dialogRef.close(data);
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

}
