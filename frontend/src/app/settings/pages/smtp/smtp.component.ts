import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { SmtpCredentialsModel, SmtpGetSettingsModel, SmtpSettingsModel, SmtpSettingsSelect } from 'src/app/app-model/admin-settings/SmtpSettingsModel';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss']
})
export class SmtpComponent implements OnInit {

  smtpSettings = new SmtpSettingsModel();
  smtpCredentials = new SmtpCredentialsModel();
  smtpSettingsSelect = new SmtpSettingsSelect();

  secureSelected = "";
  authtypeSelected = "";

  smtpSettingsToSave = new SmtpSettingsModel();

  constructor(
    public langService: LanguageService,
    public adminSettingsService: AdminSettingsService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService) {
    this.smtpSettings = new SmtpSettingsModel();

  }

  ngOnInit(): void {
    this.adminSettingsService.getSmtpSettings().subscribe(result => {
      this.smtpSettings.setFromApi(result);
      
      this.secureSelected = result.mail_smtpsecure;
      this.authtypeSelected = result.mail_smtpauthtype;
      this.smtpCredentials.mail_smtpname = result.mail_smtpname;
      this.smtpCredentials.mail_smtppassword = result.mail_smtppassword;
    });
  }
  save() {

    this.showLoader();
    this.smtpSettingsToSave = this.smtpSettings.getSave(this.secureSelected, this.authtypeSelected);

    this.adminSettingsService.saveSmtpSettings(this.smtpSettingsToSave).subscribe(result => {


      if (this.smtpSettings.mail_smtpauth === true) {
        this.adminSettingsService.saveSmtpCredentials(this.smtpCredentials).subscribe(cResult => {
          this.resultCheck(cResult);
        });
      } else this.resultCheck(result);

    });
  }
  sendTestEmail() {
    this.showLoader();
    this.adminSettingsService.sendTestEmail().subscribe(result => {
      this.resultCheck(result);
    });
  }
  resultCheck(result) {
    if (result.message === 'success') {
      const message = this.langService.dictionary.save_success;
      this.snackBar.open(message, '', {
        duration: 3000,
        panelClass: 'toast-success'
      });
    } else {
      const message = this.langService.dictionary.save_error;
      this.snackBar.open(message, '', {
        duration: 3000,
        panelClass: 'toast-error'
      });
    }
    this.closeLoader();
  }

  /** SHOW LOADER */
  showLoader() {
    this.spinner.show();
  }

  /** CLOSE LOADER */
  closeLoader() {
    this.spinner.hide();
  }
}
