import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { UpdateOnlyOfficeUrlRequest } from 'src/app/app-model/admin-settings/UpdateOnlyOfficeUrlRequest';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss']
})
export class ConfigPanelComponent implements OnInit {

  onlyofficeForm: FormGroup;

  constructor(
    private adminService: AdminSettingsService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public langService: LanguageService
  ) {

    this.onlyofficeForm = new FormGroup({
      onlyofficeUrl: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.spinner.show();
    let onlyofficeUrlFromApi = '';

    this.adminService.getOnlyOfficeUrl().subscribe(result => {
      onlyofficeUrlFromApi = result;
      this.onlyofficeForm.setValue({
        onlyofficeUrl: onlyofficeUrlFromApi
      });
      this.spinner.hide();
    });
  }

  onSubmit() {
    if (this.onlyofficeForm.valid && this.onlyofficeForm.value) {
      this.spinner.show();
      const data = new UpdateOnlyOfficeUrlRequest();
      data.documentserver = this.onlyofficeForm.value.onlyofficeUrl;
      data.documentserverInternal = '';
      data.storageUrl = '';
      data.secret = '';
      data.demo = false;
      this.adminService.UpdateOnlyOfficeUrl(data).subscribe(result => {
        if (result.status === 200) {
          this.snackBar.open(this.langService.dictionary.onlyoffice_update_succes, '', {
            duration: 5000,
            panelClass: 'toast-success'
          });
        } else {
          this.snackBar.open(this.langService.dictionary.onlyoffice_update_error, '', {
            duration: 5000,
            panelClass: 'toast-error'
          });
        }
        this.spinner.hide();
      });
    }
  }
}
