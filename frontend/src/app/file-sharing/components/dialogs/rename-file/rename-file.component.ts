import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../dictionary/dictionary';

@Component({
  selector: 'app-rename-file',
  templateUrl: './rename-file.component.html',
  styleUrls: ['./rename-file.component.scss']
})
export class RenameFileComponent implements OnInit {
  dict = new Dictionary();
  name: string;

  stringCancel: string = this.dict.getDictionary('cancel');
  stringSave: string = this.dict.getDictionary('save');
  stringTitle: string = this.dict.getDictionary('title_renamefiles');
  stringSubtitle: string = this.dict.getDictionary('subtitle_ renamefiles');

  constructor(
    public dialogRef: MatDialogRef<RenameFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.data = data;
    }
  }

  ngOnInit() {
    this.name = (this.data.realname)? this.data.realname : this.data.name;
  }

  onConfirmClick(): void {
    this.name = this.name.trim();
    if(this.name != this.data.realname){
      let sendData = {
        done: true,
        name: this.name
      }
      this.dialogRef.close(sendData);
    }
  }

  onNoClick(): void {
    let sendData = {
      done: false
    }
    this.dialogRef.close(sendData);
  }

}
