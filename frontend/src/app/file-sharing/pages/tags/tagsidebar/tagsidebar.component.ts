import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { DialogDeleteFileComponent } from 'src/app/file-sharing/components/dialogs/delete-file/delete-file.component';
import { DialogMoveCopyFileComponent } from 'src/app/file-sharing/components/dialogs/copy-file/copy-file.component';
import { PasswordDialogComponent } from 'src/app/file-sharing/components/dialogs/password-dialog/password-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tagsidebar',
  templateUrl: './tagsidebar.component.html',
  styleUrls: ['./tagsidebar.component.scss']
})
export class TagsidebarComponent implements OnInit {
  _dictionary = new Dictionary();
  isEmpty: boolean = true;
  tabSelectedIndex: number = 0;

  @Input() data: any;
  @Output() togglefavorite: EventEmitter<any> = new EventEmitter();
  @Output() deletefile: EventEmitter<any> = new EventEmitter();
  @Output() downloaddata: EventEmitter<any> = new EventEmitter();
  @Output() movedata: EventEmitter<any> = new EventEmitter();
  @Output() copydata: EventEmitter<any> = new EventEmitter();
  @Output() cryptdata: EventEmitter<any> = new EventEmitter();
  @Output() renamedata: EventEmitter<any> = new EventEmitter();

  text: string = this._dictionary.getDictionary('info_file_folder');
  rename: string = this._dictionary.getDictionary('rename');
  movecopy: string = this._dictionary.getDictionary('movecopy');
  addFavorites: string = this._dictionary.getDictionary('add_favorites');
  removeFavorites: string = this._dictionary.getDictionary('remove_favorites');
  download: string = this._dictionary.getDictionary('download');
  mail: string = this._dictionary.getDictionary('send_by_mail');
  delete: string = this._dictionary.getDictionary('delete');
  deleteAll: string = this._dictionary.getDictionary('deleteAll');
  restore: string = this._dictionary.getDictionary('restore');
  labels: string = this._dictionary.getDictionary('labels');
  deleteDialog: string = this._dictionary.getDictionary('delete_dialog_file');
  encipher: string;
  decipher: string;

  constructor(
    private _services: FileSharingService,
    private _dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    let data = changes.data;
    if(data.previousValue != undefined){
      if(data.previousValue && data.currentValue.length==0){
        this.data = data.currentValue;
        this.encipher = (this.data.isFile)? this._dictionary.getDictionary('encipher_file') : this._dictionary.getDictionary('encipher_folder');
        this.decipher = (this.data.isFile)? this._dictionary.getDictionary('decipher_file') : this._dictionary.getDictionary('decipher_folder');
        this.isEmpty = !this.isEmpty;
      }else if((!Array.isArray(data.previousValue)) && data.currentValue.id != data.previousValue.id){
        this.data = data.currentValue;
        this.encipher = (this.data.isFile)? this._dictionary.getDictionary('encipher_file') : this._dictionary.getDictionary('encipher_folder');
        this.decipher = (this.data.isFile)? this._dictionary.getDictionary('decipher_file') : this._dictionary.getDictionary('decipher_folder');
      }else if(data.currentValue){
        this.data = data.currentValue;
        this.encipher = (this.data.isFile)? this._dictionary.getDictionary('encipher_file') : this._dictionary.getDictionary('encipher_folder');
        this.decipher = (this.data.isFile)? this._dictionary.getDictionary('decipher_file') : this._dictionary.getDictionary('decipher_folder');
        this.isEmpty = !this.isEmpty;
      }
    }
  }

  /** ADD REMOVE FAVORITE **/
  addremoveFavorite(){
    this.togglefavorite.emit(this.data);
  }

  openDialogDelete(){
    const dialogRef = this._dialog.open(DialogDeleteFileComponent, {
      width: 'fit-content',
      height: 'fit-content',
      data: {string: this.deleteDialog}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deletefile.emit(this.data);
      }      
    });
  }

  filefolderDownload(){
    this.downloaddata.emit(this.data);
  }

  openDialogMoveCopy(): void {
    let data = {
      path: this.data.path,
      name: this.data.name,
      extension: this.data.extension,
    };
    
    const dialogRef = this._dialog.open(DialogMoveCopyFileComponent, {
      width: '70%',
      height: '70%',
      data: {data:data, link: false},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.destination.length>0 && result.event.length>0){
        if(result.event=='m'){
          this.movedata.emit({
            source: this.data.path,
            destination: result.destination,
            name: this.data.completename,
            data: this.data
          });           
        }else{
          this.copydata.emit({
            source: this.data.path,
            destination: result.destination,
            name: this.data.completename,
            data: this.data
          });
        }            
      }
    });
  }

  /** OPEN DIALOG CRYPT
   * Open the password dialog then send data to father element
   * @param check (boolean) used for check if is crypt/decrypt
   **/
  openDialogCrypt(check: boolean): void{
    const dialogRef = this._dialog.open(PasswordDialogComponent, {
      width: '370px',
      height: '270px',
      data: {check: check, extension: this.data.extension, weight: this.data.weightHuman},
    });
    dialogRef.afterClosed().subscribe(password => {
      if(password){
        this.data.isCoding = true;
        this.cryptdata.emit({
          check: check,
          data: this.data
        });
      }      
    });
  }

  /** FILE FOLDER RENAME
   * Send data to father element
   **/
  filefolderRename(){
    this.renamedata.emit(this.data);
  }

  /** NAVIGATE FOLDER
   * Navigate to folder of a file
   **/
  navigateFolder(){
    if(!this.data.path || this.data.path=='/'){
      this.router.navigate(['filesharing', 'all-files']);
    }else{
      let array = this.data.path.split('/');
      for(var i=0; i<array.length; i++){
        if(array[i].length==0){
          array.splice(i,1);
          i--;
        }
      }
      let string = array.join('/');
      this.router.navigate(['filesharing', 'folder', string], { queryParams: { name: string, home: 'all-files' } });
    }    
  }

  changeSidebarTab() {}

}
