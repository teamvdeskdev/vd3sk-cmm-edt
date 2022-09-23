import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { DataSharingService, GeolocationModel, WeatherModel } from 'src/app/app-services/data-sharing.service';
import { WeatherService } from 'src/app/app-services/weather.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { LogoService } from 'src/app/app-services/logo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { globals } from 'src/config/globals';
import { LanguageService } from 'src/app/app-services/language.service';
import { AppConfig } from 'src/app/app-config';
import { SecurityService } from 'src/app/app-services/security.service';
import { SystemSettingsService } from '../../../app/settings/services/system-settings.service';
import { IdleTimeService } from 'src/app/app-shared/idle-time.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login-totp',
  templateUrl: './login-totp.component.html',
  styleUrls: ['./login-totp.component.scss']
})
export class LoginTotpComponent implements OnInit {

  loginTotpForm: FormGroup;
  isSubmitted = false;
  showInvalidLogin = false;
  inProgress = false;
  isDirectAppLoading = false;
  globalsVar: AppConfig;
  qrCode: string = null;
  qrUrl: any = null;
  codeForm: FormGroup;
  showTOTPSection = false;
  totpForce: boolean;
  isSamlUser: any;
  isNextPassword: boolean = false;

  @Input() isV2Login: boolean;
  @Output() logged = new EventEmitter<boolean>();
  firstAccess: boolean;
  isTim: boolean;
  getUserManager: any;
  getFolderGroupManager: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private dashService: DashboardService,
    private router: Router,
    private global: GlobalVariable,
    private dataSharingService: DataSharingService,
    private weatherService: WeatherService,
    private logoService: LogoService,
    private spinner: NgxSpinnerService,
    public langService: LanguageService,
    private secService: SecurityService,
    private sysSettingsService: SystemSettingsService,
    private idleTimeService: IdleTimeService,
    private _snackBar: MatSnackBar,
  ) {

    this.globalsVar = globals;

    this.loginTotpForm = this.formBuilder.group({
      challenge: new FormControl('', Validators.required),
    });

    this.codeForm = this.formBuilder.group({
      code: new FormControl('', Validators.required),
    });
    this.isSamlUser = this.authService.isUserSaml;
    const TotpForced = sessionStorage.getItem('forced');
    if (TotpForced !== undefined && TotpForced === 'true') {
      this.totpForce = true;
    } else {
      this.totpForce = false;
    }

    const FirstAccess = sessionStorage.getItem('firstAccess');
    if (FirstAccess !== undefined && FirstAccess === 'true') {
      this.firstAccess = true;
    } else {
      this.firstAccess = false;
    }
    const NextPassword = sessionStorage.getItem('isNextPassword');
    if (NextPassword !== undefined && NextPassword === 'true') {
      this.isNextPassword = true;
    } else {
      this.isNextPassword = false;
    }
  }
 

  get challenge() { return this.loginTotpForm.get('challenge'); }
  get code() { return this.codeForm.get('code'); }

  ngOnInit() {
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    if (!this.totpForce) {
      this.showTOTPSection = false;
    } else if (this.totpForce) {
      if ( this.isSamlUser ) {
        const body = {
          'state' : 1,
          'code' : null
        };
        this.sysSettingsService.enableTwoFactorSaml(body).subscribe( response => {
          this.inProgress = false;
          this.qrCode = response.secret;
          this.qrUrl = response.qrUrl;
          // Init the codeForm
          this.codeForm = new FormGroup({
          code: new FormControl('')
        });
          this.showTOTPSection = true;
        });

      } else {
        const body = { state: 1 };
        this.sysSettingsService.enableTwoFactor(body).subscribe( response => {
                this.inProgress = false;
                this.qrCode = response.body.secret;
                this.qrUrl = response.body.qrUrl;
                // Init the codeForm
                this.codeForm = new FormGroup({
                code: new FormControl('')
              });
                this.showTOTPSection = true;
              });
      }
    }
   }

   check(checkcode: any) {
    this.isSubmitted = true;
    this.inProgress = true;
    if (!checkcode) {
      this.inProgress = false;
      return;
    } else {
        if ( this.isSamlUser) {
          const body = { state: 2, code: checkcode };
          this.sysSettingsService.enableTwoFactorSaml(body).subscribe( response => {
            if (response.state === 2) {
              sessionStorage.setItem('enabled', 'true');
              this.inProgress = false;
              this.isSubmitted = false;
              this.showTOTPSection = false;
              this.showInvalidLogin = false;
            } else {
              this.showInvalidLogin = true;
              this.inProgress = false;
              return;
            }
          });

        } else {
          const body = { state: 2, code: checkcode };
          this.sysSettingsService.enableTwoFactor(body).subscribe( response => {
            if (response.body.state === 2) {
              sessionStorage.setItem('enabled', 'true');
              this.inProgress = false;
              this.isSubmitted = false;
              this.showTOTPSection = false;
              this.showInvalidLogin = false;
            } else {
              this.showInvalidLogin = true;
              this.inProgress = false;
              return;
            }
          });
        }
    }
  }

  loginTotpUser() {
    this.isSubmitted = true;
    this.inProgress = true;

    // stop here if form is invalid
    if (this.loginTotpForm.invalid) {
      this.inProgress = false;
      return;

    } else {
      if ( this.isSamlUser) {
        // Runs the totpChallengeSaml API call
        const data = {
          'challengeProviderId': 'totp',
          'redirect_url': '',
          'challenge' : this.challenge.value
        }
        this.authService.totpChallengeSaml(data).subscribe(
          (response: any) => {
            // If success
            if (response.body.status == 200) {
              this.onTotpSuccessLogin(response);

            } else if (response.body.status == 403) {
              this._snackBar.open(this.langService.dictionary.totp_error, null, {
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
        this.authService.totpChallenge(this.loginTotpForm.value).subscribe(
          (response: any) => {
            // If success
            if (response.body.token !== '' && response.body.status === 200) {
              this.onTotpSuccessLogin(response);

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

  onTotpSuccessLogin(response: any) {
    // Start idle time
    this.idleTimeService.idleTime();

    if ( !this.isSamlUser ) {
      // Retrieve the JWT token and store it
      sessionStorage.setItem('access_token', response.body.token);
    }
    sessionStorage.setItem('enabled', 'true');

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
      if (this.isSamlUser) { this.callGet(this.authService.Logout); }      

      this.inProgress = false;

      // vflow querystring
      const location = window.location;
      const url = unescape(location.href);
      if (this.isV2Login) {
        this.logged.emit(true);
      } else if (url.includes('pid')) {
        const index = url.lastIndexOf('pid');
        const pid = url.substr(index + 4, url.length);
        this.router.navigate(['flow'], { queryParams: { pid } });

      } else if (url.includes('index.php/f')) {
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

      } else if (!this.isSamlUser && this.authService.isUserGuest &&  (this.firstAccess ||  this.isNextPassword)) {
        this.dashService.setShowHeader(false);
        this.router.navigate(['new-password-guest']);

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

  goToLoginBackupCode() {
    this.router.navigateByUrl('login/backup_code');
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

