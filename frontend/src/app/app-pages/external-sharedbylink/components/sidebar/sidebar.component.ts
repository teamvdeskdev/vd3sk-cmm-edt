import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DialogDeleteFileComponent } from 'src/app/file-sharing/components/dialogs/delete-file/delete-file.component';
import { MovecopyDialogComponent } from '../movecopy-dialog/movecopy-dialog.component';
import { LinkTableSide, LinkSideTable } from 'src/app/file-sharing/services/sidebar.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { UploadLink } from 'src/app/app-pages/external-sharedbylink/components/services/link.service';
import { LanguageService } from 'src/app/app-services/language.service';

@Component({
  selector: 'app-sidebar-link',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() data;
  @Input() token;
  @Input() authorization;
  @Input() allPermission;
  @Input() completename;
  @Input() hidedownload;
  @Input() isSoloFile;
  @Input() password;

  isEmpty: boolean = false;
  multipleFile: boolean;
  info;
  isRow: boolean;
  nameMultiselect: string;
  deletedialogResponse : boolean;
  canUpdate = true;


  constructor(
    private LinkTableSide : LinkTableSide,
    private LinkSideTable : LinkSideTable,
    private dialog: MatDialog,
    private fsService: FileSharingService,
    private _uploadLink: UploadLink,
    public langService: LanguageService
  ) {
  }

  ngOnInit() {
    this.multipleFile = (Array.isArray(this.data))? true : false;
    this.isEmpty = (this.multipleFile)? true : false;

    this.LinkTableSide.change.subscribe(data => {
      if(data.bool == null){
        //Single file from icon click
        this.isEmpty = false;
        this.multipleFile = true;
        this.isRow = false;
        this.info = data.array;
      }else if(Array.isArray(data.array)){
        //Multiple file from check/decheck all click
        if(data.array.length>0){
          this.isEmpty = false;
          this.multipleFile = true;
          this.info = data.array;
          this.isRow = true;
          this.nameMultiselect = this.getElementsNumberType();
          for(var i in this.info){
            if(!this.info[i].permissions.isCrearable){
              this.canUpdate = false;
              break;
            }
          }
        }else{
          this.isEmpty = true;
          this.multipleFile = false;
          this.info = data.array;
          this.isRow = false;
          this.nameMultiselect = '';
        }
      }else if(typeof data.array === 'object'){
        //Single file from check/decheck
        if(data.bool){
          if(!Array.isArray(this.info)) this.info = [];
          this.info.push(data.array);
          this.isEmpty = false;
          this.multipleFile = true;
          this.isRow = true;
          this.nameMultiselect = this.getElementsNumberType();
        }else{
          if(this.info.length==1){
            this.isEmpty = true;
            this.multipleFile = false;
            this.info = data.array;
            this.isRow = false;
            this.nameMultiselect = '';
          }else{
            for(var a in this.info){
              if(this.info[a].id == data.array.id){
                this.info.splice(a, 1);
                break;
              }
            }
            this.isEmpty = false;
            this.multipleFile = true;
            this.isRow = true;
            this.nameMultiselect = this.getElementsNumberType();
          }
        }
      }
    });
  }

  /** GET ELEMENTS NUMBER TYPE
   * Get the complete string for multisected files on sidebar
   **/
  getElementsNumberType(){
    let folders=0, files=0;
    for(var i in this.info){
      if(!this.info[i].isfile) folders = folders + 1;
      else files = files + 1;
    }

    let folderString = (folders>1)? (folders +' '+ this.langService.dictionary.folders): ((folders>0)? (folders +' '+ this.langService.dictionary.folder) : '');
    let fileString = (files>1)? (files +' '+ this.langService.dictionary.files): ((files>0)? (files +' '+ this.langService.dictionary.file) : '');
    let selectedString = (folders+files>1)? this.langService.dictionary.selected_plural : this.langService.dictionary.selected_singular;
    let andString = (folderString && fileString)? (' '+this.langService.dictionary.and+' ') : '';
    let string = folderString + andString + fileString +' '+ selectedString;
    return string;
  }

  /** OPEN DIALOG ON DELETE FILE/FOLDER **/
  openDialogDelete(): void {    
    const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
      width: 'fit-content',
      height: 'fit-content',
      data: {string: this.langService.dictionary.delete_dialog_file, result: this.deletedialogResponse}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.deletedialogResponse = result;
      if(this.deletedialogResponse){
        let arrayDelete = (Array.isArray(this.info))? this.info : [this.info];
        let data = {
          type: 'delete',
          data: arrayDelete,
        };
        this._uploadLink.toggle(data);
        this.closeSidebar();
      }
    });
  }

  /** FILE/FOLDER DONWLOAD **/
  filefolderDownload(){
    if(this.isSoloFile){
      this.fsService.downloadFilePublic('/', this.data.completeName, this.token, this.isSoloFile, this.password);
    }else{
      if(!this.info){
        this.fsService.downloadFilePublic('/', this.data.completeName, this.token, this.isSoloFile, this.password);
      }else{
        if(Array.isArray(this.info)){
          let arrayFiles = [];
          let usedpath;
          for(var i in this.info){
            if(!usedpath){
              let path = '/' + decodeURIComponent(this.info[i].completepath);
              usedpath = path.replace(this.info[i].completeName,'');
            } 
            arrayFiles.push('"' + this.info[i].completeName + '"');
          }
          this.fsService.downloadFilePublic(usedpath, arrayFiles, this.token, this.isSoloFile, this.password);
        }else{
          let path = '/' + decodeURIComponent(this.info.completepath);
          let usedpath = (path.includes(this.info.completeName+'/'))? path.replace(this.info.completeName+'/','') : path.replace(this.info.completeName,'');
          this.fsService.downloadFilePublic(usedpath, this.info, this.token, this.isSoloFile, this.password);
        }
      }
    }
  }

  toggleRenameFile(){
    this.info.rename = !this.info.rename;
    this.LinkSideTable.toggle(this.info.id, 'rename', '');
  }

  /** OPEN DIALOG ON COPY/MOVE FILE/FOLDER **/
  openDialogMoveCopy(): void {
    let data;
    if(!Array.isArray(this.info)){
      let path = ((this.info.isfile)?'/':'') + decodeURIComponent(this.info.completepath);
      let usedpath = path.replace(this.info.completeName,'');
      data = {path: usedpath, name: this.info.name, extension: this.info.extension, isfile: this.info.isfile};
    }else {
      if(!data) data = [];
      for(var a in this.info){
        let path = ((this.info[a].isfile)?'/':'') + decodeURIComponent(this.info[a].completepath);
        let usedpath = path.replace(this.info[a].completeName,'');
        data.push({path: usedpath, name: this.info[a].name, extension: this.info[a].extension, isfile: this.info[a].isfile});
      }
    }
    
    const dialogRef = this.dialog.open(MovecopyDialogComponent, {
      width: '70%',
      height: '70%',
      data: {data:data, authorization: this.authorization, completename: this.completename},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.destination.length>0 && result.event.length>0){
        if(result.event=='m'){
          if(this.info.length>0){
            for(var i=0; i<this.info.length; i++){
              let source = '/' + this.info[i].completepath;
              let destination = result.destination + this.info[i].completeName;
              this.fsService.moveFilePublic(source, destination, this.authorization).subscribe((result: any) => {});
              this.LinkSideTable.toggle(this.info[i].id, 'move', '');
            }
          }else{
            let source = '/' + this.info.completepath;
            let destination = result.destination + this.info.completeName;
            this.fsService.moveFilePublic(source, destination, this.authorization).subscribe((result: any) => {});
            this.LinkSideTable.toggle(this.info.id, 'move', '');
          }
          this.closeSidebar();
        }else{
          let others = {
            destination: result.destination,
          };
  
          if(this.info.length>0){
            let idArray = [];
            for(var k in this.info){
              idArray.push(this.info[k]);
            }
            this.LinkSideTable.toggle(idArray, 'copy', others);
          }else{
            this.LinkSideTable.toggle(this.info, 'copy', others);
          }
        }            
      }
    });
  }

  /* CLOSE SIDEBAR
   *  Return empty sidebar (only used on table)
   */
  closeSidebar(){
    this.isEmpty = true;
    this.multipleFile = false;
    this.info = [];
    this.isRow = false;
    this.nameMultiselect = '';
  }

}
