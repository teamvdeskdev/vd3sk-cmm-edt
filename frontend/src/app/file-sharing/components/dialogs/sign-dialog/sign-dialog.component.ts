import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../dictionary/dictionary';
import { FileSharingService } from '../../../services/file-sharing.service';
import { Utilities } from 'src/app/file-sharing/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-dialog',
  templateUrl: './sign-dialog.component.html',
  styleUrls: ['./sign-dialog.component.scss']
})
export class SignDialogComponent implements OnInit {
  util = new Utilities();
  dict = new Dictionary();

  // DICTIONARY VARIABLES ---
  title: string = this.dict.getDictionary('sign_file');
  dictCancel = this.dict.getDictionary('cancel');
  dictOk = this.dict.getDictionary('confirm');
  insertOtp = this.dict.getDictionary('insert_otp');
  sign: string = this.dict.getDictionary('sign');
  sign_error: string = this.dict.getDictionary('sign_error');

  inputvalue = '';

  constructor(
    public dialogRef: MatDialogRef<SignDialogComponent>,
    private fsService: FileSharingService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

  onConfirmClick(): void {
    if(this.inputvalue.length>0){
      this.dialogRef.close(true);
    }else{
      this._snackBar.open(this.sign_error, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
