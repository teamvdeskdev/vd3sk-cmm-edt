import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IdleTimeService } from 'src/app/app-shared/idle-time.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public idleTimeService: IdleTimeService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogDataModel
  ) {
    this.dialogRef.updateSize('300vw', '300vw');
  }

  ngOnInit(): void {
  }

  onConfirmClick(): void {
    this.dialogRef.close('Confirm');
  }

  onNoClick(): void {
    this.dialogRef.close('Cancel');
  }
}

export class ConfirmDialogDataModel {
  public title: string;
  public content: string;
  public textCancelBtn: string;
  public textConfirmBtn: string;
  public isIdleDialog?: boolean;
}
