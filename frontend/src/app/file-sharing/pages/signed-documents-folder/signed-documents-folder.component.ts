import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DigitalSignatureService } from '../../components/digital-signature/digital-signature.service';
import { SignedDocumentRootResponse } from '../../model/SignedDocumentRootResponse';
import { FileSharingService } from '../../services/file-sharing.service';
import { FileSharingData, Utilities } from '../../utilities';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';

@Component({
  selector: 'app-signed-documents-folder',
  templateUrl: './signed-documents-folder.component.html',
  styleUrls: ['./signed-documents-folder.component.scss']
})
export class SignedDocumentsFolderComponent implements OnInit {
  // CHECK PAGE
  util = new Utilities();
  dataValue: FileSharingData[] = [];
  selected = 'signed-documents-folder';
  getpage = 'signed';
  pageFavorite: boolean;
  userId: any;
  noData: boolean;
  myArray = [];
  done = false;

  constructor(
    private fsService: FileSharingService,
    private spinner: NgxSpinnerService,
    private digitalSignatureService: DigitalSignatureService,
    private sendButton: GroupFolderButton,
  ) { }

  ngOnInit() {
    this.sendButton.toggle(false);
    this.spinner.show();
    this.done = false;

    this.fsService.getListSigned().subscribe((result: any) => {
      const response = result.Dto;
      const username = sessionStorage.getItem('user');

      if (response) {
        this.dataValue = this.util.getResponseSignedDocumentsFiles(response, username, false);
        if (this.dataValue.length > 0) {
          this.noData = false;
          this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
          this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        } else {
          this.noData = true;
        }
      } else {
        this.noData = true;
      }
      this.spinner.hide();
      this.done = true;
    });

  }
}
