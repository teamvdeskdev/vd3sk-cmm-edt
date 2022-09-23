import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  fileInfo = new BehaviorSubject<any>('');
  changeUserLanguage = new BehaviorSubject<boolean>(false);
  dashboardGoToSettings = new BehaviorSubject<boolean>(false);
  goToSignedDocument = new BehaviorSubject<boolean>(false);
  selectVshareFromHeader = new BehaviorSubject<boolean>(false);
  reloadMailPage = new BehaviorSubject<string>('');
  // For change path event
  private pathSource = new BehaviorSubject('');
  currentPath = this.pathSource.asObservable();
  // For send message in background event
  private sendMsgInBackgroundSource = new BehaviorSubject(null);
  sendMsgInBackground = this.sendMsgInBackgroundSource.asObservable();

  dataFavoritesCard: any;
  file: any;
  sharedFileId: any;
  savePath: string;
  userGeolocation: GeolocationModel;
  weatherData: WeatherModel;

  constructor() { }

  public getFavoritesCardData() {
    return this.dataFavoritesCard;
  }

  public setFavoritesCardData(data: any) {
    this.dataFavoritesCard = data;
  }

  setFileInfo(info: any) {
    this.fileInfo.next(info);
  }

  setFile(file: any) {
    this.file = file;
  }

  getFile() {
    return this.file;
  }

  setSavePath(path: string) {
    this.savePath = path;
  }

  getSavePath() {
    return this.savePath;
  }

  setUserPosition(obj: GeolocationModel) {
    this.userGeolocation = obj;
  }

  getUserPosition() {
    return this.userGeolocation;
  }

  setWeatherData(obj: WeatherModel) {
    this.weatherData = obj;
  }

  getWeatherData() {
    return this.weatherData;
  }

  public getSharedFileId(): any {
    return this.sharedFileId;
  }

  public setSharedFileId(value: any) {
    this.sharedFileId = value;
  }

  changePath(path: string) {
    this.pathSource.next(path);
  }

  onSendMsgInBackground(dataObj: any) {
    this.sendMsgInBackgroundSource.next(dataObj);
  }

  reloadMail(mail: string) {
    this.reloadMailPage.next(mail);
  }
}

export class GeolocationModel {
  public latitude: number;
  public longitude: number;
}

export class WeatherModel {
  public cityName: string;
  public weatherIcon: string;
  public weatherMain: string;
  public weatherDescription: string;
  public weatherTemp: number;
}
