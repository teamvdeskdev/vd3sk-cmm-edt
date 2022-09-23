import { Injectable } from '@angular/core';
import { SignatureAccountDto } from 'src/app/file-sharing/model/AllAccountsResponse';

@Injectable({
  providedIn: 'root'
})
export class SignatureSettingsService {

  signatureAccount: SignatureAccountDto;

  constructor() { }

  setSignatureAccountData(data: SignatureAccountDto) {
    this.signatureAccount = data;
  }

  getSignatureAccountData() {
    return this.signatureAccount;
  }

}
