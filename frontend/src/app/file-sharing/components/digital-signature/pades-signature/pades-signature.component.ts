import { SignatureParamInput } from 'src/app/file-sharing/model/SignatureParamInput';
import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { AllAccountsResponse } from 'src/app/file-sharing/model/AllAccountsResponse';
import { DocumentPreviewRequest } from 'src/app/file-sharing/model/DocumentPreviewRequest';
import { DigitalSignatureService } from '../digital-signature.service';
import { Location } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { AnnotationSignature, DocumentSignParam, DocumentSignRequest, ImageParam, InputParam, PositionParam } from 'src/app/file-sharing/model/DocumentSignRequest';
import { SupportedSignatureEnum } from 'src/app/file-sharing/model/SignatureDto';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentSignResponse } from 'src/app/file-sharing/model/DocumentSignResponse';
import { SignatureBoxComponent } from '../signature-box/signature-box.component';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { MatDialog } from '@angular/material/dialog';
import { SignatureOtpComponent } from 'src/app/file-sharing/components/dialogs/signature-otp/signature-otp.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-pades-signature',
  templateUrl: './pades-signature.component.html',
  styleUrls: ['./pades-signature.component.scss']
})
export class PadesSignatureComponent implements OnInit {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  @ViewChild('previewImage') previewElement: any;

  dict = new Dictionary();
  signatureOrigX: number;
  signatureOrigY: number;
  pageNumber = 1;
  totalDocumentPages = 0;
  showDeleteSignatureBtn = false;
  inBounds = false;
  isLoading = false;
  isDraggable = true;
  pagePreviewData: any;
  signatureImageBase64: any;
  originalSignBase64Code: string;
  file: any;
  positionSignature: any;
  documentSignReq: DocumentSignRequest;
  documentSignResp: DocumentSignResponse;
  notCustom: boolean = false;
  notShare: boolean = true;
  isPers: boolean = false;
  globalsVar: any;
  /* array contenente i dati firma per ogni pagina che saranno passati al servizio di BE
   * (contiene i dati firma di tutte le pagine)
   */
  signedPages: PageSignatureData[] = [];
  /* array contenente i componenti firma da mostrare graficamente
   * (contiene i componenti della pagina che si sta visualizzano)
   */
  componentsReferences = Array<ComponentRef<SignatureBoxComponent>>();
  signatureParamInput: SignatureParamInput;
  componentId = 0;
  realDocumentWidth: number;
  realDocumentHeight: number;
  canSignMultiplePages = true;
  canApplyMultipleSignature = true;

  dictTitlePades = this.dict.getDictionary('title-pades');
  dictPage = this.dict.getDictionary('page-lebel');
  dictNoPreview = this.dict.getDictionary('no-preview-message');
  dictSignBoxLabel = this.dict.getDictionary('sign-box-label');
  dictBack = this.dict.getDictionary('back-button');
  dictContinue = this.dict.getDictionary('continue-button');
  dictSignedSuccessMsg = this.dict.getDictionary('signed-success-msg');

  constructor(
    private digitalSignatureService: DigitalSignatureService,
    private dataSharingService: DataSharingService,
    private spinner: NgxSpinnerService,
    private _location: Location,
    private router: Router,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private componentFactoryResolver: ComponentFactoryResolver,
    private _snackBar: MatSnackBar,
  ) {
    this.globalsVar = globals;
   }

  async ngOnInit() {
    this.spinner.show();
    this.isLoading = true;
    if(this.globalsVar.customCustomer.toLowerCase() == 'notariato'){
      this.notCustom = true;
      this.notShare = (sessionStorage.getItem('groups').includes('notbox-firma'))? true : false;
    }
    this.isPers = (this.globalsVar.customCustomer.toLowerCase() == 'persidera')? true : false;
    this.file = this.dataSharingService.getFile();
    if (!this.file) {
      this.router.navigateByUrl('/filesharing/all-files');
    }
    this.signatureParamInput = this.digitalSignatureService.getSignatureParamInput();
    if (this.signatureParamInput) {
      this.canSignMultiplePages = this.signatureParamInput.isMultipageSignature;
      this.canApplyMultipleSignature = this.signatureParamInput.isMultipleSignature;
    }

    await this.loadSignatureImage();
    this.pagePreviewData = await this.getPagePreviewBase64(this.pageNumber);
    // primo componente firma in posizione iniziale
    this.createComponentSign();
    this.isLoading = false;
    this.spinner.hide();

    this.digitalSignatureService.dragSignature.subscribe(result => {
      if (result && this.canApplyMultipleSignature) {
        // crea componenti firma ad ogni trascinamento
        this.createComponentSign();
      }
    });
  }

  createComponentSign(dataSign?: PageSignatureData) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(SignatureBoxComponent);
    const childComponentRef = this.viewContainerRef.createComponent(componentFactory);
    const childComponent = childComponentRef.instance;

    childComponent.signatureImageBase64 = this.signatureImageBase64;
    childComponent.bounds = this.previewElement.nativeElement;
    childComponent.draggable = !this.pagePreviewData || !this.signatureImageBase64 ? false : true;
    childComponent.parentRef = this;
    childComponent.pageNumber = this.pageNumber;
    if (dataSign) {
      childComponent.id = dataSign.componentId;
      childComponent.positionSignature = {x: Number(dataSign.viewPosX), y: Number(dataSign.viewPosY)};
      childComponent.inBounds = true;
      childComponent.settedOriginPos = true;
      childComponent.showDeleteSignatureBtn = true;
      childComponent.widthSignature = String(dataSign.viewSizeW);
      childComponent.heightSignature = String(dataSign.viewSizeH);
      this.componentId = dataSign.componentId;
    } else {
      childComponent.id = this.componentId;
    }
    this.componentId += 1;
    // add reference for newly created component
    this.componentsReferences.push(childComponentRef);
  }

  async loadSignatureImage() {
    const resultAccounts: AllAccountsResponse = await this.digitalSignatureService.getAllAccounts().toPromise();

    if (resultAccounts && resultAccounts.Dto) {
      const paramInput = this.signatureParamInput;
      if (paramInput && paramInput.accountId) {
        for (const dto of resultAccounts.Dto) {
          if (dto.Id === paramInput.accountId) {
            this.originalSignBase64Code = dto.RealSignature;
            this.signatureImageBase64 = 'data:image/png;base64,' + dto.RealSignature;
          }
        }
      }
    }
  }

  async getPagePreviewBase64(page: number) {
    const request = new DocumentPreviewRequest();
    request.FileId = Number(this.file.id);
    request.PageNumber = page;
    const response = await this.digitalSignatureService.getDocumentPreview(request).toPromise();

    if (response && response.Dto && response.Dto.data) {
      const imgBase64 = 'data:image/' + response.Dto.mimeType + ';base64,' + response.Dto.data;
      this.totalDocumentPages = response.Dto.pages;
      this.realDocumentWidth = response.Dto.sizes.width_pixels;
      this.realDocumentHeight = response.Dto.sizes.height_pixels;
      return imgBase64;
    } else {
      return null;
    }
  }

  async goToPage(pageNum: number) {
    this.spinner.show();
    this.isLoading = true;

    /* salvataggio dei dati delle firme presenti nella pagina corrente
     * prima che venga fatto il cambio pagina
     */
    this.saveSignaturePageData();

    /* Cambio di pagina e caicamento della relativa preview del documento */
    this.pageNumber = Number(pageNum);
    this.pagePreviewData = await this.getPagePreviewBase64(pageNum);

    /* rimozione grafica di tutti i componenti firma per
     * passare alla pagina di destinazione vuota da firme
     * rimane solo 1 componente firma a cui viene risettata la pagina nel
     * metodo remove
     */
    for (const component of this.componentsReferences) {
      this.remove(component.instance.id);
    }

    /* Caricamento grafico di firme già presenti, applicate in precedenza,
     * nella pagina di destinazione se non sono presenti si carica il componente
     * nella posizione iniziale
     */
    this.setExistingSignaturePage(pageNum);

    this.isLoading = false;
    this.spinner.hide();
  }

  async prevDocPage() {
    if (this.pageNumber > 1) {
      await this.goToPage(this.pageNumber - 1);
    }
  }

  async nextDocPage() {
    if (this.pageNumber !== this.totalDocumentPages) {
      await this.goToPage(this.pageNumber + 1);
    }
  }

  saveSignaturePageData() {
    const signaturesInBounds = this.componentsReferences.filter(q => q.instance.inBounds);

    if (signaturesInBounds && signaturesInBounds.length > 0) {
      const posPreviewBox = document.getElementById('previewBoxId').getBoundingClientRect();
      this.removeAllSignaturesPageData(this.pageNumber);

      const origCoord = this.digitalSignatureService.getSignatureOriginCoord();

      for (const sign of signaturesInBounds) {
        const instanceSign = sign.instance;
        const rectBoxImage = document.getElementById('signatureBoxId-' + instanceSign.id).getBoundingClientRect();
        const rectOnlyImage = document.getElementById('signatureImgId-' + instanceSign.id).getBoundingClientRect();

        const pageData = new PageSignatureData();
        pageData.haveSign = true;
        pageData.componentId = instanceSign.id;

        const x = this.convertInRealWidthProportion(rectBoxImage.left - posPreviewBox.left);
        pageData.posX = this.signatureParamInput.padesCoordinatesFormat === CoordinatesType.Points ? this.convertInPoint(x) : x;

        let y = this.convertInRealHeightProportion(rectBoxImage.top - posPreviewBox.top);
        // inversione dell'asse y se l'origine degli assi del servizio parte dal basso
        if (this.signatureParamInput.axisOrigin && this.signatureParamInput.axisOrigin === 'BottomLeft') {
          // altezza immagine in base al documento reale
          const realImageHeight = this.convertInRealHeightProportion(rectOnlyImage.height);
          y = this.realDocumentHeight - (y + realImageHeight);
        }
        pageData.posY = this.signatureParamInput.padesCoordinatesFormat === CoordinatesType.Points ? this.convertInPoint(y) : y;

        pageData.viewPosX = -(origCoord.x - rectBoxImage.left);
        pageData.viewPosY = rectBoxImage.top - origCoord.y;
        pageData.sizeW = this.convertInPoint(this.convertInRealWidthProportion(rectOnlyImage.width));
        pageData.sizeH = this.convertInPoint(this.convertInRealHeightProportion(rectOnlyImage.height));
        pageData.viewSizeW = rectBoxImage.width;
        pageData.viewSizeH = rectBoxImage.height;
        pageData.page = this.pageNumber;
        this.signedPages.push(pageData);
      }
    }
  }

  removeAllSignaturesPageData(pageNumber: number) {
    if (this.signedPages && this.signedPages.length > 0) {
      const findedElem = this.signedPages.filter(q => q.page === pageNumber && q.haveSign);

      if (findedElem && findedElem.length > 0) {
        for (const el of findedElem) {
          const index: number = this.signedPages.indexOf(el);
          if (index !== -1) {
            this.signedPages.splice(index, 1);
          }
        }
      }
    }
  }

  convertInRealWidthProportion(value: number) {
    return (value * this.realDocumentWidth) / this.previewElement.nativeElement.clientWidth;
  }

  convertInRealHeightProportion(value: number) {
    return (value * this.realDocumentHeight) / this.previewElement.nativeElement.clientHeight;
  }

  convertInPoint(positionInPixel: number) {
    // 1 px = 0.75 point
    return (positionInPixel * 0.75);
  }

  setExistingSignaturePage(pageNum: number) {
    const findedSign = this.signedPages.filter(q => q.page === Number(pageNum) && q.haveSign);
    this.componentId = 0;

    if (findedSign && findedSign.length > 0) {
      for (const sign of findedSign) {
        this.createComponentSign(sign);
      }
    }

    /* Disabilito la creazione del componente in posizione iniziale
     * al cambio pagina, in base ai criteri del servizio di firma
     */
    if (!this.canSignMultiplePages && !this.canApplyMultipleSignature) {
      if (this.signedPages.length > 0) {
        return;
      }
    }
    if (this.canSignMultiplePages && !this.canApplyMultipleSignature) {
      if (findedSign && findedSign.length > 0) {
        return;
      }
    }
    if (!this.canSignMultiplePages && this.canApplyMultipleSignature) {
      if (findedSign && findedSign.length < 1 && this.signedPages.length > 0) {
        return;
      }
    }
    // crea il componente in posizione iniziale per essere trascinato sul documento
    this.createComponentSign();
  }

  back() {
    this._location.back();
  }

  next() {
    this.saveSignaturePageData();

    if (this.signedPages && this.signedPages.length > 0) {
      const request = this.createSignDocumentRequest();
      this.digitalSignatureService.setDocumentSignReq(request);

      if (request) {
        this.digitalSignatureService.documentSign(request).subscribe(response => {
          if (response.Performed && response.Signed) {
            // sign without otp
            this.router.navigateByUrl('/filesharing/signed-documents-folder');
          } else if (response.Performed && !response.Signed && response.NotSignedBecause === 'REQUIREOTP') {
            this.digitalSignatureService.setDocumentSignResp(new DocumentSignResponse(response));
            this.spinner.hide();
            this.isLoading = false;
            //this.router.navigate(['../authentication'], { relativeTo: this.route });
            this.openDialogOtp();
          }
        });
      }
    }
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
          params.otp = result;
          
          if(this.notCustom && this.notShare){
            params.userid = this.signatureParamInput.userid;
            params.certid = this.signatureParamInput.certid;
          }
    
          if(this.isPers){
            params.requiredMark = this.signatureParamInput.requiredMark;
          }
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
            this.isLoading = false;
            this.spinner.hide();
          });
        }
      }
    });
  }

  /* Remove child component SignatureBoxComponent */
  remove(id: number, isDeleteButton = false) {
    if (this.viewContainerRef.length < 1) {
      return;
    }

    const componentRef = this.componentsReferences.filter(x => x.instance.id === id)[0];
    const vcrIndex: number = this.viewContainerRef.indexOf(componentRef.hostView);
    // removing component from view container
    this.viewContainerRef.remove(vcrIndex);
    // removing component from the list
    this.componentsReferences = this.componentsReferences.filter(x => x.instance.id !== id);
    // removing data of signature
    if (isDeleteButton) {
      this.removeSpecificSignaturePageData(this.pageNumber, id);

      /* ricreo componente firma in caso di cancellazione
       * in base ai vari criteri che può adottare il servizio firma
       */
      if (!this.canSignMultiplePages && !this.canApplyMultipleSignature) {
        if (this.signedPages.length < 1) {
          this.createComponentSign();
        }
      }
      if (this.canSignMultiplePages && !this.canApplyMultipleSignature) {
        this.createComponentSign();
      }
    }
  }

  removeSpecificSignaturePageData(pageNumber: number, componentId: number) {
    if (this.signedPages && this.signedPages.length > 0) {
      const findedElem = this.signedPages.find(q => q.page === pageNumber && q.componentId === componentId && q.haveSign);

      if (findedElem) {
        const index: number = this.signedPages.indexOf(findedElem);
        if (index !== -1) {
          this.signedPages.splice(index, 1);
        }
      }
    }
  }

  createSignDocumentRequest() {
    if (this.signatureParamInput) {
      const documentSignReq = new DocumentSignRequest();
      documentSignReq.AccountId = this.signatureParamInput.accountId;
      documentSignReq.Document = Number(this.file.id);
      documentSignReq.SavePath = this.signatureParamInput.pathSaveFile;
      documentSignReq.MimeType = this.file.typecomplete;

      const params = new DocumentSignParam();
      params.format = SupportedSignatureEnum.PADES;
      params.fileName = this.file.name + this.file.extension;
      params.imageOnly = true;

      const annotation = new AnnotationSignature();
      const arrayPositions: PositionParam[] = [];

      for (const signature of this.signedPages) {
        const position = new PositionParam();
        position.posX = Math.round(signature.posX);
        position.posY = Math.round(signature.posY);
        position.width = Math.round(signature.sizeW);
        position.height = Math.round(signature.sizeH);
        position.page = signature.page;
        arrayPositions.push(position);
      }

      const contact = new InputParam();
      contact.type = 'CONTACT';
      contact.value = this.signatureParamInput.accountUserEmail;

      const reason = new InputParam();
      reason.type = 'REASON';
      reason.value = this.signatureParamInput.reason;

      const location = new InputParam();
      location.type = 'LOCATION';
      location.value = this.signatureParamInput.location;

      const image = new ImageParam();
      image.mimeType = 'image/png';
      image.data = this.originalSignBase64Code;

      annotation.position = arrayPositions;
      annotation.contact = contact;
      annotation.reason = reason;
      annotation.location = location;
      annotation.image = image;
      params.annotations = annotation;
      if(this.notCustom && this.notShare){
        params.userid = this.signatureParamInput.userid;
        params.certid = this.signatureParamInput.certid;
      }

      if(this.isPers){
        params.requiredMark = this.signatureParamInput.requiredMark;
      }
      documentSignReq.Params = params;

      return documentSignReq;
    }
    return null;
  }
}

export class PageSignatureData {
  public componentId: number;
  public posX: number;
  public posY: number;
  public viewPosX: number;
  public viewPosY: number;
  public sizeW: number;
  public sizeH: number;
  public viewSizeW: number;
  public viewSizeH: number;
  public page: number;
  public haveSign = false;
}

enum CoordinatesType {
  Points = 'POINTS',
  Pixels = 'PIXELS'
}
