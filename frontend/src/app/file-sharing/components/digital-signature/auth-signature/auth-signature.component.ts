import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DigitalSignatureService } from '../digital-signature.service';
import { DocumentSignResponse } from 'src/app/file-sharing/model/DocumentSignResponse';
import { DocumentSignParam, DocumentSignRequest } from 'src/app/file-sharing/model/DocumentSignRequest';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { param } from 'jquery';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';

@Component({
  selector: 'app-auth-signature',
  templateUrl: './auth-signature.component.html',
  styleUrls: ['./auth-signature.component.scss']
})
export class AuthSignatureComponent implements OnInit {
  dict = new Dictionary();
  isLoading = false;
  documentSignReq: DocumentSignRequest;
  documentSignResp: DocumentSignResponse;
  otpRequested: boolean;
  otp: string;

  dictSignedSuccessMsg = this.dict.getDictionary('signed-success-msg');
  dictBack = this.dict.getDictionary('back-button');
  dictContinue = this.dict.getDictionary('continue-button');
  dictAuthTitle = this.dict.getDictionary('auth-title');

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private _location: Location,
    private digitalSignatureService: DigitalSignatureService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService
  ) { }

  ngOnInit() {
    this.documentSignReq = this.digitalSignatureService.getDocumentSignReq();
    this.documentSignResp = this.digitalSignatureService.getDocumentSignResp();

    if (this.documentSignResp) {
      if (this.documentSignResp.Properties.otpRequested.tokenRequested) {
        this.otpRequested = this.documentSignResp.Properties.otpRequested.tokenRequested;
      }
    }
  }

  Back() {
    this._location.back();
  }

  Next() {
    if (this.documentSignResp && this.documentSignReq) {
      this.spinner.show();
      this.isLoading = true;
      const documentSignReq = new DocumentSignRequest();
      documentSignReq.AccountId = this.documentSignReq.AccountId;
      documentSignReq.Document = this.documentSignReq.Document;
      documentSignReq.SavePath = this.documentSignReq.SavePath;
      documentSignReq.MimeType = this.documentSignReq.MimeType;
      const params = new DocumentSignParam();
      params.format = this.documentSignReq.Params.format;
      params.fileName = this.documentSignReq.Params.fileName;
      params.imageOnly = this.documentSignReq.Params.imageOnly ? this.documentSignReq.Params.imageOnly : false;
      if (this.documentSignReq.Params.invisibleSignature) {
        params.invisibleSignature = this.documentSignReq.Params.invisibleSignature;
      }
      if (this.documentSignReq.Params.annotations) {
        params.annotations = this.documentSignReq.Params.annotations;
      }
      params.docInfo = this.documentSignResp.Properties.docInfo;
      params.otpRequested = this.documentSignResp.Properties.otpRequested;
      params.otp = this.otp;
      documentSignReq.Params = params;

      this.digitalSignatureService.documentSign(documentSignReq).subscribe(response => {
        if (response.Performed && response.Signed) {
          const snackBarRef = this._snackBar.open(this.dictSignedSuccessMsg, null, {
            duration: 2000,
            panelClass: 'toast-success'
          });
          snackBarRef.afterDismissed().subscribe(() => {
            this.dataSharingService.goToSignedDocument.next(true);
            this.router.navigateByUrl('/filesharing/signed-documents-folder');
          });
        } else {
          const error = response.hasOwnProperty('Error') ? response.Error.toString() : 'Sign error';
          const snackBarRef = this._snackBar.open(error, null, {
            duration: 3000,
            panelClass: 'toast-error'
          });

          snackBarRef.afterDismissed().subscribe(() => {
            this.router.navigateByUrl('/filesharing/all-files');
          });
        }
        // this.isLoading = false;
        // this.spinner.hide();
      });
    }
  }
}
