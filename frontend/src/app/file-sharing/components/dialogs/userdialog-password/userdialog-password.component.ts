import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';

@Component({
  selector: 'app-userdialog-password',
  templateUrl: './userdialog-password.component.html',
  styleUrls: ['./userdialog-password.component.scss']
})
export class UserdialogPasswordComponent implements OnInit {
  dict = new Dictionary();
  inputvalue;
  password: string = this.dict.getDictionary('password');
  confirm: string = this.dict.getDictionary('confirm');
  cancel: string = this.dict.getDictionary('cancel');
  psw_error: string = this.dict.getDictionary('psw_error');
  authentication: string = this.dict.getDictionary('authentication_required');
  confirmpassword: string = this.dict.getDictionary('confirm_password');

  constructor(
    public dialogRef: MatDialogRef<UserdialogPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.updateSize('300vw','300vw')
  }

  ngOnInit() {
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.inputvalue);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
