import { Component, Inject, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserSettingsModel } from '../../../app-model/admin-settings/UserSettingsModel';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';
import { read } from 'fs';

export class NewUser {
  id?: number;
  name?: string;
  email?: string;
  groups?: string[];
  quota?: any;
  username?: string;
  password?: string;
  role? : string;
}

export interface UploadtInterfaceBE {
  fileName: string;
  contentType: string;
  base64_content: any;
}

@Component({
  selector: 'app-upload-newuser-file',
  templateUrl: './upload-newuser-file.component.html',
  styleUrls: ['./upload-newuser-file.component.scss']
})
export class UploadNewuserFileComponent implements OnInit {

  UploadFile: UploadtInterfaceBE[] = [];
  wait = false;
  isLoading = false;
  name: any = "";
  confirmUpload: boolean = false;
  ResponsePage: boolean = false;
  ResumeData: any;
  ErorrMessage: boolean = false;
  dataUpload: any;
  isdata: boolean;


  constructor(
    public dialogRef: MatDialogRef<UploadNewuserFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: NewUser, page:boolean, data:any},
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private adminSettingsService: AdminSettingsService,
    public langService: LanguageService,
  ) {
    if(data){
      this.ResponsePage = data.page;
      this.ResumeData = data.data;
    }
   }

  ngOnInit(): void {
  }

  showLoader() {
    this.isdata = false;
    this.spinner.show();
  }

  closeLoader() {
    this.isdata = true;
    this.spinner.hide();
  }

  uploadFile(){
      const data = {
        "data" : this.dataUpload,
      };
      this.dialogRef.close(data);
  }

  openFileExplorer() {
    document.getElementById('upload-file').click();
  }

  addFile($event){
    const files = $event.target.files;
    this.name = $event.target.files[0].name;
    let dateSubstr = this.name.substring(0,8);
    let nameSubstr = this.name.substring(8,25);
    let extSubstr = this.name.substring(25,29);

    var dateReg =  /^\d{8}$/.test(dateSubstr);
    var validExtension = /\.txt$/i.test(extSubstr);
    var nameReg = nameSubstr = '-usercreationdata' ? true : false;


    let RegexValidation = ( dateReg == true && validExtension == true && nameReg == true) ? true : false;

    if(RegexValidation) {
      this.confirmUpload = true;
      this.ErorrMessage = false;
      this.getBase64(files);
    } else {
      this.ErorrMessage = true;
      this.confirmUpload = false;
    }
  }

  /**
   * Set an attachemnt to send to BE
   * @param file
   */
   getBase64(files) {
    for (var i = 0, len = files.length; i < len; i++) {
      const reader = new FileReader();
      const file = files[i];
      if (file) {
        reader.readAsDataURL(file);
        const that = this;
        reader.onload = () => {
          // For BE
          let base64Content: any = reader.result;
          base64Content = base64Content.split('base64,');
          base64Content = base64Content.pop();
          this.dataUpload = base64Content;
        };
        reader.onerror = (error) => {
          const msg = 'Error on file reading: ' + error;
          this.snackBar.open(msg, '', {
            duration: 7000,
            panelClass: 'toast-error'
          });
        };
      }
    }
  }

  Close(){
    this.dialogRef.close();
  }
}
