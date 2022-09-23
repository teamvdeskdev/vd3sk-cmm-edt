import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LanguageService } from 'src/app/settings/services/language.service';

@Component({
  selector: 'app-userdialog-password',
  templateUrl: './userdialog-password.component.html',
  styleUrls: ['./userdialog-password.component.scss']
})
export class UserdialogPasswordComponent implements OnInit {
  inputvalue;

  constructor(
    public dialogRef: MatDialogRef<UserdialogPasswordComponent>,
    public langService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef.updateSize('300vw', '300vw');
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
