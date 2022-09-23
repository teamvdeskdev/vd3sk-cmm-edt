import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from 'src/config/globals';
import { DeviceSessionBody, DeviceSessionResp } from '../../app-model/settings/DeviceSessionResp';
import { UtilitiesService } from 'src/app/app-services/utilities.service';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {

  constructor(private http: HttpClient,
              private utilitiesService: UtilitiesService) { }

  /**
   * Confirm action with password
   * @param data
   */
  confirm(data: any) {
    var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
    var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
    data["password"]  = this.utilitiesService.encryptPass(data["password"] ,keyString,ivString) + " " + keyString + " " + ivString; 
    return this.http.post<any>(`${globals.endpoint}/confirm`, data);
  }

  /**
   * Enable Two Factor authentication
   * @param data
   */
  enableTwoFactor(data: any) {
    return this.http.post<any>(`${globals.endpoint}/twofactorenable`, data);
  }

  enableTwoFactorSaml(data: any) {
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/twofactorenable`, data);
  }

  /**
   * Regenerate backup codes for two factor authentication
   */
  regenerateBackupCodes() {
    return this.http.post<any>(`${globals.endpoint}/setting/security/backupcode`, {});
  }

  regenerateBackupCodesSaml(): Observable<any> {
    return this.http.post<any>(
      `${globals.endpoint}/vdeskintegration/createbackupcodes`, {});
  }

  /**
   * Upload the profile picture from user device filesystem
   * @param image
   */
  uploadAvatar(file: any) {
    const fileAsBlob = new Blob([file]);
    return this.http.post<any>(`${globals.endpoint}/setting/info/avatar/uploadavatar`, fileAsBlob);
  }

  /**
   * Save the cropped image as user profile image
   * @param data
   */
  cropImage(data: any) {
    return this.http.post<any>(`${globals.endpoint}/setting/info/avatar/cropped`, data);
  }

  /**
   * Delete the user current profile picture
   */
  deleteAvatar() {
    return this.http.get<any>(`${globals.endpoint}/setting/info/avatar/deleteavatar`);
  }

  /**
   * Get the global encryption configuration
   */
  getEncryptionConfig() {
    return this.http.post<any>(`${globals.endpoint}/vencrypt/config/get`, {});
  }
  
  /**
   * Set first password changed for guest user
   */
  setChangedPassword(userid){
    const data = {
      "username": userid
    }
    return this.http.post<any>(`${globals.endpoint}/vdeskintegration/user/setchangepassword`, data);
  }

  /**
   * Set the global encryption configuration
   * @param data is form data
   */
  setEncryptionConfig(data: any) {
    return this.http.post<any>(`${globals.endpoint}/vencrypt/config/set`, data);
  }

  /**
   * Change user password
   * @param data is form data
   */
  changeUserPassword(data: any) {
    return this.http.post<any>(`${globals.endpoint}/setting/security/changepassword`, data);
  }

  /**
   * Change user data
   * @param userId is user
   * @param data is form data
   */
  updateUser(userId: string, data: any) {
    if (data["key"]=="password")
    {
        var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
        var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
        data["value"]  = this.utilitiesService.encryptPass(data["value"]  ,keyString,ivString) + " " + keyString + " " + ivString; 
    }
    return this.http.put<any>(`${globals.endpoint}/user/updateuser?userid=` + userId, data);
  }

  confirmPassword(password: string){
    var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
    var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
    password  = this.utilitiesService.encryptPass(password ,keyString,ivString) + " " + keyString + " " + ivString; 
    return this.http.post<any>(`${globals.endpoint}/confirm?`, {password: password});
  }

  /**
   * Get Device and Session
   */
  getDeviceSession(): Observable<DeviceSessionResp> {
    return this.http.get<DeviceSessionResp>(`${globals.endpoint}/setting/security/getDeviceSession`);
  }

  /**
   * Revocation device
   * @param deviceId id from device
   */
  revocationDevice(deviceId: string | number) {
    return this.http.delete<any>(`${globals.endpoint}/setting/security/revokedevices?id=` + deviceId);
  }

  /**
   * Delete device
   * @param deviceId id from device
   */
  deleteDevice(deviceId: string | number) {
    return this.http.post<any>(`${globals.endpoint}/setting/security/canceldevices?id=` + deviceId, {});
  }

  /**
   * Rename device
   * @param device device to update
   */
  renameDevice(device: DeviceSessionBody) {
    return this.http.post<any>(`${globals.endpoint}/setting/security/updatedevices?id=` + device.id, device);
  }
}
