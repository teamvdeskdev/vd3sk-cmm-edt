import { Injectable } from '@angular/core';
import { AppInterface } from '../app-interfaces/app.interface';
import { UserInterface } from '../app-interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  isDashboard: boolean;
  isDownload: boolean;
  isCalendar: boolean;
  isMail: boolean;
  isFileSharing: boolean;
  isCanvas: boolean;
  isFlow: boolean;
  isTask: boolean;
  isDoc: boolean;
  apps: AppInterface[];
  user: UserInterface;

  constructor() {
    this.user = {
      label: 'Davide Buccella',
      eMail: 'davide.buccella@liveboxcloud.com'
    }
    this.apps = [
      /*
      {
        name: 'dashboard',
        selected: null,
        value: 'vDesk'
      },
      */
      {
        name: 'filesharing',
        selected: null,
        value: 'vShare'
      },
      {
        name: 'mail',
        selected: null,
        value: 'vPEC'
      },
      {
        name: 'calendar',
        selected: null,
        value: 'vCal'
      },
      {
        name: 'canvas',
        selected: null,
        value: 'vCanvas'
      },
      {
        name: 'flow',
        selected: null,
        value: 'vFlow'
      }
    ];
    var url = window.location.href.split('/');
    switch (url[3]) {
      case 'dashboard':
        this.isDashboard = true;
        break;
      case 'download':
        this.isDownload = true;
        break;
      case 'calendar':
        this.isCalendar = true;
        break;
      case 'mail':
        this.isMail = true;
        break;
      case 'filesharing':
        this.isFileSharing = true;
        break;
      case 'canvas':
        this.isCanvas = true;
        break;
      case 'flow':
        this.isFlow = true;
        break;
      case 'settings':
        this.isDashboard = true;
        break;
      default:
        this.isDashboard = true;
        break;
    }
    // Setting apps for select...
    this.apps.forEach(app => {
      if (url[3] == app.name) {
        app.selected = true;
      } else {
        app.selected = null;
      }
    });
  }
}
