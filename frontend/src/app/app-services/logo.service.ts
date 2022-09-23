import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoService {

  launcherClick: EventEmitter<any>;

  profilePictureChange: EventEmitter<any>;

  constructor() {
    this.launcherClick = new EventEmitter();
    this.profilePictureChange = new EventEmitter();
  }

  onLauncherClick(data) {
    this.launcherClick.emit(data);
  }

  onProfilePictureChange(data) {
    this.profilePictureChange.emit(data);
  }
}
