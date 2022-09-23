import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardCacheService } from 'src/app/app-services/dashboard-cache.service';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { UtilitiesService } from 'src/app/app-services/utilities.service';
import { WeatherService } from 'src/app/app-services/weather.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { UserModel } from 'src/app/flow/models/UserModel';
import { GlobalVariable } from 'src/app/globalviarables';
import { SignatureService } from 'src/app/mail/services/signature.service';
import { UtilService } from 'src/app/mail/services/util.service';
import { globals } from 'src/config/globals';
import { browserRefresh } from '../../app.component';
import { CurrentUser } from '../../app-model/common/user';
import { LanguageService } from 'src/app/app-services/language.service';
import { CacheCardModel } from 'src/app/app-model/dashboard/CacheCardModel';
import { AppConfig } from 'src/app/app-config';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  providers: [DatePipe]
})
export class DownloadComponent implements OnInit {
  user: any;
  currentUser: CurrentUser;
  isAdmin: boolean;
  UserName: string;
  isLoadingPage = false;
  os: string;
  isCardRef = false;
  // barColor = 'white';
  barValue = 0;
  accountIdVPEC: number;
  folderObj: any = {};
  vPecCurrentUser: string;
  vconnectUrl: string;
  vmeetUrl: string;
  dayName: string;
  count = 0;
  cacheModel: CacheCardModel;

  modelUser: UserModel;
  globalsVar: AppConfig;

  constructor(
    public authService: AuthenticationService,
    public spinner: NgxSpinnerService,
    public router: Router,
    public location: Location,
    private dashService: DashboardService,
    private util: UtilitiesService,
    private _const: GlobalVariable,
    private domSanitizer: DomSanitizer,
    private datePite: DatePipe,
    private weatherService: WeatherService,
    private dashboardCacheService: DashboardCacheService,
    public utilService: UtilService,
    public signService: SignatureService,
    public dataSharingService: DataSharingService,
    public langService: LanguageService
  ) {
    this.globalsVar = globals;
    this.vmeetUrl = globals.vMeetLink;



  }

  ngOnInit() {
    this.isLoadingPage = true;
    this.spinner.show();
    this.getOS();
    this.spinner.hide();
    this.isLoadingPage = false;

  }


  getOS() {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'MacOS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }

    this.os = os;
  }


  goBack() {
    this.location.back();
  }

  download() {
    if (this.os != "MacOS") {
      let link = document.createElement("a");
      link.download = "vDesk-installer.exe";
      link.href = "https://hub.liveboxcloud.com/vdesk/vDesk-installer.exe";
      link.click();
    }
    else if (this.os == "MacOS") {
      let link = document.createElement("a");
      link.download = "vDesk-installer.pkg";
      link.href = "https://hub.liveboxcloud.com/vdesk/vDesk-installer.pkg";
      link.click();
    }
    
  }

}
