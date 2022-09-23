import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { DataSharingService, GeolocationModel, WeatherModel } from 'src/app/app-services/data-sharing.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { Router, ActivatedRoute } from '@angular/router';
import { LogoService } from 'src/app/app-services/logo.service';
import { WeatherService } from 'src/app/app-services/weather.service';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { globals } from 'src/config/globals';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from 'src/app/app-services/language.service';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { IdleTimeService } from 'src/app/app-shared/idle-time.service';
import { AppConfig } from 'src/app/app-config';
import { LogoutService } from 'src/app/app-shared/logout.service';

@Component({
  selector: 'app-landingsaml',
  templateUrl: './landingsaml.component.html',
  styleUrls: ['./landingsaml.component.scss']
})
export class LandingsamlComponent implements OnInit {

  globalsVar: AppConfig;
  isTim: boolean;
  getUserManager: any;
  getFolderGroupManager: any;
  
  constructor(
    private authService: AuthenticationService,
    private global: GlobalVariable,
    private dataSharingService: DataSharingService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private logoService: LogoService,
    private weatherService: WeatherService,
    private dashService: DashboardService,
    private logoutService: LogoutService,
    private _snackBar: MatSnackBar,
    public langService: LanguageService,
    public idleTimeService: IdleTimeService
  ) { 
    this.globalsVar = globals;
  }

  ngOnInit(): void {

    if(this.activeRouter.snapshot.queryParams.error && this.activeRouter.snapshot.queryParams.errorcode){

      if(this.activeRouter.snapshot.queryParams.errorcode == 403) {
        this.logoutService.logoutUser()
        this.idleTimeService.stopIdle();
      }

      // let message = (this.activeRouter.snapshot.queryParams.errorcode == 403)? this.langService.dictionary.userAlreadyOnline : this.langService.dictionary.userNotFound;
      // this._snackBar.open(message, '', {
      //   duration: 4000,
      //   panelClass: 'toast-error'
      // });
      else {
        let query = false;
        this.router.navigate(['login'], { queryParams: { query } });
      }
    }else{
      this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
      let logout = this.activeRouter.snapshot.queryParams.logoutUrl;
      this.authService.Logout = logout;
      let username = this.activeRouter.snapshot.queryParams.username;
      let body = {
        "username" : username
      }
      this.authService.isUserEnable(body).subscribe(
        (response: any) => {
          if (response.Performed && !response.isEnabled) {
            this._snackBar.open(this.langService.dictionary.disabled_user, null, {
              duration: 4000,
              panelClass: 'toast-error'
            });
            this.callGet(logout);
            this.router.navigate(['login']);
            return;
          } else if (response.Performed && response.isEnabled) {
            let token = this.activeRouter.snapshot.queryParams.requesttoken;
            let totpstate = this.activeRouter.snapshot.queryParams.totpstate;
            this.authService.isUserSaml = true;
            this.authService.isForced().subscribe( response => {
              if ( response.body.enforced !== undefined && response.body.enforced === true ) {
                if ( totpstate === '0') {
                  sessionStorage.setItem('forced', 'true');
                  sessionStorage.setItem('access_token', token);
                  this.router.navigate(['login/totp']);
                } else if (totpstate === '2') {
                  sessionStorage.setItem('access_token', token);
                  this.router.navigate(['login/totp']);
                }
              } else {
                if (totpstate === '0') {
                  this.loginUser(token);
                  if(this.isTim){
                    this.callGet(logout);
                  }
                } else if (totpstate === '2') {
                  sessionStorage.setItem('access_token', token);
                  this.router.navigate(['login/totp']);
                }
              }
            });
          }
        },
        (error: any) => {
          this._snackBar.open(this.langService.dictionary.user_dont_exist, null, {
            duration: 4000,
            panelClass: 'toast-error'
          });
          this.callGet(logout);
          this.router.navigate(['login']);
          return;
        }
      );
      
    }
  }

  async callGet(data: string){
    let waitService = await this.authService.callGetLanding(data).toPromise();
  }

  loginUser(token: string) {
    sessionStorage.setItem('access_token', token);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setUserPosition.bind(this));
    }

    setTimeout(async () => {
      // Get user data especially enabled apps - valide for all types of user
      if(!this.isTim){
        let waitService = await this.authService.getGuestUser().toPromise();
        if(waitService.Performed){
          this.authService.isUserGuest = waitService.UserData.isGuest;
          this.authService.userApps = waitService.UserData.userApps;
        } else {
          this.authService.isUserGuest = false;
        }
      }
      
      const currentUser = await this.authService.getCurrentUser().toPromise();
      if (this.isTim){
        this.getUserManager = await this.authService.isUserManager().toPromise();
        this.getFolderGroupManager = await this.authService.isFolderGroupManager().toPromise();
      } else {
        this.getUserManager = false;
        this.getFolderGroupManager = false;
      }

      // Start idle time
      this.idleTimeService.idleTime();

      if (currentUser !== undefined && currentUser !== null) {

        if(this.globalsVar.enableVmeet){
          const VMeetToken = await this.authService.getTokenVMeet(currentUser.id).toPromise();
          if( VMeetToken !== undefined && VMeetToken !== null && VMeetToken.performed == true) {
              sessionStorage.setItem('VMeet_Token', VMeetToken.token);
          }
        }
        this.authService.currentUser = currentUser;
        this.authService.setVCCookies(currentUser);
        sessionStorage.setItem('user', currentUser.id);
        sessionStorage.setItem('user_language', currentUser.language);
        sessionStorage.setItem('groups', JSON.stringify(currentUser.groups));
        this.global.isUserAdmin = (currentUser.groups.includes('admin')) ? true : false;
      }
      if ( this.getUserManager.IsUserManager !== undefined && this.getUserManager.IsUserManager !== null ) {
        this.authService.userManager = this.getUserManager.IsUserManager;
        sessionStorage.setItem('userManager', this.getUserManager.IsUserManager);
      }
      if ( this.getFolderGroupManager.IsFolderManager !== undefined && this.getFolderGroupManager.IsFolderManager !== null ) {
        this.authService.IsFolderManager = this.getFolderGroupManager.IsFolderManager;
        sessionStorage.setItem('folderManager', this.getFolderGroupManager.IsFolderManager);
      }

      const location = window.location;
      const url = unescape(location.href);
      if (url.includes('flow')) {
        const index = url.lastIndexOf('pid');
        const pid = url.substr(index + 4, url.length);
        this.router.navigate(['flow'], { queryParams: { pid } });

      } else if (url.includes('index.php/f')) {
        const urlArray = url.split('/');
        const id = urlArray[urlArray.length - 1];
        this.dataSharingService.setSharedFileId(id);
        await this.dashboardInitialSettings();
        this.router.navigate(['filesharing']).finally(() => {
          this.logoService.onLauncherClick('vShare');
        });
      } else {
        this.router.navigate(['dashboard']);
      }
    });
  }

  setUserPosition(position: any) {
    if (position && position.coords) {
      const pos = new GeolocationModel();
      pos.latitude = position.coords.latitude;
      pos.longitude = position.coords.longitude;
      this.dataSharingService.setUserPosition(pos);
      this.weatherService.getWeatherData(position.coords.latitude, position.coords.longitude).subscribe(result => {
        if (result && result.name && result.weather && result.main) {
          const weather = new WeatherModel();
          weather.cityName = result.name;
          weather.weatherDescription = result.weather[0].description;
          weather.weatherMain = result.weather[0].main;
          weather.weatherIcon = result.weather[0].icon;
          weather.weatherTemp = result.main.temp;
          this.dataSharingService.setWeatherData(weather);
          sessionStorage.setItem('city_name', result.name);
          sessionStorage.setItem('weather_icon', result.weather[0].icon);
          sessionStorage.setItem('weather_temp', result.main.temp);
        }
      });
    }
  }

  async dashboardInitialSettings() {
    if (globals.enableVpec) {
      const vPecCurrentUser = sessionStorage.getItem('VPEC_currentUser');
      const accountIdVPEC = parseInt(sessionStorage.getItem('VPEC_currentId'), 10);

      if ((!vPecCurrentUser || vPecCurrentUser === undefined) &&
        (isNaN(accountIdVPEC) || accountIdVPEC === undefined)) {

        const result = await this.dashService.getAccountList().toPromise();

        if (result.Dto && result.Dto.length > 0) {
          const email = result.Dto.map(account => account.email)[0];
          sessionStorage.setItem('VPEC_currentUser', email);
          const id = result.Dto.map(account => account.id)[0];
          sessionStorage.setItem('VPEC_currentId', id);
        }
      }
    }
    localStorage.setItem('VCAL_defaultCalendar', '0');
  }

}
