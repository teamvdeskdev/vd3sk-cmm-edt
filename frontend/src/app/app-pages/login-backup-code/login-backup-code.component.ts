import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { DataSharingService, GeolocationModel, WeatherModel } from 'src/app/app-services/data-sharing.service';
import { WeatherService } from 'src/app/app-services/weather.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { LogoService } from 'src/app/app-services/logo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { globals } from 'src/config/globals';
import { LanguageService } from 'src/app/app-services/language.service';
import { SecurityService } from 'src/app/app-services/security.service';
import { IdleTimeService } from 'src/app/app-shared/idle-time.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConfig } from 'src/app/app-config';

@Component({
  selector: 'app-login-backup-code',
  templateUrl: './login-backup-code.component.html',
  styleUrls: ['./login-backup-code.component.scss']
})
export class LoginBackupCodeComponent implements OnInit {

  loginBackupCodeForm: FormGroup;
  isSubmitted = false;
  showInvalidLogin = false;
  inProgress = false;
  isDirectAppLoading = false;
  getUserManager: any;
  getFolderGroupManager: any;
  globalsVar: AppConfig;
  isTim: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private dashService: DashboardService,
    private router: Router,
    private dataSharingService: DataSharingService,
    private weatherService: WeatherService,
    private global: GlobalVariable,
    private logoService: LogoService,
    private spinner: NgxSpinnerService,
    public langService: LanguageService,
    private secService: SecurityService,
    private idleTimeService: IdleTimeService,
    private snackBar: MatSnackBar,
  ) {
    this.globalsVar = globals;
    this.loginBackupCodeForm = this.formBuilder.group({
      challenge: new FormControl('', Validators.required),
    });
  }

  get challenge() { return this.loginBackupCodeForm.get('challenge'); }

  ngOnInit() {
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
   }

  loginBackupCodeUser() {
    this.isSubmitted = true;
    this.inProgress = true;

    // stop here if form is invalid
    if (this.loginBackupCodeForm.invalid) {
      this.inProgress = false;
      return;

    } else {
      if ( this.authService.isUserSaml ) {
        // Runs the totpChallengeSaml API call
        const data = {
          'challengeProviderId': 'backup_codes',
          'redirect_url': '',
          'challenge' : this.challenge.value
        }
        this.authService.totpChallengeSaml(data).subscribe(
          (response: any) => {
            // If success
            if (response.status === 200) {
              this.onBackupCodeSuccessLogin(response);

            }else if (response.status === 403) {
              this.snackBar.open(this.langService.dictionary.error_backup_codes, '', {
                duration: 4000,
                panelClass: 'toast-error'
              });
              this.showInvalidLogin = true;
              this.inProgress = false;
              this.goBackToLogin();
              return;
            } else {
              this.showInvalidLogin = true;
              this.inProgress = false;
              return;
            }
          },
          (error: any) => { // If Error
            this.showInvalidLogin = true;
            this.inProgress = false;
            return;
          }
        );

      } else {
        // Runs the totpChallenge API call
        this.authService.backupCodeChallenge(this.loginBackupCodeForm.value).subscribe(
          (response: any) => {
            // If success
            if (response.body.token !== '' && response.body.status === 200) {
              this.onBackupCodeSuccessLogin(response);

            } else {
              this.showInvalidLogin = true;
              this.inProgress = false;
              return;
            }
          },
          (error: any) => { // If Error
            this.showInvalidLogin = true;
            this.inProgress = false;
            return;
          }
        );
      }
    }
  }

  onBackupCodeSuccessLogin(response: any) {
    // Start idle time
    this.idleTimeService.idleTime();

    if ( !this.authService.isUserSaml ) {
      // Retrieve the JWT token and store it
      sessionStorage.setItem('access_token', response.body.token);
    }     

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setUserPosition.bind(this));
    }

    setTimeout(async () => {              
      if (this.isTim){
        this.getUserManager = await this.authService.isUserManager().toPromise();
        this.getFolderGroupManager = await this.authService.isFolderGroupManager().toPromise();
      } else {
        this.getUserManager = false;
        this.getFolderGroupManager = false;                    
      }
      if ( this.getUserManager.IsUserManager !== undefined && this.getUserManager.IsUserManager !== null ) {
        this.authService.userManager = this.getUserManager.IsUserManager;
        sessionStorage.setItem('userManager', this.getUserManager.IsUserManager);
      }
      if ( this.getFolderGroupManager.IsFolderManager !== undefined && this.getFolderGroupManager.IsFolderManager !== null ) {
        this.authService.IsFolderManager = this.getFolderGroupManager.IsFolderManager;
        sessionStorage.setItem('folderManager', this.getFolderGroupManager.IsFolderManager);
      }

      // Get user data especially enabled apps - valide for all types of user
      let waitService = await this.authService.getGuestUser().toPromise();
      if (waitService.Performed){
        this.authService.isUserGuest = waitService.UserData.isGuest;
        this.authService.userApps = waitService.UserData.userApps;
      } else {
        this.authService.isUserGuest = false;
      }

      const currentUser = await this.authService.getCurrentUser().toPromise();
      if (currentUser !== undefined && currentUser !== null) {
        if(this.globalsVar.enableVmeet){
          const VMeetToken = await this.authService.getTokenVMeet(currentUser.id).toPromise();
          if( VMeetToken !== undefined && VMeetToken !== null && VMeetToken.performed == true) {
              sessionStorage.setItem('VMeet_Token', VMeetToken.token);
          }
        }
        // Set current user in service and in sessionStorage
        this.authService.currentUser = currentUser;
        // Set cookies
        this.authService.setVCCookies(currentUser);

        sessionStorage.setItem('user', currentUser.id);
        sessionStorage.setItem('user_language', currentUser.language);
        sessionStorage.setItem('groups', JSON.stringify(currentUser.groups));
        this.global.isUserAdmin = (currentUser.groups.includes('admin')) ? true : false;
      }

      // SAML logout
      if ( this.authService.isUserSaml ) { this.callGet(this.authService.Logout); }      
      
      this.inProgress = false;

      const location = window.location;
      const url = unescape(location.href);
      if (url.includes('index.php/f')) {
        const urlArray = url.split('/');
        const id = urlArray[urlArray.length - 1];
        this.dataSharingService.setSharedFileId(id);
        this.isDirectAppLoading = true;
        await this.dashboardInitialSettings();
        this.spinner.show();
        this.router.navigate(['filesharing']).finally(() => {
          this.spinner.hide();
          this.isDirectAppLoading = false;
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

  async callGet(data: string){
    let waitService = await this.authService.callGetLanding(data).toPromise();
  }

  goBackToLogin() {
    this.router.navigateByUrl('login');
  }

  async dashboardInitialSettings() {
    // Get vpec current account for the user if exist
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

    //  Set vCal default calendar
    localStorage.setItem('VCAL_defaultCalendar', '0');
  }

}
