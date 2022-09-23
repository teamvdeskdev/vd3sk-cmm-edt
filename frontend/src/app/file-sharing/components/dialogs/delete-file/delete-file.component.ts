import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../dictionary/dictionary';

@Component({
  selector: 'app-dialog-delete-file',
  templateUrl: './delete-file.component.html',
  styleUrls: ['./delete-file.component.scss']
})
export class DialogDeleteFileComponent implements OnInit {
  dict = new Dictionary();
  message: string;
  response: boolean;
  confirm: string = this.dict.getDictionary('yes');
  deny: string = this.dict.getDictionary('no');
  SecondDialog: boolean;

  constructor(
    public dialogRef: MatDialogRef<DialogDeleteFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    if (data) {
      this.message = data.string;
      this.SecondDialog = data.secondDialog;
    }
    this.dialogRef.updateSize('300vw','300vw')
  }

  ngOnInit() {
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
