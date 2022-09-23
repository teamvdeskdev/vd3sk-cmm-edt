import { Component, OnInit } from '@angular/core';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { SignedDocumentRootResponse } from '../../model/SignedDocumentRootResponse';
import { DigitalSignatureService } from './digital-signature.service';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss']
})
export class DigitalSignatureComponent implements OnInit {

  dataSidebar: any;
  fileInfo: any;
  signedDocumentRootFolder: string;

  constructor(
    private dataSharingService: DataSharingService,
    private digitalSignatureService: DigitalSignatureService
  ) { }

  ngOnInit() {
    this.dataSharingService.fileInfo.subscribe(result => {
      this.fileInfo = result;
      if (this.fileInfo.hasOwnProperty('isRow')) {
        this.fileInfo.isRow = false;
      }
      this.dataSharingService.setFile(this.fileInfo);
    });
  }
}
