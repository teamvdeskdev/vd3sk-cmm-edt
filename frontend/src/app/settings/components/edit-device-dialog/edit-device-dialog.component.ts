import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { DeviceSessionBody } from '../../../app-model/settings/DeviceSessionResp';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app--edit-device-dialog',
  templateUrl: './edit-device-dialog.component.html',
  styleUrls: ['./edit-device-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditDeviceDialogComponent implements OnInit {


  element: DeviceSessionBody;
  type: string;
  newValue: string;
  wait = false;
  isLoading = false;
  showError = false;

  constructor(
    public dialogRef: MatDialogRef<EditDeviceDialogComponent>,
    public dialog: MatDialog,
    public langService: LanguageService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,


    @Inject(MAT_DIALOG_DATA) public data
    ) {

    dialogRef.disableClose = false;
    this.newValue = null;
    this.element = data.element;

    
  }

  ngOnInit() {
  }

  
  
  confirm() {
    if (this.newValue != null) {
      this.dialogRef.close(this.newValue);
    }
  }  
  
  hideError() {
    this.showError = false;
  }

}
