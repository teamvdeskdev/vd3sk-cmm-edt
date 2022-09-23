import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { globals } from 'src/config/globals';
import { SignatureProviderResponse } from '../../../app-model/admin-settings/SignatureProviderResponse';
import { AllAccountsResponse, AllCodesResponse } from '../../model/AllAccountsResponse';
import { CanSignResponse } from '../../model/CanSignResponse';
import { DocumentPreviewRequest } from '../../model/DocumentPreviewRequest';
import { DocumentSignRequest } from '../../model/DocumentSignRequest';
import { DocumentSignResponse } from '../../model/DocumentSignResponse';
import { SignatureParamInput } from '../../model/SignatureParamInput';
import { SignatureVerifyRequest } from '../../model/SignatureVerifyRequest';
import { SignatureVerifyResponse } from '../../model/SignatureVerifyResponse';
import { SignedDocumentRootResponse } from '../../model/SignedDocumentRootResponse';
import { ExtractSignedDocumentRequest, ExtractSignedDocumentResponse } from '../../model/ExtractSignatureDocuments';
// tslint:disable-next-line: max-line-length
import { CreateOrUpdateModel } from '../../pages/settings/signature-settings/components/signature-settings-form/signature-settings-form.component';

@Injectable({
  providedIn: 'root'
})
export class DigitalSignatureService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private documentSignResp: DocumentSignResponse;
  private documentSignReq: DocumentSignRequest;
  private accountId: number;
  private signatureParamInput: SignatureParamInput;
  private posOrigX: number;
  private posOrigY: number;
  public dragSignature = new BehaviorSubject<any>('');

  constructor(private http: HttpClient) {
  }

  /** NB
   * Use the third paramiters on POSTS, cause they don't work without it
   * It will reset the authorization
   **/

  getCanSign(): Observable<CanSignResponse> {
    return this.http.get<any>(`${globals.endpoint}/signature/cansign`);
  }

  getSignatureList(): Observable<any> {
    const body = {};
    return this.http.post<any>(`${globals.endpoint}/signature/account/signature/list`, body, {headers: this.headers});
  }

  documentSign(request: DocumentSignRequest): Observable<any> {
    if (request.SavePath.charAt(0) === '/') {
      request.SavePath = request.SavePath.substring(1);
    }
    return this.http.post<any>(`${globals.endpoint}/signature/document/sign`, request, {headers: this.headers});
  }

  getSignedDocumentRoot(): Observable<SignedDocumentRootResponse> {
    return this.http.get<any>(`${globals.endpoint}/signature/account/documentsroot`);
  }

  getDocumentPreview(request: DocumentPreviewRequest): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/signature/document/getpreview`, request, {headers: this.headers});
  }

  getAllAccounts(): Observable<AllAccountsResponse> {
    const body = {};
    return this.http.post<any>(`${globals.endpoint}/signature/account/getall`, body, {headers: this.headers});
  }

  verifyDocumentSignature(request: SignatureVerifyRequest): Observable<SignatureVerifyResponse> {
    return this.http.post<any>(`${globals.endpoint}/signature/document/verify`, request, {headers: this.headers});
  }

  extractDocumentSignature(request: ExtractSignedDocumentRequest): Observable<ExtractSignedDocumentResponse> {
    return this.http.post<any>(`${globals.endpoint}/signature/p7m/extractandsave`, request, {headers: this.headers});
  }

  createOrUpdateSignatureAccount(request: CreateOrUpdateModel): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/signature/account/createorupdate`, request, {headers: this.headers});
  }

  deleteSignatureAccount(accountId: number): Observable<any> {
    const body = { AccountId: accountId };
    return this.http.post<any>(`${globals.endpoint}/signature/account/delete`, body, {headers: this.headers});
  }

  getSignatureServiceProvider(): Observable<SignatureProviderResponse> {
    const body = {};
    return this.http.post<any>(`${globals.endpoint}/signature/service/getall`, body, {headers: this.headers});
  }

  setDocumentSignResp(resp: DocumentSignResponse) {
    this.documentSignResp = resp;
  }

  getDocumentSignResp() {
    return this.documentSignResp;
  }

  setDocumentSignReq(request: DocumentSignRequest) {
    this.documentSignReq = request;
  }

  getDocumentSignReq() {
    return this.documentSignReq;
  }

  setAccountId(id: number) {
    this.accountId = id;
  }

  getAccountId() {
    return this.accountId;
  }

  setSignatureParamInput(obj: SignatureParamInput) {
    this.signatureParamInput = obj;
  }

  getSignatureParamInput() {
    return this.signatureParamInput;
  }

  setSignatureOriginCoord(x: number, y: number) {
    this.posOrigX = x;
    this.posOrigY = y;
  }

  getSignatureOriginCoord() {
    return {x: this.posOrigX, y: this.posOrigY};
  }

  dragSignatureEvent(event: any) {
    this.dragSignature.next(event);
  }

  getNotaCode(id): Observable<AllCodesResponse> {
    return this.http.post<any>(`${globals.endpoint}/signature/getcertificateslist`, {'accountId': id}, {headers: this.headers});
  }
}