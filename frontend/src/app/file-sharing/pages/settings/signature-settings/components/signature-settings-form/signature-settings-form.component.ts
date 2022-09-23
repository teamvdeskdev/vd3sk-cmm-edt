import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { DigitalSignatureService } from 'src/app/file-sharing/components/digital-signature/digital-signature.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { SignatureSettingsService } from '../../signature-settings.service';
import { SignatureAccountDto } from 'src/app/file-sharing/model/AllAccountsResponse';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { SignatureProviderDto } from '../../../../../../app-model/admin-settings/SignatureProviderResponse';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-signature-settings-form',
  templateUrl: './signature-settings-form.component.html',
  styleUrls: ['./signature-settings-form.component.scss']
})
export class SignatureSettingsFormComponent implements OnInit, OnDestroy {

  @ViewChild('signaturePad') set content(content: any) {
    if (content) {
      this.signaturePad = content;
      if (this.editData && this.editData.RealSignature && this.isPadEmpty() && !this.clearedPad) {
        this.setSigString(this.editData.RealSignature, true);
      }
    }
  }
  signaturePad: any;
  width: any;
  height: any;
  options: any = null; // this.options = { minWidth: 5, maxWidth: 10, penColor: "rgb(66, 133, 244)" };

  dict = new Dictionary();
  serviceSignatureSub: Subscription;
  editData: SignatureAccountDto;
  signatureSeviceList: SignatureProviderDto[];
  credentialForm: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;
  isLoading = false;
  submitted = false;
  clearedPad = false;
  isPers: boolean = false;
  isNota: boolean = false;
  globalsVar: any;

  dictCredentials = this.dict.getDictionary('settings-form-title');
  dictSelectService = this.dict.getDictionary('select-sign-service');
  dictRequiredLabel = this.dict.getDictionary('required-input');
  dictProfileLabel = this.dict.getDictionary('profile-name');
  dictUsernameLabel = this.dict.getDictionary('username');
  dictGraphicSignature = this.dict.getDictionary('graphic-signature');
  dictClearButton = this.dict.getDictionary('clear-button');
  dictUploadButton = this.dict.getDictionary('upload-button');
  dictBack = this.dict.getDictionary('back-button');
  dictSave = this.dict.getDictionary('save');
  dictMarkName: string = this.dict.getDictionary('markName');
  dictMarkPass: string = this.dict.getDictionary('markPass');
  notaUsernameLabel: string = this.dict.getDictionary('notaUsername');

  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private digitalSignatureService: DigitalSignatureService,
    private location: Location,
    private signatureSettingsService: SignatureSettingsService
  ) {
    this.globalsVar = globals;
   }

  ngOnInit() {
    this.isNota = (this.globalsVar.customCustomer.toLowerCase() == 'notariato')? true : false;
    this.isPers = (this.globalsVar.customCustomer.toLowerCase() == 'persidera')? true : false;
    this.spinner.show();
    this.isLoading = true;
    this.width = 886;
    this.height = 222;

    this.editData = this.signatureSettingsService.getSignatureAccountData();

    this.credentialForm = new FormGroup({
      signatureService: new FormControl(this.editData ? this.editData.ServiceId : '', Validators.required),
      identifier: new FormControl(this.editData ? this.editData.Identifier : '', Validators.required),
      email: new FormControl(this.editData ? this.editData.Email : '', Validators.required),
      nomeUtente: new FormControl(this.editData ? this.editData.Username : ''),
      password: new FormControl(this.editData ? this.editData.Password : ''),
      pinToken: new FormControl(this.editData ? this.editData.Token : ''),
      markName: new FormControl((this.editData && this.editData.MarkUsername) ? this.editData.MarkUsername : ''),
      markPass: new FormControl((this.editData && this.editData.MarkPassword) ? this.editData.MarkPassword : ''),
      graphicSignature: new FormControl(this.editData ? this.editData.RealSignature : '')
    });

    this.serviceSignatureSub = this.digitalSignatureService.getSignatureServiceProvider().subscribe(result => {
      if (result && result.Dto) {
        this.signatureSeviceList = result.Dto;
      }

      this.isLoading = false;
      this.spinner.hide();
    });
  }

  backBtn() {
    this.location.back();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if ((this.credentialForm.invalid || this.isPadEmpty()) && !this.croppedImage) {
      return;
    }

    this.spinner.show();
    this.isLoading = true;

    if (this.credentialForm.value && this.credentialForm.valid) {
      if (!this.isPadEmpty() && !this.croppedImage) {
        const data = this.signaturePad.toDataURL();
        const base64Signature = data.split(',')[1];
        this.credentialForm.controls.graphicSignature.setValue(base64Signature);
      } else if (this.croppedImage) {
        const base64 = this.croppedImage.toString().replace('data:image/png;base64,', '');
        this.credentialForm.controls.graphicSignature.setValue(base64);
      }
      const formValue = this.credentialForm.value;
      const request = new CreateOrUpdateModel();
      if (this.editData) {
        request.AccountId = this.editData.Id;
      }
      request.ServiceId = formValue.signatureService;
      request.Email = formValue.email;
      request.Username = formValue.nomeUtente ? formValue.nomeUtente : '';
      request.Password = formValue.password ? formValue.password : null;
      request.Token = formValue.pinToken ? formValue.pinToken : null;
      request.Identifier = formValue.identifier;
      request.Signature = '';
      request.RealSignature = formValue.graphicSignature;

      if(this.isPers){
        request.MarkUsername = formValue.markName;
        request.MarkPassword = formValue.markPass;
      }

      this.digitalSignatureService.createOrUpdateSignatureAccount(request).subscribe(result => {
        this.router.navigateByUrl('filesharing/settings-signaturesettings');
      });
    }
  }

  uploadExternalSignature(event: any) {
    this.imageChangedEvent = event;
  }

  isPadEmpty() {
    return this.signaturePad.isEmpty();
  }

  clear() {
    this.clearedPad = true;
    this.croppedImage = null;
    this.imageChangedEvent = null;
    (document.getElementById('uploadImage') as HTMLInputElement).value = '';
    this.signaturePad.clear();
  }

  setSigString(base64code: string, addMimeType: boolean) {
    const imageString = addMimeType ? 'data:image/png;base64,' + base64code : base64code;
    this.signaturePad.fromDataURL(imageString);
  }

  imageCropped(event: any) {
    this.croppedImage = event.base64;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(event: any) {
  }

  loadImageFailed() {
  }

  ngOnDestroy() {
    if (this.serviceSignatureSub) {
      this.serviceSignatureSub.unsubscribe();
    }
    if (this.editData) {
      this.signatureSettingsService.setSignatureAccountData(null);
    }
  }
}

export class CreateOrUpdateModel {
  public AccountId?: number;
  public ServiceId?: number;
  public Email?: string;
  public Username?: string;
  public Password?: string;
  public Token?: string;
  public Identifier?: string;
  public Signature?: string;
  public RealSignature?: string;
  public MarkUsername?: string;
  public MarkPassword?: string;
}
