import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { DigitalSignatureService } from 'src/app/file-sharing/components/digital-signature/digital-signature.service';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { AllAccountsResponse, SignatureAccountDto } from 'src/app/file-sharing/model/AllAccountsResponse';
import { SignatureSettingsService } from '../../signature-settings.service';

@Component({
  selector: 'app-signature-table',
  templateUrl: './signature-table.component.html',
  styleUrls: ['./signature-table.component.scss']
})
export class SignatureTableComponent implements OnInit, OnDestroy {

  dict = new Dictionary();
  allAccountsSub: Subscription;
  isLoading = false;
  dataSource: SignatureAccountDto[];
  displayedColumns: string[] = ['Id', 'Identifier', 'Email', 'Username', 'others'];

  dictSignatureService = this.dict.getDictionary('name-column');
  dictEdit = this.dict.getDictionary('edit-button');
  dictDelete = this.dict.getDictionary('delete-button');

  constructor(
    private spinner: NgxSpinnerService,
    private digitalSignatureService: DigitalSignatureService,
    private signatureSettingsService: SignatureSettingsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.spinner.show();
    this.isLoading = true;
    this.allAccountsSub = this.digitalSignatureService.getAllAccounts().subscribe((result: AllAccountsResponse) => {
      if (result && result.Performed && result.Dto.length > 0) {
        this.dataSource = result.Dto;
      }
      this.isLoading = false;
      this.spinner.hide();
    });
  }

  deleteAccount(id: number) {
    this.spinner.show();
    this.isLoading = true;
    this.digitalSignatureService.deleteSignatureAccount(id).subscribe(result => {
      this.digitalSignatureService.getAllAccounts().subscribe((response: AllAccountsResponse) => {
        if (response && response.Performed && response.Dto.length > 0) {
          this.dataSource = response.Dto;
        }
        this.isLoading = false;
        this.spinner.hide();
      });
    });
  }

  editAccount(account: SignatureAccountDto) {
    this.signatureSettingsService.setSignatureAccountData(account);
    this.router.navigateByUrl('filesharing/settings-signaturesettingsform');
  }

  ngOnDestroy() {
    if (this.allAccountsSub) {
      this.allAccountsSub.unsubscribe();
    }
  }
}
