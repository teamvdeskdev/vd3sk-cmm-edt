import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Dictionary } from '../../../dictionary/dictionary';
import { FileSharingService } from '../../../services/file-sharing.service';
import { Utilities } from 'src/app/file-sharing/utilities';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {
  util = new Utilities();
  dict = new Dictionary();

  // DICTIONARY VARIABLES ---
  title: string;
  dictCancel = this.dict.getDictionary('cancel');
  dictOk = this.dict.getDictionary('confirm');
  insertKey = this.dict.getDictionary('encryption_key');
  password = this.dict.getDictionary('password');
  stringWeight = this.dict.getDictionary('loading_operation');

  error = false;
  inputvalue = '';
  weight = false;

  constructor(
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
    private fsService: FileSharingService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    ) { }

  ngOnInit() {
    if(this.data.check) this.title = (this.data.extension.length>0)? this.dict.getDictionary('encipher_file') : this.dict.getDictionary('encipher_folder');
    else this.title = (this.data.extension.length>0)? this.dict.getDictionary('decipher_file') : this.dict.getDictionary('decipher_folder');
    
    if(this.data.weigth){
      let weight = this.util.getWeight(parseInt(this.data.weight));
      let arrayWeight = weight.split(' ');
      if((arrayWeight.includes('MB') && parseInt(arrayWeight[0])>5) || arrayWeight.includes('GB') || arrayWeight.includes('TB'))
        this.weight = !this.weight;
    }
  }

  onConfirmClick(): void {
    this.fsService.validateSession(this.inputvalue).subscribe((result: any) => {
      if(result.Validated){
        this.dialogRef.close(true);
      }else{        
        this.error = true;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
