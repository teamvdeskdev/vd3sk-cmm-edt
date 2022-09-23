import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignatureProviderDto } from '../../../app-model/admin-settings/SignatureProviderResponse';
import { EditProviderDialogComponent } from '../../components/edit-provider-dialog/edit-provider-dialog.component';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-vdpa-settings',
  templateUrl: './vdpa-settings.component.html',
  styleUrls: ['./vdpa-settings.component.scss']
})
export class VDpaSettingsComponent implements OnInit {

  providerList: SignatureProviderDto[];
  isLoadingPage = false;

  dialogSize = {
    width: '688px', // '36%', //'25%',
    height: '40%'
  };

  constructor(
    private adminSettingsService: AdminSettingsService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public langService: LanguageService
  ) {


  }

  ngOnInit() {
    this.loadProviderList();
  }

  loadProviderList() {
    this.isLoadingPage = true;
    this.adminSettingsService.getSignatureProviders().subscribe(result => {
      if (result.Performed) {
          this.providerList = result.Dto;
      }
      this.isLoadingPage = false;
    });

  }

  openEditProviderDialog(provider: SignatureProviderDto) {
    this.dialog.open(EditProviderDialogComponent, {
      width: this.dialogSize.width,
      // height: this.dialogSize.height,
      data: { provider: provider, mode: 'edit', type: 'new' }

    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadProviderList();
      }
    });
  }

  setSupportedSignatures(provider: SignatureProviderDto) {
    if (provider != null && provider.ServiceSupportedSignatures != null) {
      const stringFormatted = provider.ServiceSupportedSignatures.split('|');
      return stringFormatted.join(', ');
    }

  }



}
