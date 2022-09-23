import { Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { globals } from 'src/config/globals';
import { AppConfig } from './app-config';
import { DashboardService } from './app-services/dashboard.service';
import { LanguageService } from './app-services/language.service';
import { AuthenticationService } from './app-shared/authentication.service';
import { IdleTimeService } from './app-shared/idle-time.service';
import { EventService } from './canvas/services/event.service';
import { ConfigService } from './config.service';
import { GlobalVariable } from 'src/app/globalviarables';

export let browserRefresh = false;

export function setBrowserRefresh(value: boolean) {
  browserRefresh = value;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  external: boolean;
  openoffice: boolean;
  config: AppConfig;
  refreshSubs: Subscription;
  showHeader: boolean;
  globalVar: AppConfig;
  showChat = false;

  constructor(
    public authService: AuthenticationService,
    private snackBar: MatSnackBar,
    public langService: LanguageService,
    private configService: ConfigService,
    private vCanvasEventService: EventService,
    private dashboardService: DashboardService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public idleTimeService: IdleTimeService,
    private global: GlobalVariable
  ) {
    this.vCanvasEventService.onHideHeaderClick.subscribe((nothing) => {
      this.external = true;
    });

    this.refreshSubs = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !this.router.navigated;
        if (browserRefresh && this.authService.isLoggedIn) {
          this.idleTimeService.idleTime();
        }
      }
    });
  }

  ngOnInit() {
    this.setIpAddress();

    /** TO DISABLE SCREEN CAPTURE **/
    document.addEventListener('keyup', (e) => {
      if (e.key == 'PrintScreen') {
        navigator.clipboard.writeText('');
        const message = this.langService.dictionary.screenshots_disabled;
        this.snackBar.open(message, '', {
          duration: 3000,
          panelClass: 'toast-error'
        });
      }
    });

    let url = window.location.href;
    this.external = (url.includes('/link/') || url.includes('/canvas/play')) ? true : false; //added canvas for vCanvas loading
    this.openoffice = (url.includes('/onlyoffice') && !url.includes('/adminsettings/onlyoffice')) ? true : false;

    this.config = this.configService.readConfig();

    if (this.config.hasOwnProperty('endpoint')) {
      globals.endpoint = this.config.endpoint;
    }
    if (this.config.hasOwnProperty('vpecEndpoint')) {
      globals.vpecEndpoint = this.config.vpecEndpoint;
    }
    if (this.config.hasOwnProperty('vcalEndpoint')) {
      globals.vcalEndpoint = this.config.vcalEndpoint;
    }
    if (this.config.hasOwnProperty('vCanvasEndpoint')) {
      globals.vCanvasEndpoint = this.config.vCanvasEndpoint;
    }
    if (this.config.hasOwnProperty('vFlowEndpoint')) {
      globals.vFlowEndpoint = this.config.vFlowEndpoint;
    }
    if (this.config.hasOwnProperty('vFlowmanagerEndpoint')) {
      globals.vFlowmanagerEndpoint = this.config.vFlowmanagerEndpoint;
    }
    if (this.config.hasOwnProperty('vMeetEndpoint')) {
      globals.vMeetEndpoint = this.config.vMeetEndpoint;
    }
    if (this.config.hasOwnProperty('vMeetLink')) {
      globals.vMeetLink = this.config.vMeetLink;
    }
    if (this.config.hasOwnProperty('vDocEndpoint')) {
      globals.vDocEndpoint = this.config.vDocEndpoint;
    }
    if (this.config.hasOwnProperty('isDev')) {
      globals.isDev = this.config.isDev;
    }
    if (this.config.hasOwnProperty('custom_FE')) {
      globals.custom_FE = this.config.custom_FE;
    }
    if (this.config.hasOwnProperty('custom_color')) {
      globals.custom_color = this.config.custom_color;
    }
    if (this.config.hasOwnProperty('custom_logo')) {
      globals.custom_logo = this.config.custom_logo;
    }
    if (this.config.hasOwnProperty('custom_logo_login')) {
      globals.custom_logo_login = this.config.custom_logo_login;
    }
    if (this.config.hasOwnProperty('custom_fontColor')) {
      globals.custom_fontColor = this.config.custom_fontColor;
    }
    if (this.config.hasOwnProperty('mobile_folder')) {
      globals.mobile_folder = this.config.mobile_folder;
    }
    if (this.config.hasOwnProperty('enableCalendar365')) {
      globals.enableCalendar365 = this.config.enableCalendar365;
    }
    if (this.config.hasOwnProperty('customerEndpoint')) {
      globals.customerEndpoint = this.config.customerEndpoint;
    }

    globals.enableVshare = this.config.enableVshare;
    globals.enableVpec = this.config.enableVpec;
    globals.enableVcal = this.config.enableVcal;
    globals.enableVcanvas = this.config.enableVcanvas;
    globals.enableVFlow = this.config.enableVFlow;
    globals.enableVDoc = this.config.enableVDoc;
    globals.enableVmeet = this.config.enableVmeet;
    globals.enableVdpa = this.config.enableVdpa;
    globals.enableV2fa = this.config.enableV2fa;
    globals.enableSaml = this.config.enableSaml;
    globals.enableChat = this.config.enableChat;
    globals.disableDelete = this.config.disableDelete;
    globals.customCustomer = this.config.customCustomer;
    globals.secondsToIdleTime = this.config.secondsToIdleTime; // if it is 0 the inactivity time will be automatically set to 1200
    globals.enableCalendar365 = this.config.enableCalendar365;
    globals.enableSchedule = this.config.enableSchedule;
    globals.expAdminMail = this.config.expAdminMail;

    this.globalVar = globals;

    // Set cobranding main color
    if (this.globalVar.custom_color !== '' && this.globalVar.custom_FE !== 'NONE') {
      document.documentElement.style.setProperty('--cobranding-color', this.globalVar.custom_color);
    }

    // Set cobranding font color
    if (this.globalVar.custom_fontColor && this.globalVar.custom_FE !== 'NONE') {
      document.documentElement.style.setProperty('--central-font-color', '#00396A');
    }

    this.dashboardService.showHeader.subscribe(response => {
      if (typeof response === 'boolean') {
        this.showHeader = response;
      }
    });
  }

  async setIpAddress() {
    if(this.global.addressIp == "") {        
      const result = await this.authService.getIPAddress().toPromise();
      this.global.addressIp = result.ip;    
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  openCloseChat(openChat: boolean) {
    this.showChat = !this.showChat;
  }

  ngOnDestroy() {
    if (this.refreshSubs) {
      this.refreshSubs.unsubscribe();
    }
  }
}
