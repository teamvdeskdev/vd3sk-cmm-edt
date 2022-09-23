import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { dictionary } from 'src/app/file-sharing/dictionary/dictionaryIT';
import { Dictionary } from '../../../dictionary/dictionary';

@Component({
  selector: 'app-signature-otp',
  templateUrl: './signature-otp.component.html',
  styleUrls: ['./signature-otp.component.scss']
})
export class SignatureOtpComponent implements OnInit {
  dictionary = new Dictionary();
  title: string = this.dictionary.getDictionary('authenticate');
  subtitle: string = this.dictionary.getDictionary('insert_otp');
  cancel: string = this.dictionary.getDictionary('cancel');
  confirm: string = this.dictionary.getDictionary('confirm');
  otp: string = '';

  constructor(
    public dialogRef: MatDialogRef<SignatureOtpComponent>,
  ) { }

  ngOnInit(): void {
  }

  onConfirmClick(): void {
    this.dialogRef.close(this.otp);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
