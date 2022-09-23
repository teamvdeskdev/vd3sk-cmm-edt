import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { globals } from 'src/config/globals';
import { CurrentUser } from '../app-model/common/user';
import { FlowV2Model } from '../app-model/login-v2/FlowV2Model';
import { VerifyTokenModel } from '../app-model/login-v2/verifyTokenModel';
import { V2AccessResponse } from '../app-model/login-v2/V2AccessResponse';
import { SecurityService } from '../app-services/security.service';
import { UtilitiesService } from '../app-services/utilities.service';
import { GlobalVariable } from '../globalviarables';

/**
 * This class manage the security for user authentication
 */
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  totpEnebled: number;
  userManager: boolean;
  IsFolderManager: boolean;
  Logout: string;

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  private _currentUser: CurrentUser;
  private _isUserSaml: boolean;
  private _isUserGuest: boolean;
  private _userApps: string[];
  isSUA: boolean;
  isAuslBo: boolean;
  passwordSua: string;
  clientIdSUA: string;
  globalsVar: any;

  set currentUser(value: CurrentUser) {
    sessionStorage.setItem('_vdl_', btoa(JSON.stringify(value)));
    this._currentUser = value;
  }

  get currentUser(): CurrentUser {
    // if (!this._currentUser) {
      if (sessionStorage.getItem('_vdl_')) {
        this._currentUser = JSON.parse(atob(sessionStorage.getItem('_vdl_')));
      } else {
        this.getCurrentUser().subscribe( response => { this.currentUser = response; } );
      }
    // }
      return this._currentUser;
  }

  set isUserSaml(value: boolean) {
    sessionStorage.setItem('_ius_', btoa(JSON.stringify(value)));
    this._isUserSaml = value;
  }

  get isUserSaml(): boolean {
    if (!this._isUserSaml) {
      if (sessionStorage.getItem('_ius_')) {
        this._isUserSaml = JSON.parse(atob(sessionStorage.getItem('_ius_')));
      }
    }
    return this._isUserSaml;
  }

  set isUserGuest(value: boolean) {
    sessionStorage.setItem('_iug_', btoa(JSON.stringify(value)));
    this._isUserGuest = value;
  }

  get isUserGuest(): boolean {
    if (!this._isUserGuest) {
      if (sessionStorage.getItem('_iug_')) {
        this._isUserGuest = JSON.parse(atob(sessionStorage.getItem('_iug_')));
      }
    }
    return this._isUserGuest;
  }

  set userApps(value: string[]) {
    sessionStorage.setItem('_iua_', btoa(JSON.stringify(value)));
    this._userApps = value;
  }

  get userApps(): string[] {
    if (!this._userApps) {
      if (sessionStorage.getItem('_iua_')) {
        this._userApps = JSON.parse(atob(sessionStorage.getItem('_iua_')));
      }
    }
    return this._userApps;
  }

  constructor(
    private http: HttpClient,
    private secService: SecurityService,
    private utilitiesService: UtilitiesService,
    private global: GlobalVariable
    ) {
    this.globalsVar = globals;
  }

  setSUAValue(){
      this.passwordSua = '?P4ssw0rdVdesk?';
      this.clientIdSUA = "zHVlIXyDTpnBovaCH3tfwOqDnfQa";
  }

  /**
   * User Login
   * @param user is the login form
   */
  signIn(user: any): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/login`,
      user,
      { headers: this.headers, withCredentials: true, observe: 'response' }
    );
  }

  /*find if is an Admin User*/
  isUserManager(): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/vdeskintegration/usermanager`, {}
    );
  }
  isFolderGroupManager(): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/vdeskintegration/foldermanager`, {}
    );
  }

  isUserEnable(username): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/vdeskintegration/user/isenableuser`, username);
  }


  totpChallenge(user: any): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/challenge`,
      user,
      { headers: this.headers, withCredentials: true, observe: 'response' }
    );
  }

  totpChallengeSaml(user: any): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/vdeskintegration/challenge`,
      user,
      { headers: this.headers, withCredentials: true, observe: 'response' }
    );
  }

  isForced(): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/twofactorauth`, {} ,
    { headers: this.headers, withCredentials: true, observe: 'response' });
  }

  backupCodeChallenge(user: any): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/challenge?challengeProviderId=backup_codes`,
      user,
      { headers: this.headers, withCredentials: true, observe: 'response' }
    );
  }


  /**
   * Get JWT token from local storage
   */
  getToken() {
    return sessionStorage.getItem('access_token');
  }

  /**
   * Check if the user is logged in
   */
  get isLoggedIn(): boolean {
    // const authToken = sessionStorage.getItem('access_token');
    // return (authToken !== null && authToken !== '') ? true : false;

    const user = sessionStorage.getItem('user');
    return (user !== null && user !== '' && user !== undefined) ? true : false;
  }

  /**
   * Get the current user info
   */
  getCurrentUser(): Observable<CurrentUser> {
    return this.http.get<any>(`${globals.endpoint}/user/currentuser`).map(response => response.ocs.data);
  }

  /**
   * User Logout
   */
  doLogout(): Observable<any> {
    let token = sessionStorage.getItem('access_token');
    if(!token)
      token = this.getCookie('access_token');
    this.isAuslBo = (this.globalsVar.customCustomer.toLowerCase() == 'auslbo') ? true : false;
    if(this.isAuslBo){
      let httpOptions = {
        headers: new HttpHeaders({ "AddressIp": this.global.addressIp }), withCredentials: true
      }  
      return this.http.get<any>(`${globals.endpoint}/logout?requesttoken=` + token, httpOptions);
    } else {
      return this.http.get<any>(`${globals.endpoint}/logout?requesttoken=` + token);
    }
  }

  /**
   * User Password Recovery
   * @param form is password recovery form
   */
  passwordRecovery(form: any): Observable<any> {
    return this.http.post<any>(`${globals.endpoint}/password-recovery`,
      JSON.stringify({ user: form.user }),
      { headers: this.headers, withCredentials: true, observe: 'response' }
    );
  }

  /**
   * Confirm action with password
   * @param data
   */
  confirm(data: any) {
    var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
    var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
    data["password"] = this.utilitiesService.encryptPass(data["password"],keyString,ivString) + " " + keyString + " " + ivString;
    return this.http.post<any>(`${globals.endpoint}/confirm`, data);
  }

  setVCCookies(currentUser: CurrentUser) {
    const hostname = window.location.hostname;
    const currentDomain = hostname.substr(hostname.indexOf('.') + 1);

    // Set VC cookies
    document.cookie = 'vc_user=' + this.secService.encrypt(currentUser.id) + ';domain=' + currentDomain;
    document.cookie = 'vc_cu=' + this.secService.encryptObj(currentUser) + ';domain=' + currentDomain;
    document.cookie = 'vc_language=' + currentUser.language + ';domain=' + currentDomain;
  }

  removeVCCookies() {
    const expiration = 'Thu, 01 Jan 1970 00:00:00 GMT';
    // Remove VC cookies
    document.cookie = 'vc_user= ;expires=' + expiration;
    document.cookie = 'vc_cu= ;expires=' + expiration;
    document.cookie = 'vc_language= ;expires=' + expiration;
  }

  removeVCCookiesSUA() {
    // Remove SUA cookies
    const expiration = 'Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'app-id-token= ;expires=' + expiration;
    document.cookie = 'bearer= ;expires=' + expiration;
  }

  updateLanguageCookie(languageValue: string) {
    const hostname = window.location.hostname;
    const currentDomain = hostname.substr(hostname.indexOf('.') + 1);
    document.cookie = 'vc_language=' + languageValue + ';domain=' + currentDomain;
  }

  getTokenApi() {
    return this.http.get<any>(`${globals.endpoint}/token`).subscribe((result: any) => {
    });
  }

  // Error handler
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  startV2Flow(): Observable<FlowV2Model>{
    return this.http.post<any>(`${globals.endpoint}/login/v2`, null);
  }

  verifyV2Token(token: string): Observable<VerifyTokenModel>{
    return this.http.get<any>(`${globals.endpoint}/login/v2/flow/` + token);
  }

  grantV2Access(token: string): Observable<V2AccessResponse> {
    if (this.isUserSaml) {
      return this.http.post<any>(`${globals.endpoint}/login/v2/flow/client/` + token, null, { withCredentials: true});
    } else {
      return this.http.post<any>(`${globals.endpoint}/login/v2/flow/client/` + token, null);
    }
  }

  isSamlActive(){
    return this.http.post<any>(`${globals.endpoint}/sso/issamlactive`, '');
  }

  callSamlEndpoint(endpoint, idp){
    return this.http.get<any>(`` + endpoint + '?idp=' + idp + '&originalUrl=');
  }

  callGetLanding(value){
    return this.http.get<any>(`` + value + '');
  }

  getGuestUser(){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/userdata?`, '');
  }

  getIPAddress(): Observable<any> {  
    return  this.http.get("https://api.ipify.org/?format=json");  
  }


  getTokenVMeet(uid): Observable<any>{
    return this.http.get<any>( `${globals.vMeetEndpoint}/getusertoken?username=` + uid);
  }


  loginCokies(AppIdToken, BearerValue): Observable<any>{
    return this.http.get<any>
    ( `${globals.customerEndpoint}/apimgu/1.0/utenti/detail?`,
      {   headers: new HttpHeaders({
            'Authorization': `Bearer ` + BearerValue,
            'App-id-token': AppIdToken
          })
      } );
  }

  RegistrationSUA(newUserSUA): Observable<any>{
    return this.http.post<any>( `${globals.endpoint}/registration/registrationSua`, newUserSUA);
  }

  LogoutSUA(body): Observable<any>{
    return this.http.post<any>( `${globals.customerEndpoint}/oauth2/revoke`, body);
  }

  getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  setCookie(name, value, days?) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  removeCookie( name, path?, domain? ) {
    if( this.getCookie( name ) ) {
      document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ((domain)?";domain="+domain:"") +
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
  }

}
