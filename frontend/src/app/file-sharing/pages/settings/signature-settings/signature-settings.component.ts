import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { Subscription } from 'rxjs';
import { DigitalSignatureService } from 'src/app/file-sharing/components/digital-signature/digital-signature.service';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { AllAccountsResponse, SignatureAccountDto } from 'src/app/file-sharing/model/AllAccountsResponse';

@Component({
  selector: 'app-signature-settings',
  templateUrl: './signature-settings.component.html',
  styleUrls: ['./signature-settings.component.scss']
})
export class SignatureSettingsComponent implements OnInit {

  dict = new Dictionary();
  isLoading = false;

  dictSettingsTitle = this.dict.getDictionary('title-sign-settings');
  dictAddButton = this.dict.getDictionary('add-sign-button');

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  goToAddSettings() {
    this.router.navigateByUrl('filesharing/settings-signaturesettingsform');
  }
}
