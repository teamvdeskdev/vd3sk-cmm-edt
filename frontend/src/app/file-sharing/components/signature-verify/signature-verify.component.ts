import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignatureVerifyRequest } from '../../model/SignatureVerifyRequest';
import { VerifyData } from '../../model/SignatureVerifyResponse';
import { DigitalSignatureService } from '../digital-signature/digital-signature.service';
import { Dictionary } from '../../dictionary/dictionary';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-signature-verify',
  templateUrl: './signature-verify.component.html',
  styleUrls: ['./signature-verify.component.scss']
})
export class SignatureVerifyComponent implements OnInit, OnDestroy {

  @Input() data: any;
  dict = new Dictionary();
  signaturesData: VerifyData[];
  isLoading = false;

  dictValidity: string = this.dict.getDictionary('certValidity');
  dictCommonName: string = this.dict.getDictionary('commonName');
  dictGivenName: string = this.dict.getDictionary('givenName');
  dictSurname: string;
  dictDomainQualifier: string = this.dict.getDictionary('domainQualifier');
  dictOrganizationUnitName: string = this.dict.getDictionary('organizationUnitName');
  dictIssuerAltName: string = this.dict.getDictionary('issuerAltName');
  dictCertSerialNumber: string = this.dict.getDictionary('certSerialNumber');
  dictTitle: string = this.dict.getDictionary('sidebarTitle');
  dictNoData: string = this.dict.getDictionary('noSignature');
  dictMonthsName: string = this.dict.getDictionary('monthsName');
  dictDateFrom: string = this.dict.getDictionary('dateFrom');
  dictDateTo: string = this.dict.getDictionary('dateTo');
  dictHour: string = this.dict.getDictionary('hour');
  dictMarked: string = this.dict.getDictionary('dictMarked');
  globalsVar: any;
  isPers: boolean = false;

  constructor() {
    this.globalsVar = globals;
  }

  ngOnInit() {
    this.isPers = (this.globalsVar.customCustomer.toLowerCase() == 'persidera')? true : false;
    if (this.data  && !this.data.includes(null)) {
      this.signaturesData = this.data;
    }else{
      this.signaturesData = null;
    }
  }

  checkCertificateValidity(from: any, to: any) {
    const today = new Date();
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    if (today >= dateFrom && today <= dateTo) {
      return true;
    }
    return false;
  }

  formatValidityDate(inputDate: any) {
    const d = new Date(inputDate);

    const date =  d.getDate().toString() + ' ' +
                  this.dictMonthsName[d.getMonth()].toString() + ' ' +
                  d.getFullYear();

    const time = this.addZero(d.getUTCHours()) + ':' + this.addZero(d.getUTCMinutes());
    return date + ' | ' + this.dictHour + ' ' + time;
  }

  addZero(i: any) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  ngOnDestroy() {

  }
}
