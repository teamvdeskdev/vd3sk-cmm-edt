import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { globals } from 'src/config/globals';
import { ServiceSettings, ServiceSettingsResponse } from '../../app-model/admin-settings/ServiceSettingsResponse';
import { UpdateOnlyOfficeUrlModel } from '../../app-model/admin-settings/UpdateOnlyOfficeUrlModel';
import { UpdateOnlyOfficeUrlRequest } from '../../app-model/admin-settings/UpdateOnlyOfficeUrlRequest';
import { InstanceConfigDto, InstanceConfigResponse } from '../../app-model/admin-settings/InstanceConfigResponse';
import { Domain, DomainResponse, DomainToAdd, DomainImapToAdd, DomainImap } from '../../app-model/admin-settings/DomainModel';
import { SignatureProviderDto, SignatureProviderResponse } from '../../app-model/admin-settings/SignatureProviderResponse';
import { SmtpCredentialsModel, SmtpSettingsModel } from 'src/app/app-model/admin-settings/SmtpSettingsModel';
import { SettingsModel } from 'src/app/vdoc/models/SettingsModel';
import { DataService as VDocDataSercice } from 'src/app/vdoc/vdoc.data.service';
import { keyBy } from 'lodash';
import { UtilitiesService } from 'src/app/app-services/utilities.service';

export const WFAPI_DATA_URL = globals.vFlowmanagerEndpoint;
export const HttpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class AdminSettingsService {


  constructor(private http: HttpClient,
              private utilitiesService: UtilitiesService) { }

  /**
   * Get onlyoffice url
   */
  getOnlyOfficeUrl(): Observable<string> {
    return this.http.get<string>(`${globals.endpoint}/setting/onlyoffice/getUrlServerOnlyOffice`).map(response => response['url']);
  }

  /**
   * Update Only Office Url
   * @param data
   * Save service data
   * @param serviceData service data
   */
  UpdateOnlyOfficeUrl(data: UpdateOnlyOfficeUrlRequest) {
    return this.http.post<UpdateOnlyOfficeUrlModel>(`${globals.endpoint}/setting/onlyoffice/updateUrlServerOnlyOffice`, data);
  }

  public async GetSettings(request: SettingsModel): Promise<SettingsModel> {
    const dataService = new VDocDataSercice(this.http);
    const model = await dataService.SettingsGet(request);
    return model;
  }

  public async SaveSettings(request: SettingsModel): Promise<SettingsModel> {
    const dataService = new VDocDataSercice(this.http);
    const model = await dataService.SettingsSave(request);
    return model;
  }

  /**
   public getSmtpSettings() {
    return this.http.get<any>(`${globals.endpoint}/vdeskintegration/setting/basic/getMailSettings`);
  }
   */
  public getSmtpSettings() {
    return Observable.of({      
        "mail_smtpmode": "smtp",
        "mail_smtpsecure": "ssl",
        "mail_sendmailmode": "smtp",
        "mail_from_address": "test",
        "mail_domain": "test.nonso.com",
        "mail_smtpauthtype": "PLAIN",
        "mail_smtpauth": 1,
        "mail_smtphost": "smtp.esempio.com",
        "mail_smtpport": "1234",
        "mail_smtpname": "smtpuser",
        "mail_smtppassword": "smtppass"
    });
  }
  public saveSmtpSettings(smtpSettings: SmtpSettingsModel) {
    return this.http.post<any>(`${globals.endpoint}/setting/basic/mailsetting`, smtpSettings);
  }
  public sendTestEmail() {
    return this.http.post<any>(`${globals.endpoint}/setting/basic/mailtest`, '');
  }

  public saveSmtpCredentials(smtpSettings: SmtpCredentialsModel) {
    return this.http.post<any>(`${globals.endpoint}/setting/basic/credential`, smtpSettings);
  }
  public saveServiceData(serviceSettings: ServiceSettings) {
    return this.http.post<any>(`${globals.vCanvasEndpoint}/savesettings`, serviceSettings);
  }

  public getServiceData(): Observable<ServiceSettingsResponse> {
    return this.http.get<any>(`${globals.vCanvasEndpoint}/getsettings`);
  }

  public getAllowDomain(): Observable<InstanceConfigResponse> {
    return this.http.post<any>(`${globals.vpecEndpoint}/allowcustomdomains`, '');
  }

  public setAllowDomain(allowCustomDomains: InstanceConfigDto) {
    return this.http.post<any>(`${globals.vpecEndpoint}/allowcustomdomains`, allowCustomDomains);
  }

  public getAllDomains(): Observable<DomainResponse> {
    const body = {
      id: 1,
      name: 'Google',
      active: '1',
      imapHost: 'imap.gmail.com',
      imapPort: '993',
      imapProtocol: 'imap',
      imapEncryption: 'ssl',
      imapValidateCert: '0',
      smtpHost: 'smtp.gmail.com',
      smtpPort: '465',
      smtpEncryption: 'ssl',
      smtpUseAuth: '1'
    };
    return this.http.post<any>(`${globals.vpecEndpoint}/domain/get`, body);
  }

  public getAllDomainsImap(): Observable<any>  {
    return this.http.post<any>(`${globals.vpecEndpoint}/settings/listnoauthhost`, {});
  }


  public addDomain(domain: DomainToAdd) {
    return this.http.post<any>(`${globals.vpecEndpoint}/domain/createorupdate`, domain);
  }

  public addDomainImap(domainImap: DomainImapToAdd) {
    const body = {
      section: domainImap.type,
      url: domainImap.url
    }
    return this.http.post<any>(`${globals.vpecEndpoint}/settings/createnoauthhost`, body);
  }

  public deleteDomainImap(domainImap: DomainImapToAdd) {
    const body = {
      section: domainImap.type,
      url: domainImap.url
    }
    return this.http.post<any>(`${globals.vpecEndpoint}/settings/deletenoauthhost`, body);
  }
  

  public deleteDomain(domainId: number) {
    const body = {
      id: domainId,
    }
    return this.http.post<any>(`${globals.vpecEndpoint}/domain/delete`, body);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~ SETTINGS: USER ~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /** CONFIRM PASSWORD
   * Used as confirm user settings action
   * 2.6 bridgeAPI
   * POST
   * @param password (string) user password
   */
  confirmPassword(password: string) {
    var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
    var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
    password  = this.utilitiesService.encryptPass(password ,keyString,ivString) + " " + keyString + " " + ivString; 
    return this.http.post<any>(`${globals.endpoint}/confirm?`, { password: password });
  }

  /** USER SEARCH USER
   * Get all users
   * 6.1 bridgeAPI
   * GET
   */
  userSearchUser(offset: number, name: string) {
    if (!name) {
       name = '';
    }
    if (!offset) {
      offset = 0;
    }
    return this.http.get<any>(`${globals.endpoint}/user/searchuser?format=json&offset=` + offset + `&limit=25&search=` + name);
  }

  /** USER SEARCH USER
   * Get all users even if the caller is not an admin user
   * 6.1 bridgeAPI
   * GET
   */
  userSearchUserNoAdmin(name: string) {
    if (!name) {
       name = '';
    }
    return this.http.get<any>(`${globals.endpoint}/user/searchusernoadmin?format=json&offset=0&search=` + name + `&limit=1000`);
  }

  /** USER SEARCH ALL USER
   * Get all users
   * 6.1 bridgeAPI
   * GET
   */
   userSearchAllUser(offset: number, name: string) {
    if (!name) { name = ''; }
    if (!offset) { offset = 0; }
    return this.http.get<any>(`${globals.endpoint}/user/searchuser?format=json&offset=` + offset + `&search=` + name);
  }

  /** USER SEARCH USER New (with userManager)
   * Get all users
   * POST
   */
  userSearchUserList(data: any) {
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/users/list?format=json`, data);
  }

 /** USER SEARCH USER FILTERED New (with userManager)
  * Get filtered users
  * POST
  */
  filteredUserList(body) {
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/users/list?format=json`, body);
  }

  /** USER MANAGER
   * Enabled/disabled user Manager
   * POST
   */
   EnableUserManager(data){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/usermanager/createorupdate`, data);
   }

   /** FOLDER MANAGER
   * Enabled/disabled folder Manager
   * POST
   */
    EnableFolderManager(data){
      return this.http.post<any>(`${globals.endpoint}/vdeskintegration/foldermanager/createorupdate`, data);
     }

  /** USER MANAGER
   * Set user Manager
   * POST
   */
   isUserManager(user: any): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/vdeskintegration/usermanager`, user );
  }

  /** USER DELETE USER
   * Delete single user
   * 6.2 bridgeAPI
   * DELETE
   * @param id (string) id user
   */
  userDeleteUser(id: string) {
    return this.http.delete<any>(`${globals.endpoint}/user/deleteuser?userid=` + id);
  }

  /** USER ADD USER
   * Add new user
   * 6.5 bridgeAPI
   * POST
   * @param element (any) user info
   */
  userAddUser(element: any) {
    
    var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
    var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
    element.password  = this.utilitiesService.encryptPass(element.password ,keyString,ivString) + " " + keyString + " " + ivString; 

    let body = {
      displayName: element.displayName,
      email: element.email,
      groups: element.groups,
      language: 'it',
      password: element.password,
      quota: element.quota,
      subadmin: [],
      userid: element.userid
    };

    return this.http.post<any>(`${globals.endpoint}/user/adduser?`, body);
  }

  /** USER UPDATE USER
   * Update user
   * 6.9 bridgeAPI
   * GET
   * @param id (string) id user
   */
  userUpdateUser(value: any) {

    if (value.key=="password")
    {
        var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
        var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
        var encryptPassword = value.value;
        encryptPassword  = this.utilitiesService.encryptPass(encryptPassword ,keyString,ivString) + " " + keyString + " " + ivString; 
        var body = {
          key: value.key,
          value: encryptPassword,
        };
    } else {
      var body = {
        key: value.key,
        value: value.value,
      };
    }
    return this.http.put<any>(`${globals.endpoint}/user/updateuser?userid=` + value.id, body);
  }

  /** USER REMOVE DEVICES
   * Remove all user devices
   * 6.10 bridgeAPI
   * GET
   * @param id (string) id user
   */
  userRemoveDevices(id: string) {
    return this.http.get<any>(`${globals.endpoint}/user/wipeuserdevices?userid=` + id);
  }

  /** USER ENABLE USER
   * Enable user
   * 6.11 bridgeAPI
   * PUT
   * @param id (string) id user
   */
  userEnableUser(id: string) {
    return this.http.put<any>(`${globals.endpoint}/user/enableuser?userid=` + id, {});
  }

  /** USER DISABLE USER
   * Disable user
   * 6.12 bridgeAPI
   * PUT
   * @param id (string) id user
   */
  userDisableUser(id: string) {
    return this.http.put<any>(`${globals.endpoint}/user/disableuser?userid=` + id, {});
  }

  /** USER ADD GROUP
   * Add user to group
   * 6.14 bridgeAPI
   * POST
   * @param id (string) id user
   * @param group (string) id group
   */
  userAddGroup(id: string, group: string) {
    return this.http.post<any>(`${globals.endpoint}/user/addtogroup?userid=` + id, { groupid: group });
  }

  /** USER REMOVE GROUP
   * Remove user from group
   * 6.15 bridgeAPI
   * DELETE
   * @param id (string) id user
   * @param group (string) id group
   */
  userRemoveGroup(id: string, group: string) {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        groupid: group
      }
    }
    return this.http.delete<any>(`${globals.endpoint}/user/removefromgroup?userid=` + id, options);
  }

  /** USER SEARCH GROUPS
   * Get all groups
   * 6.16 bridgeAPI
   * GET
   */
  userGetGroups() {
    return this.http.get<any>(`${globals.endpoint}/user/getgroups?`);
  }

  /** USER SEARCH GROUPS DETAILS
   * Get list groups with details
   * 6.17 bridgeAPI
   * GET
   */
  userGetGroupsDetails() {
    return this.http.get<any>(`${globals.endpoint}/user/getgroupdetails?`);
  }

  /** USER GET GROUPS USER
   * Get user by groups
   * 6.19 bridgeAPI
   * GET
   */
  userGetGroupsUser(name: string) {
    return this.http.get<any>(`${globals.endpoint}/user/getgroupuserdetail?groupid=` + name);
  }

  /** USER ADMIN GROUPS
   * Get admin groups
   * 6.20 bridgeAPI
   * GET
   */
  userAdminGroups(name: string) {
    return this.http.get<any>(`${globals.endpoint}/user/getsubadminofgroup?groupid=` + name);
  }

  /** USER CREATE GROUPS
   * Create new group
   * 6.21 bridgeAPI
   * POST
   */
  userCreateGroups(name: string) {
    return this.http.post<any>(`${globals.endpoint}/user/addgroup?`, { 'groupid': name });
  }

  /** USER DELETE GROUPS
   * Delete groups
   * 6.23 bridgeAPI
   * DELETE
   */
  userDeleteGroups(name: string) {
    return this.http.delete<any>(`${globals.endpoint}/user/deletegroup?groupid=` + name);
  }

  /** USER SEND WELCOME MAIL
   * Resend welcome mail
   * 6.27 bridgeAPI
   * POST
   */
  userSendWelcomeMail(userid: string) {
    return this.http.post<any>(`${globals.endpoint}/user/resendWelcomeMessage?userid=` + userid, '');
  }

  public getSignatureProviders(): Observable<SignatureProviderResponse> {
    const body = {
      getDisabled : true,
    };
    return this.http.post<any>(`${globals.endpoint}/signature/service/getall`, body);
  }

  public updateSignatureProvider(provider: SignatureProviderDto) {
    const body = {
      request: provider,
    };
    return this.http.post<any>(`${globals.endpoint}/signature/dds/setsignatureservice`, body);
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~ SETTINGS: GUEST ~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  /** GET APPS GUEST
   * Used for gettin the apps for guest
   * 2.7.1 bridgeAPI
   * GET
   */
  getAppsGuest() {
    return this.http.post<any>(`${globals.endpoint}/vdesk_tim/enabledapps?`, {});
  }

  /** REGISTER GUEST
   * Used for register guest
   * 2.7.2 bridgeAPI
   * POST
   */
   registerGuest(body: any) {
    return this.http.post<any>(`${globals.endpoint}/registration/validateEmail?`, body);
  }

  /** GET GUEST LIST
   * Return guest list
   * 2.8 bridgeAPI
   * GET
   **/
  getGuestList(body: any) {
    return this.http.get<any>(`${globals.endpoint}/registration/getUserGuestDetail?groupid=` + body);
  }

  /** UPDATE GUEST
   * Update current guest
   * 2.9 bridgeAPI
   * POST
   **/
  updateGuest(body: any) {
    return this.http.post<any>(`${globals.endpoint}/registration/updateDataUser?`, body);
  }

  /** CREATE OR UPDATE SAML
   * 
  */
  samluserCreateUpdate(body: any) {
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/saml/user/createorupdate`, body);
  }

  getReport(){
    return this.http.get<any>(`${globals.endpoint}/vdesk_tim/export`);
  }

  /** USERSAML DELETE USER
   * Delete user used by SAML user
   **/
  usersamlDeleteUser(id: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/deleteuser`, { userid: id });
  }

  /** USERSAML WIPE DEVICES
   * Delete user used by SAML user
   **/
  usersamlWipeDevices(id: any) {
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/wipeuserdevices`, { userid: id });
  }

  /** USERSAML UPDATE USER
   * Delete user used by SAML user
   **/
  usersamlUpdateUser(value){
    let body = {
      userid: value.id,
      key: value.key,
      value: value.value,
    };
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/updateuser`, body);
  }

  /** USERSAML ADD TO GROUP
   * Delete user used by SAML user
   **/
  usersamlAddToGroup(id: any, groupid: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/addtogroup`, { userId: id, groupid: groupid });
  }

  /** USERSAML REMOVE FROM GROUP USER
   * Delete user used by SAML user
   **/
  usersamlRemoveFromGroup(id: any, groupid: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/removefromgroup`, { userId: id, groupid: groupid });
  }

  /** USERSAML ADD USER
   * Add user used by SAML user
   **/
  usersamlAddUser(element: any){
    let body = {
      displayName: element.displayName,
      email: element.email,
      groups: element.groups,
      language: 'it',
      password: element.password,
      quota: element.quota,
      subadmin: [],
      userid: element.userid
    };
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/adduser`, body);
  }

  /** USERSAML DISABLE USER
   * Disable user used by SAML user
   **/
  usersamlDisableUser(id: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/disableuser`, { userId: id });
  }

  /** USERSAML ENABLE USER
   * Delete user used by SAML user
   **/
  usersamlEnableUser(id: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/enableuser `, { userId: id });
  }

  /** USERSAML RESEND MAIL
   * Delete user used by SAML user
   **/
  usersamlResendMail(id: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/resendWelcomeMessage`, { userid: id });
  }

  /** USERSAML ADD GROUP
   * Delete user used by SAML user
   **/
  usersamlAddGroup(id: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/addgroup`, { groupid: id });
  }

  /** USERSAML REMOVE GROUP
   * Delete user used by SAML user
   **/
  usersamlRemoveGroup(id: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/removegroup`, { groupid: id });
  }

  /** USERSAML ADD APPS
   * Add/remove user apps by SAML user
   * Send an array to add and remove
   * Send a string to add only
   **/
   usersamlAddApps(body: any){
    return this.http.post<any>(`${globals.endpoint}/vdesk_tim/adduserapp`, body);
  }

  /** USERSAML REMOVE APPS
   * Remove user apps by SAML user
   **/
   usersamlRemoveApps(id, apps){
    return this.http.post<any>(`${globals.endpoint}/vdesk_tim/removeuserapp`, { userId: id, vdeskApp: apps });
  }

  /** USERGROUP LIST
   * Remove user apps by SAML user
   **/
   usergroupList(body: any){
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/groups/getgroupusers`, body);
  }

  /** RESET GUEST PASSWORD
     * generate new guest password and reset first access
     **/
  resetGuestUser(data: any){
    return this.http.post<any>(`${globals.endpoint}/registration/changePasswordUser`, data);
  }

   /** UPLOAD NEW USER
     * Import new user from file
     **/
  uploadNewUser(data: any) {
    return this.http.post<any>(`${globals.endpoint}/vdesk_tim/importfromfile`, data);
  }

}
