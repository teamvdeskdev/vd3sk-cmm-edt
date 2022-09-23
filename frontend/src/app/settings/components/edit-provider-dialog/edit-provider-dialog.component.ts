import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignatureProviderDto } from '../../../app-model/admin-settings/SignatureProviderResponse';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-edit-provider-dialog',
  templateUrl: './edit-provider-dialog.component.html',
  styleUrls: ['./edit-provider-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditProviderDialogComponent implements OnInit {

  provider: SignatureProviderDto;
  providerUpdated: SignatureProviderDto;
  extraParams: string;
  wait = false;
  isLoading = false;
  showError = false;
  serviceSupportedSignatures: string;
  serviceVerify: boolean;


  constructor(
    public dialogRef: MatDialogRef<EditProviderDialogComponent>,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private adminSettingsService: AdminSettingsService,
    public langService: LanguageService,

    @Inject(MAT_DIALOG_DATA) public data
    ) {
    dialogRef.disableClose = false;

    this.provider = data.provider;
    if (data.mode === 'edit') {
      this.providerUpdated = Object.assign({}, this.provider);

      this.serviceVerify = this.provider.ServiceHasVerify;
      this.extraParams = this.provider.extraParams ? JSON.stringify(this.provider.extraParams) : '';
    }

  }

  ngOnInit() {
    const stringFormatted = this.extraParams.replace(/"/g, '').replace(/{/g, '').replace(/}/g, '')
                                            .replace(/:/g, ' = ').replace(/,/g, ';  ');
    this.extraParams = stringFormatted;
    this.spinner.show();
    if (this.providerUpdated != null && this.providerUpdated.ServiceSupportedSignatures != null) {
      this.serviceSupportedSignatures = this.setSupportedSignatures(this.providerUpdated.ServiceSupportedSignatures);
    }
  }

  setSupportedSignatures(str: string) {
    const stringFormatted = str.split('|');
    return stringFormatted.join(', ');
  }

  saveProvider(provider: SignatureProviderDto) {
    this.wait = true;
    this.spinner.show();
    this.adminSettingsService.updateSignatureProvider(provider).subscribe(result => {
     if (result.Performed) {
       const message = this.langService.dictionary.save_success;
       this.snackBar.open(message, '', {
         duration: 3000,
         panelClass: 'toast-success'
       });
       this.spinner.hide();
       this.wait = false;
       this.dialogRef.close(true);
      } else {
       const message = this.langService.dictionary.save_error;
       this.snackBar.open(message, '', {
         duration: 3000,
         panelClass: 'toast-error'
       });
       this.spinner.hide();
       this.wait = false;
       this.showError = true;
       return;
      }

    });

  }

  hideError() {
    this.showError = false;
  }

}
