import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Dictionary } from '../../../dictionary/dictionary';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-pdf',
  templateUrl: './dialog-pdf.component.html',
  styleUrls: ['./dialog-pdf.component.scss']
})
export class DialogPdfComponent implements OnInit {

  dict = new Dictionary();
  src: string;
  url: SafeResourceUrl;
  fileName: string;
  // DICTIONARY VARIABLES ---
  dictInsertPassword = this.dict.getDictionary('insertPassword');
  dictClose = this.dict.getDictionary('close');

  constructor(public dialogRef: MatDialogRef<DialogPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public sanitizer: DomSanitizer) {

    if (!data.data.isChat) {
      let fixeddata = data.base.substr(data.base.indexOf(',') + 1);
      if (data.data.name && data.data.extension) {
        this.fileName = data.data.name + data.data.extension;
      }
      if (data.data.extension !== '.pdf') {
        this.src = "data:image/" + data.data.extension + ";base64," + data.base;
      } else this.src = "data:application/pdf;base64," + fixeddata;
      //
    } else {
      this.fileName = data.data.name;
      let fixeddata = data.base.substr(data.base.indexOf(',') + 1);
      this.src = "data:application/pdf;base64," + fixeddata;
    }
  }

  ngOnInit() {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }
  onNoClick(): void { this.dialogRef.close(); }

}
