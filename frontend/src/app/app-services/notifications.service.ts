import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from 'src/config/globals';
import { Observable } from 'rxjs';
import { exists } from 'fs';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  onNotificationListChanged: Subject<any>;

  constructor(private http: HttpClient) { 
    this.onNotificationListChanged = new Subject();
  }

  /**
   * Get the notifications capabilities by access token
   */
  getNotifCapabilities(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/notification/capabilities`);
  }

  /**
   * Get all users notifications by access token
   */
  getAllNotifications(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/notification/notifications`);
  }

  /**
   * Get a specific notification by identifier and access token
   * @param id is notification identifier
   */
  getNotification(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/notification/getnotification?id=` + id);
  }

  /**
   * Delete a specific notification by identifier and acccess token
   * @param id is notification identifier
   */
  deleteNotification(id: any): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/notification/deletenotification?id=` + id);
  }

  /**
   * Delete all users notifications
   */
  deleteAllNotification(): Observable<any> {
    return this.http.get<any>(`${globals.endpoint}/notification/deleteallnotification`);
  }

  /**
   * Create user notification
   */
  createNotification(_userId: string, _shortMessage: string, _longMessage: string, _link?: string): Observable<any> {
    const request = {
      userId: _userId,
      shortMessage: _shortMessage,
      longMessage: _longMessage,
      link: _link ? _link : null
    };
    return this.http.post<any>(`${globals.endpoint}/notification/createnotification`, request);
  }

  assignIconToNotification(notifications: any[]) {
    if (notifications) {
      if (notifications.length > 0) {
        const defaultUrl = '../../../assets/notifications/default/icon.svg';
        for (const notification of notifications) {
          const url = '../../../assets/notifications/' + notification.app + '/icon.svg';
          this.imageExists(url, (exist: boolean) => {
            if (exist) {
              notification.iconSrc = url;
            } else {
              notification.iconSrc = defaultUrl;
            }
          });
        }
      }
    }
  }

  imageExists(url: string, callback: any) {
    const img = new Image();
    img.onload = () => { callback(true); };
    img.onerror = () => { callback(false); };
    img.src = url;
  }
}
