import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from '../../../dictionary/dictionary';
import { FileSharingService } from '../../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../../utilities';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogTableComponent } from '../../dialog-table/dialog-table.component';
import { TableComponent } from '../../table/table.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateService } from 'src/app/file-sharing/services/sidebar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-dialog-copy-file',
  templateUrl: './copy-file.component.html',
  styleUrls: ['./copy-file.component.scss']
})
export class DialogMoveCopyFileComponent implements OnInit {

  dict = new Dictionary();
  @ViewChild('valuenamefolder') searchInput: ElementRef;
  class: string;
  
  noData: boolean;
  util = new Utilities();
  dataValue: any = [];
  movepath: string = '';
  source: string;
  getdata: any;
  name: string;
  inputFolder: boolean;
  isLoading: boolean = false;
  isTim: boolean;
  globalsVar: any;
  displayedColumns: string[] = ['id', 'image', 'name', 'dateFunc', 'weight'];
  dataSource: MatTableDataSource<FileSharingData>;
  static dataSourceStatic;
  hideMoveButton = false;
  sortUpdate: boolean = false;

  nofolder: string = this.dict.getDictionary('no_folder');
  folderName: string = this.dict.getDictionary('folder_name');
  createFolder: string = this.dict.getDictionary('create_folder');
  destinationString: string = this.dict.getDictionary('choose_destination');
  copy: string = this.dict.getDictionary('copy');
  move: string = this.dict.getDictionary('move');
  nameString: string = this.dict.getDictionary('name');
  fileweight: string = this.dict.getDictionary('size');
  lastupdate: string = this.dict.getDictionary('last_update');
  dictLabelShared: string = this.dict.getDictionary('label_shared');


  constructor(
    private fsService: FileSharingService,
    public dialogRef: MatDialogRef<DialogMoveCopyFileComponent>,
    private spinner: NgxSpinnerService,
    private _create: CreateService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.globalsVar = globals;
    if (data) {
      if(Array.isArray(data.data)){
        this.getdata = data.data;
      }else{
        this.source = data.data.path + data.data.name + data.data.extension;
        this.name = data.data.name;
        this.getdata = data.data;
      }
      if(data.noMove) {
        this.hideMoveButton = true;
      } else {
        this.hideMoveButton = false;
      }
    }
   }

  ngOnInit() {
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    this.spinner.show();
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

  /** SORT EVERYTHING
   * Sort table columns for type (name, size, date)
   * @param type : string
   **/
   sortEverything(type: string){
    if(this.sortUpdate){
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : -1);
      else if(type=="update") this.dataValue.sort((a, b) => (b.lastUpdate > a.lastUpdate) ? 1 : -1);
      else if(type=="size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) > parseInt(a.fileWeight)) ? 1 : -1);
      this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
      this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }else{
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() < a.name.toLowerCase()) ? 1 : -1);
      else if(type=="update") this.dataValue.sort((a, b) => (b.lastUpdate < a.lastUpdate) ? 1 : -1);
      else if(type=="size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) < parseInt(a.fileWeight)) ? 1 : -1);
      this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
      this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }    
  }

  /** GET ALL FOLDERS
   * Call service all file on home
   * Response changed to return only folders
   **/
  async getAllFolders(){
    let waitService = await this.fsService.getAllFiles('').toPromise();
    if(waitService.status == 200){
      let response = waitService.body.multistatus.response;

      if(response.length>0 && !response.href){
        this.noData = false;

        if(!Array.isArray(this.getdata)) this.dataValue = this.util.getResponseAllFolder(response, false, this.name);
        else this.dataValue = this.util.getResponseAllFolder(response, false, this.getdata);

        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
        this.dataSource.data = this.dataValue;
        this.spinner.hide();
        this.isLoading = true;
        this.movepath = '';
      }else{
        this.noData = true;
        this.spinner.hide();
        this.isLoading = true;
      }
    }
  }

  /** NAVIGATE FOLDER
   * Navigate folder (not home)
   **/
  navigateFolder($event){
    this.isLoading = false;
    this.spinner.show();
    if(this.inputFolder) this.toggleInput();
    let path;
    if(!$event){
      this.getAllFolders();
    }else{
      if($event === Object($event)) this.movepath = $event.result;
      else{
        if(this.movepath.length>0) this.movepath = this.movepath + '/' + $event;
        else this.movepath = $event;
      }

      path = this.movepath;

      this.fsService.getOpenFolder(path).subscribe((result: any) => {
        let response = result.body.multistatus.response;
        if(response.length>0 && !response.href){
          this.noData = false;

          if(!Array.isArray(this.getdata)) this.dataValue = this.util.getResponseAllFolder(response, false, this.name);
          else this.dataValue = this.util.getResponseAllFolder(response, false, this.getdata);

          if(this.dataValue.length>0){
            this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
            this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
            this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
            this.dataSource.data = this.dataValue;
          }else{
            this.noData = true;
            this.dataValue = [];
            this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
            this.dataSource.data = this.dataValue;
          }
        }else{
          this.noData = true;
          this.dataValue = [];
          this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
          this.dataSource.data = this.dataValue;
        }
        this.spinner.hide();
        this.isLoading = true;
      });
    }
  }

  toggleInput(){
    this.inputFolder = !this.inputFolder;
  }

  createNewFolder(name: string){
    this.isLoading = false;
    this.spinner.show();
    if(name.length>0){
      let folder = ( !! this.movepath)? this.movepath + '/' : '';
      this.dataValue.unshift(this.util.getFolderElementCopy(name, folder));
      if(this.noData) this.noData = !this.noData;
      this.dataSource = DialogTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      let href = window.location.href;
      if(href.includes('all-files')){
        let data = {
          name: name,
          type: 'folder',
          data: '',
          path: folder
        }
        this._create.toggle(data); 
      }else{
        this.fsService.createFolder(folder + name).subscribe((result: any) => {});
        /*TableComponent.createNewFolder(name);*/
      }      
      this.toggleInput();
      this.spinner.hide();
      this.isLoading = true;
    }
  }

  /** ON CONFIRM CLICK
   * @param $event type event
   * Send data back to sidebar
   * event : type event: 'm': move / 'c': copy
   * destination : new path of file/folder (no mane and extension)
   **/
  onConfirmClick($event: string): void {
    let movepath = (this.movepath.charAt(this.movepath.length-1) == '/')? this.movepath : this.movepath +'/';
    let data = {
      destination: movepath,
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
