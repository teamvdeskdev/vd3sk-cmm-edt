import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { DocumentSignResponse } from 'src/app/file-sharing/model/DocumentSignResponse';
import { SignatureParamInput } from 'src/app/file-sharing/model/SignatureParamInput';
import { AnnotationSignature, DocumentSignParam, DocumentSignRequest, ImageParam, InputParam } from '../../../../file-sharing/model/DocumentSignRequest';
import { SignatureDto, SupportedSignatureEnum } from '../../../../file-sharing/model/SignatureDto';
import { ChangeSavePath, ChangeSavePathComponent } from '../../dialogs/change-save-path/change-save-path.component';
import { DigitalSignatureService } from '../digital-signature.service';
import { SignatureOtpComponent } from 'src/app/file-sharing/components/dialogs/signature-otp/signature-otp.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-set-signature',
  templateUrl: './set-signature.component.html',
  styleUrls: ['./set-signature.component.scss']
})
export class SetSignatureComponent implements OnInit {

  dict = new Dictionary();
  isLoading = false;
  signatureType: string;
  signatureTypeEnum = SignatureType;
  form: FormGroup;
  pathSaveFile: string;
  location: string;
  reason: string;
  coordinatePadesFormat: string;
  signatureListDtos: Array<SignatureDto> = [];
  accountId: number;
  accountUserEmail: string;
  file: any;
  graphicOrInvisible: string;
  signatureAxisOrigin: string;
  isMultipleSignature: boolean;
  isMultipageSignature: boolean;
  isPdfFile: boolean;
  documentSignReq: DocumentSignRequest;
  documentSignResp: DocumentSignResponse;
  codeNotar: string = '';
  certNotar: string = '';
  checkMark: boolean = false;
  notCustom: boolean = false;
  notShare: boolean = true;
  isPers: boolean = false;
  responseCode: any;
  codes: any = [];
  certify: any = [];

  dictTitle: string = this.dict.getDictionary('title-set-signature');
  dictSignatory: string = this.dict.getDictionary('signatory');
  dictSaveIn: string = this.dict.getDictionary('save-label');
  dictChange: string = this.dict.getDictionary('change-path-btn');
  dictPlace: string = this.dict.getDictionary('place-label');
  dictCausal: string = this.dict.getDictionary('causal-label');
  dictFormat: string = this.dict.getDictionary('format-label');
  dictBack: string = this.dict.getDictionary('back-button');
  dictContinue: string = this.dict.getDictionary('continue-button');
  dictGraphicSignature: string = this.dict.getDictionary('graphic-signature');
  dictInvisibleSignature: string = this.dict.getDictionary('invisible-signature');
  dictSignedSuccessMsg: string = this.dict.getDictionary('signed-success-msg');
  allFiles: string = this.dict.getDictionary('all-files');
  dictCert: string = this.dict.getDictionary('dictCert');
  dictCode: string = this.dict.getDictionary('dictCode');
  mark: string = this.dict.getDictionary('mark');
  globalsVar: any;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private digitalSignatureService: DigitalSignatureService,
    private dataSharingService: DataSharingService,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
  ) {
    this.graphicOrInvisible = 'firmaGrafica';
    this.globalsVar = globals;
  }

  async ngOnInit() {
    if(this.globalsVar.customCustomer.toLowerCase() == 'notariato'){
      this.notCustom = true;
      this.notShare = (sessionStorage.getItem('groups').includes('notbox-firma'))? true : false;
    }
    this.isPers = (this.globalsVar.customCustomer.toLowerCase() == 'persidera')? true : false;
    if (this.route.children.length === 0) {
      this.spinner.show();
      this.isLoading = true;
      this.form = this.formBuilder.group({
        signatureTypeRadio: this.signatureTypeEnum.CAdES
      });
      this.signatureType = this.form.value.signatureTypeRadio;

      this.file = this.dataSharingService.getFile();
      if (!this.file) {
        this.router.navigateByUrl('/filesharing/all-files');
      }
      this.isPdfFile = this.file.extension === '.pdf';
      this.pathSaveFile = this.dataSharingService.getSavePath();
      this.pathSaveFile = (this.pathSaveFile == '/')? this.allFiles : this.pathSaveFile;

      const respSignatureList = await this.digitalSignatureService.getSignatureList().toPromise();
      if (respSignatureList && respSignatureList.Dtos) {
        this.signatureListDtos = respSignatureList.Dtos;
      }

      this.isLoading = false;
      this.spinner.hide();
    }
  }

  async getCodesNote(id:any){
    let getCodes = await this.digitalSignatureService.getNotaCode(id).toPromise();
    if(getCodes.certificates){
      for(var i in getCodes.certificates){
        this.codes.push(getCodes.certificates[i].cf);
      }
      this.responseCode = getCodes.certificates;
    }else{
      this._snackBar.open(this.dict.getDictionary('error-codes-cf'), '', {
        duration: 2000,
        panelClass: 'toast-error'
      });
    }
  }

  getMark(){
    this.checkMark = !this.checkMark;
  }

  changeSignatureType(event: any) {
    this.signatureType = event.value;
  }

  selectGraphicOrInvisible(element: MatSelect) {
    if (element) {
      this.graphicOrInvisible = element.value;
    }
  }

  Next() {
    if (this.signatureType === SignatureType.CAdES ||
      (this.signatureType === SignatureType.PAdES && this.graphicOrInvisible === 'firmaInvisibile')) {
      this.spinner.show();
      this.isLoading = true;

      if (this.signatureType === SignatureType.CAdES) {
        this.documentSignReq = this.createCadesRequest();
      } else {
        this.documentSignReq = this.createPadesInvisibleSignRequest();
      }
      this.digitalSignatureService.setDocumentSignReq(this.documentSignReq);

      this.digitalSignatureService.documentSign(this.documentSignReq).subscribe(response => {
        if (response.Performed && response.Signed) {

          /** Task VDESK-154 */
         this.storeFileAsJustSigned();

          // sign without otp
          /** Task VDESK-154 */
          this.router.navigateByUrl('/filesharing/all-files');
         // this.router.navigateByUrl('/filesharing/signed-documents-folder');
        } else if (response.Performed && !response.Signed && response.NotSignedBecause === 'REQUIREOTP') {
          this.digitalSignatureService.setDocumentSignResp(new DocumentSignResponse(response));
          this.spinner.hide();
          this.isLoading = false;
          //this.router.navigate(['authentication'], { relativeTo: this.route });
          this.openDialogOtp();
        }
      });
    } else {
      // graphic pades
      const signatureObj = new SignatureParamInput();
      signatureObj.accountId = this.accountId;
      signatureObj.accountUserEmail = this.accountUserEmail;
      signatureObj.padesCoordinatesFormat = this.coordinatePadesFormat;
      signatureObj.axisOrigin = this.signatureAxisOrigin;
      signatureObj.isMultipleSignature = this.isMultipleSignature;
      signatureObj.isMultipageSignature = this.isMultipageSignature;
      signatureObj.pathSaveFile = this.pathSaveFile;
      signatureObj.location = this.location;
      signatureObj.reason = this.reason;
      
      if(this.notCustom && this.notShare){
        signatureObj.userid = this.codeNotar;
        signatureObj.certid = this.certNotar;
      }

      if(this.isPers){
        signatureObj.requiredMark = this.checkMark;
      }
      this.digitalSignatureService.setSignatureParamInput(signatureObj);
      this.router.navigate(['pades-signature'], { relativeTo: this.route });
    }
  }

  /** Task VDESK-154 */
  storeFileAsJustSigned() {
    sessionStorage.setItem('justSignedFileId', this.file.id);
  }

  openDialogOtp(){
    const dialogRef = this.dialog.open(SignatureOtpComponent, {
      width: '500px',
      height: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.documentSignReq = this.digitalSignatureService.getDocumentSignReq();
        this.documentSignResp = this.digitalSignatureService.getDocumentSignResp();
        if (this.documentSignResp && this.documentSignReq) {
          this.spinner.show();
          this.isLoading = true;
          const documentSignReq = new DocumentSignRequest();
          documentSignReq.AccountId = this.documentSignReq.AccountId;
          documentSignReq.Document = this.documentSignReq.Document;
          documentSignReq.SavePath = (this.documentSignReq.SavePath == this.allFiles)? '/' : this.documentSignReq.SavePath;
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
          params.otp = result;

          if(this.notCustom && this.notShare){
            params.userid = this.codeNotar;
            params.certid = this.certNotar;
          }

          if(this.isPers){
            params.requiredMark = this.checkMark;
          }

          documentSignReq.Params = params;
    
          this.digitalSignatureService.documentSign(documentSignReq).subscribe(response => {
            if (response.Performed && response.Signed) {

              /** Task VDESK-154 */
              this.storeFileAsJustSigned();

              const snackBarRef = this._snackBar.open(this.dictSignedSuccessMsg, null, {
                duration: 2000,
                panelClass: 'toast-success'
              });
              snackBarRef.afterDismissed().subscribe(() => {
                this.dataSharingService.goToSignedDocument.next(true);

                /** Task VDESK-154 */
                this.router.navigateByUrl('/filesharing/all-files');
                //this.router.navigateByUrl('/filesharing/signed-documents-folder');

                // if (documentSignReq.SavePath !== '') {
                //   this.goToPath(documentSignReq.SavePath);
                // } else {
                //   this.router.navigateByUrl('/filesharing/all-files');
                // }
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
            this.isLoading = false;
            this.spinner.hide();
          });
        }
      }
    });
  }

  createCadesRequest() {
    const documentSignReq = new DocumentSignRequest();
    documentSignReq.AccountId = this.accountId;
    documentSignReq.Document = Number(this.file.id);
    documentSignReq.SavePath = this.pathSaveFile;
    documentSignReq.MimeType = this.file.typecomplete;
    const params = new DocumentSignParam();
    params.format = SupportedSignatureEnum.CADES;
    params.fileName = this.file.name + this.file.extension;
    params.returnder = false;
    if(this.notCustom && this.notShare){
      params.userid = this.codeNotar;
      params.certid = this.certNotar;
    }
    if(this.isPers){
      params.requiredMark = this.checkMark;
    }
    documentSignReq.Params = params;

    return documentSignReq;
  }

  createPadesInvisibleSignRequest() {
    const documentSignReq = new DocumentSignRequest();
    documentSignReq.AccountId = this.accountId;
    documentSignReq.Document = Number(this.file.id);
    documentSignReq.SavePath = this.pathSaveFile;
    documentSignReq.MimeType = this.file.typecomplete;
    const params = new DocumentSignParam();
    params.format = SupportedSignatureEnum.PADES;
    params.fileName = this.file.name + this.file.extension;
    params.invisibleSignature = true;

    const contact = new InputParam();
    contact.type = 'CONTACT';
    contact.value = this.accountUserEmail.toString();

    const reason = new InputParam();
    reason.type = 'REASON';
    reason.value = this.reason;

    const location = new InputParam();
    location.type = 'LOCATION';
    location.value = this.location;

    const image = new ImageParam();
    image.mimeType = 'image/jpeg';
    image.data = '___B64___';

    const annotation = new AnnotationSignature();
    annotation.contact = contact;
    annotation.reason = reason;
    annotation.location = location;
    annotation.image = image;
    params.annotations = annotation;
    if(this.notCustom && this.notShare){
      params.userid = this.codeNotar;
      params.certid = this.certNotar;
    }
    if(this.isPers){
      params.requiredMark = this.checkMark;
    }
    documentSignReq.Params = params;
    return documentSignReq;
  }

  Back() {
    this.router.navigateByUrl('/filesharing/all-files');
  }

  selectSignatureService(dto: SignatureDto) {
    this.accountId = dto.accountId;
    if(this.notCustom && this.notShare){
      this.getCodesNote(dto.accountId);
    }    
    this.accountUserEmail = dto.signatureUserEmail;
    this.coordinatePadesFormat = dto.signatureMu;
    if (dto.extraParams && dto.extraParams.hasOwnProperty('signOrientation')) {
      this.signatureAxisOrigin = dto.extraParams.signOrientation;
    }
    this.isMultipleSignature = dto.isMultiSignature;
    this.isMultipageSignature = dto.isMultipageSignature;
  }

  selectCode(code){
    this.codeNotar = code;
    for(var i in this.responseCode){
      if(this.responseCode[i].cf == code){
        this.certify.push(this.responseCode[i].id)
      }
    }
  }

  selectCert(cert){
    this.certNotar = cert
    let obj = this.responseCode.find(x=> x.cf == this.codeNotar);
    this.location = obj.location;
    this.reason = obj.reason;
  }

  openDialogChangePath(): void {
    const dialogRef = this.dialog.open(ChangeSavePathComponent, {
      width: '50%',
      height: '70%',
      data: { data: '', link: false },
    });

    dialogRef.afterClosed().subscribe((result: ChangeSavePath) => {
      if (result && result.destination) {
        this.pathSaveFile = result.destination;
      }
    });
  }

  setLocation(value: string) {
    this.location = value;
  }

  setReason(value: string) {
    this.reason = value;
  }

  disableNextButton() {
    if (!this.file) {
      return true;
    } else {
      if (this.signatureType === SignatureType.CAdES) {
        if(this.notCustom && this.notShare){
          if (!this.accountId || !this.pathSaveFile || !this.codeNotar || !this.certNotar) {
            return true;
          }
        }else{
          if (!this.accountId || !this.pathSaveFile) {
            return true;
          }
        }        
      }
      if (this.signatureType === SignatureType.PAdES) {
        if(this.notCustom && this.notShare){
          if (!this.accountId || !this.pathSaveFile || !this.location || !this.reason || !this.codeNotar|| !this.certNotar) {
            return true;
          }
        }else{
          if (!this.accountId || !this.pathSaveFile || !this.location || !this.reason) {
            return true;
          }
        }        
      }
    }
    return false;
  }

  goToPath(name: string) {
    if (name.charAt(name.length - 1) === '/') {
      name = name.slice(0, -1);
    }
    let url = decodeURIComponent(this.router.url);
    if (url.includes('/filesharing/folder/')) {
      let check = '/filesharing/folder/';
      let index = url.indexOf(check);
      let pathvalue = url.slice(index + check.length);
      let home = '&home=';
      let path = 'all-files';
      // Nuova gestione path
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } });
    } else {
      let check = '/filesharing/';
      let index = url.indexOf(check);
      let path = 'all-files';
      // Nuova gestione path
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } });
    }
  }
}

export enum SignatureType {
  CAdES = 'cades',
  PAdES = 'pades'
}
