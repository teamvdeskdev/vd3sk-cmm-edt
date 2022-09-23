import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../dictionary/dictionary';
import { Utilities, DuplicateFiles } from 'src/app/file-sharing/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-duplicate-file',
  templateUrl: './duplicate-file.component.html',
  styleUrls: ['./duplicate-file.component.scss']
})
export class DuplicateFileComponent implements OnInit {
  util = new Utilities();
  dict = new Dictionary();
  deny: string = this.dict.getDictionary('cancel');
  confirm: string = this.dict.getDictionary('confirm');
  subtitle1: string = this.dict.getDictionary('stringDuplicate1');
  subtitle2: string = this.dict.getDictionary('stringDuplicate2');
  newFile: string = this.dict.getDictionary('new_file');
  oldFile: string = this.dict.getDictionary('old_file');
  no_select: string = this.dict.getDictionary('no_select');
  title: string;
  duplicate: any;
  original: any;
  rework: any = [];
  allArray: any = [];
  old: boolean = false;
  new: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DuplicateFileComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.original = this.data.data;
    this.duplicate = this.data.files;
    let countFiles = this.original.length;
    let file = (countFiles>1)? this.dict.getDictionary('files') : this.dict.getDictionary('file');
    this.title = countFiles + ' ' + file + ' ' + this.dict.getDictionary('conflict');
    this.original.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    this.rework = this.util.copyWithoutType(this.duplicate);
    this.rework.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

    for(var a=0; a<this.rework.length; a++){
      let obj = new DuplicateFiles();
      obj.name = this.rework[a].name;
      obj.image = this.rework[a].image;
      obj.classimage = this.rework[a].classimage;
      obj.dateOriginal = this.original[a].dateReal;
      obj.dateDuplicate = this.rework[a].date;
      obj.weightOriginal = this.original[a].weight;
      obj.weightDuplicate = this.rework[a].weight;

      this.allArray.push(obj);
    }
  }

  /** SET ALL OLD
   * Select/deselect all old elements
   **/
  setAllOld(){
    this.old = !this.old;
    for(var i in this.allArray){
      this.allArray[i].old = this.old;
    }
  }

  /** SET ALL NEW
   * Select/deselect all new elements
   **/
  setAllNew(){
    this.new = !this.new;
    for(var i in this.allArray){
      this.allArray[i].new = this.new;
    }
  }

  onConfirmClick(): void {
    let checkOld = this.allArray.filter(opt => opt.old).map(opt => opt.old);
    let checkNew = this.allArray.filter(opt => opt.new).map(opt => opt.new);
    if(checkOld.length>0 || checkNew.length>0){
      this.dialogRef.close(this.allArray);
    }else{
      this._snackBar.open(this.no_select, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close([]);
  }

}
