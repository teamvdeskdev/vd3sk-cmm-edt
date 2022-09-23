import { Component, EventEmitter, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Domain, DomainToAdd, DomainImapToAdd, DomainImap } from '../../../app-model/admin-settings/DomainModel';
import { AdminSettingsService } from '../../services/admin-settings.service';
import { LanguageService } from '../../services/language.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { AppConfig } from 'src/app/app-config';
import { globals } from 'src/config/globals';
@Component({
  selector: 'app-edit-domain-dialog',
  templateUrl: './edit-domain-dialog.component.html',
  styleUrls: ['./edit-domain-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditDomainDialogComponent implements OnInit {
  isTim: boolean = false;
  hasExchange:any;
  selectedValue:any;
  newDomainClicked = false;
  domainClicked: any;
  domainClickedImap: any;
  domain: Domain;
  domainImap: DomainImap;
  wait = false;
  isLoading = false;
  showError = false;
  isHidden: boolean = false;
  isChecked: boolean = false;
  globalsVar: AppConfig;


  securityList = [
    { label: 'SSL/TLS', value: 'ssl' },
    { label: 'STARTTLS', value: 'tls' },
    { label: this.langService.dictionary.no_security, value: false },
    { label: this.langService.dictionary.no_security_spa, value: false }
  ];
  IMAPdomain: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditDomainDialogComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private adminSettingsService: AdminSettingsService,
    public langService: LanguageService,
    private global: GlobalVariable,

    @Inject(MAT_DIALOG_DATA) public data
    ) {

    dialogRef.disableClose = false;
    this.globalsVar = globals;
    this.domain = data.domain;
    this.domainImap = data.domainImap;

    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    if (data.mode == 'edit') {
      this.domainClicked = new Domain();
      this.domainClicked.id = this.domain.id;
      this.domainClicked.active = this.domain.active;
      this.domainClicked.imapEncryption = this.domain.imapEncryption;
      this.domainClicked.imapHost = this.domain.imapHost;
      this.domainClicked.imapPort = this.domain.imapPort;
      this.domainClicked.imapProtocol = this.domain.imapProtocol;
      this.domainClicked.name = this.domain.name;
      this.domainClicked.smtpEncryption = this.domain.smtpEncryption;
      this.domainClicked.smtpHost = this.domain.smtpHost;
      this.domainClicked.smtpPort = this.domain.smtpPort;
      this.domainClicked.smtpUseAuth = this.domain.smtpUseAuth;
      if (this.isTim ) {  
        this.domainClicked.username = this.domain.username;
        this.domainClicked.password = this.domain.password;
        if (this.domainClicked.username){
          this.hasExchange = 'enabled';
          this.selectedValue = 'enabled';
        
        }
      }
    } else if (data.mode == 'new') {
      this.domainClicked = new DomainToAdd();
      this.domainClicked.active = this.domain.active;
      this.domainClicked.imapEncryption = this.domain.imapEncryption;
      this.domainClicked.imapHost = this.domain.imapHost;
      this.domainClicked.imapPort = this.domain.imapPort;
      this.domainClicked.imapProtocol = this.domain.imapProtocol;
      this.domainClicked.name = this.domain.name;
      this.domainClicked.smtpEncryption = this.domain.smtpEncryption;
      this.domainClicked.smtpHost = this.domain.smtpHost;
      this.domainClicked.smtpPort = this.domain.smtpPort;
      this.domainClicked.smtpUseAuth = this.domain.smtpUseAuth;
      if (this.isTim ) {
        this.domainClicked.username = this.domain.username;
        this.domainClicked.password = this.domain.password;
      }
    } else if (data.mode == "imap"){
      this.domainClickedImap = new DomainImapToAdd();
      this.IMAPdomain = true;
      this.domainClickedImap.url = this.domainImap.url;
      this.domainClickedImap.type = this.domainImap.type;
    }

  }

  ngOnInit() {
  }

  getSecurityLabel(label: string){
    this.isHidden = (label == this.langService.dictionary.no_security)? true : false;
    this.isChecked = (this.isHidden)? false : true;
  }

  saveDomainImap(domainImap) {
    if (!domainImap.url || !domainImap.type){
      const message = this.langService.dictionary.insert_all_imap_value;
      this._snackBar.open(message, '', {
        duration: 3000,
        panelClass: 'toast-success'
      });
      return;
    }
    this.wait = true;
    this.spinner.show();
    this.adminSettingsService.addDomainImap(domainImap).subscribe(result => {
     if (result.Performed && result.Added) {
      const message = this.langService.dictionary.save_success;
      this._snackBar.open(message, '', {
        duration: 3000,
        panelClass: 'toast-success'
      });
      this.spinner.hide();
      this.wait = false;
      this.dialogRef.close(domainImap);
    } else if (result.Performed && !result.Added) {
      const message = this.langService.dictionary.imap_exist;
      this._snackBar.open(message, '', {
        duration: 3000,
        panelClass: 'toast-error'
      });
      this.spinner.hide();
      this.wait = false;
      this.dialogRef.close();
    } else {
      const message = this.langService.dictionary.save_error;
      this._snackBar.open(message, '', {
        duration: 3000,
        panelClass: 'toast-error'
      });
      this.spinner.hide();
      this.wait = false;
      this.showError = true;
      return;
    }
    })
  };


  saveDomain(domain) {
    this.wait = true;
    this.spinner.show();
    this.adminSettingsService.addDomain(domain).subscribe(result => {
      if (result.Performed) {
        const message = this.langService.dictionary.save_success;
        this._snackBar.open(message, '', {
          duration: 3000,
          panelClass: 'toast-success'
        });
        this.spinner.hide();
        this.wait = false;
        this.dialogRef.close(result.Dto);
      } else {
        const message = this.langService.dictionary.save_error;
        this._snackBar.open(message, '', {
          duration: 3000,
          panelClass: 'toast-error'
        });
        this.spinner.hide();
        this.wait = false;
        this.showError = true;
        return;
      }

    })
  }

  hideError() {
    this.showError = false;
  }

}
