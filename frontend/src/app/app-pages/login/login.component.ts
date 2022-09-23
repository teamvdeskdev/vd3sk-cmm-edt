import { Component, EventEmitter, Input, Inject, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { GlobalVariable } from 'src/app/globalviarables';
import { DataSharingService, GeolocationModel, WeatherModel } from 'src/app/app-services/data-sharing.service';
import { WeatherService } from 'src/app/app-services/weather.service';
import { LogoService } from 'src/app/app-services/logo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { globals } from 'src/config/globals';
import { LanguageService } from 'src/app/app-services/language.service';
import { AppConfig } from 'src/app/app-config';
import { SecurityService } from 'src/app/app-services/security.service';
import { ThumbSettings } from '@syncfusion/ej2-charts';
import { DOCUMENT } from '@angular/common';
import { ChatService } from 'src/app/app-services/chat.service';
import { IdleTimeService } from 'src/app/app-shared/idle-time.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilitiesService } from 'src/app/app-services/utilities.service';
import { LogoutService } from 'src/app/app-shared/logout.service';
import { CalendarService } from 'src/app/calendar/services/calendar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPwdRecoveryRequested = false;
  isLDAP: boolean;
  isSubmitted = false;
  showInvalidLogin = false;
  inProgress = false;
  showMsgPwdRecovery = false;
  isDirectAppLoading = true;
  isMobile = false;
  globalsVar: AppConfig;
  globals;
  beforeLogin: boolean;
  samlArray: any = [];
  samlName: string = '';
  firstAccess: boolean = false;
  isNextPassword: boolean = false;

  @Input() isV2Login: boolean;
  @Output() logged = new EventEmitter<boolean>();
  @Output() loggedTotp = new EventEmitter<boolean>();
  isTim: boolean;
  getUserManager: any;
  getFolderGroupManager: any;
  ipAddress:string;
  isSUA: boolean;
  isSUALogged: boolean;
  isAuslBo: boolean;
  isNotariato: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private logOutService: LogoutService,
    private activeRouter: ActivatedRoute,
    private authService: AuthenticationService,
    private dashService: DashboardService,
    private router: Router,
    private global: GlobalVariable,
    private dataSharingService: DataSharingService,
    private weatherService: WeatherService,
    private logoService: LogoService,
    private chatService: ChatService,
    private spinner: NgxSpinnerService,
    public langService: LanguageService,
    private secService: SecurityService,
    private _snackBar: MatSnackBar,
    private idleTimeService: IdleTimeService,
    private utilitiesService: UtilitiesService,
    private calendarService: CalendarService,
    private logoutService: LogoutService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.chatService.hideChat();
    this.globals = globals;
    this.globalsVar = globals;
    this.globals = globals;
    const date = new Date();
    const timezoneOffset = this.calcTimezoneOffset(date.getTimezoneOffset());
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.loginForm = this.formBuilder.group({
      user: new FormControl('', [Validators.required, Validators.pattern('^[^\\s%$?^]*$')]),
      password: new FormControl('', Validators.required),
      timezone_offset: new FormControl(timezoneOffset),
      timezone: new FormControl(timezone),
      stayConnected: new FormControl(false)
    });

  }

  get user() { return this.loginForm.get('user'); }
  get password() { return this.loginForm.get('password'); }


  ngOnInit() {
    this.isAuslBo = (this.globalsVar.customCustomer.toLowerCase() == 'auslbo') ? true : false;
    if(this.isAuslBo){
      if(sessionStorage.getItem('access_token') || this.authService.getCookie('access_token')) {
        this.logoutService.logoutUser()
      }
    }

    this.isSUA = (this.globalsVar.customCustomer.toLowerCase() === 'adp')? true : false;
    if(this.isSUA){
      this.spinner.show();
      this.authService.setSUAValue();
      this.LoginSUA(this.isSUA);
    }

    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;

    this.isNotariato = (this.globalsVar.customCustomer.toLowerCase() == 'notariato')? true : false;

    if(!this.globalsVar.enableSaml){ // Case: not SAML
      this.beforeLogin = false, this.isDirectAppLoading = false;
      this.verifyMobile();
      if (this.isMobile) {
        this.router.navigateByUrl('download-mobile');
      }
    }else{// Case: SAML
      this.verifyMobile();
      if (this.isMobile) {
        this.router.navigateByUrl('download-mobile');
      }
      if(!this.activeRouter.snapshot.queryParams['query'] && !this.isMobile){
        this.checkIfSaml();
      }else this.beforeLogin = false, this.isDirectAppLoading = false;
    }
  }

  calcTimezoneOffset(timeoff) {
    const to = Math.abs(timeoff);
    return (to / 60).toString();
  }


  async LoginSUA(isSUA:boolean){
    //get cookie
    let AppIdToken = this.activeRouter.snapshot.queryParams.appidtoken;
    let BearerValue = this.activeRouter.snapshot.queryParams.bearer;
    // let AppIdToken = document.cookie.split('; ').find(row => row.startsWith('app-id-token')).replace('app-id-token=', '');
    // let BearerValue = document.cookie.split('; ').find(row => row.startsWith('bearer')).replace('bearer=', '');

    sessionStorage.setItem('BearerSua', BearerValue);
    if((AppIdToken == '' || AppIdToken == null || AppIdToken == undefined ) || (BearerValue == '' || BearerValue == null || BearerValue == undefined )) {
      this.isSUALogged = false;
    } else {
      this.isSUALogged = true;
      let waitService = await this.authService.loginCokies(AppIdToken, BearerValue).toPromise();
      if (waitService.status == 401) {
        this._snackBar.open('User unathorized, login again', null, {
          duration: 4000,
          panelClass: 'toast-error'
        });
        this.logOutService.logoutUser();

      } else {
          let SUAusername = {
            'username' : waitService.username
          };
          let isUserEnable = await this.authService.isUserEnable(SUAusername).toPromise();

          var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
          var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
          let passwordSua = this.utilitiesService.encryptPass(this.authService.passwordSua,keyString,ivString) + ' ' + keyString + ' ' + ivString;

          let user = {
            password: passwordSua,
            stayConnected: '',
            timezone: '',
            timezone_offset: '',
            user: waitService.username,
          };
          if (isUserEnable.Performed && !isUserEnable.isEnabled) {
            this._snackBar.open(this.langService.dictionary.disabled_user, null, {
              duration: 4000,
              panelClass: 'toast-error'
            });
            this.logOutService.logoutUser();
          } else if (isUserEnable.Performed && isUserEnable.isEnabled) {
            this.authService.signIn(user).subscribe(
              (response: any) => {
                if (response.body.token !== '' && response.body.status === 200) {
                  this.spinner.hide();
                  this.onSuccessLogin(response);
                } else {
                  this._snackBar.open('An error occurred on login', null, {
                    duration: 4000,
                    panelClass: 'toast-error'
                  });
                  this.logOutService.logoutUser();
                }
              });
          } else {
            let arraySUAApps = [];
            if(this.globalsVar.enableVshare) arraySUAApps.push('VSHARE');
            if(this.globalsVar.enableVpec) arraySUAApps.push('VPEC');
            if(this.globalsVar.enableVcal) arraySUAApps.push('VCAL');
            if(this.globalsVar.enableVcanvas) arraySUAApps.push('VCANVAS');
            if(this.globalsVar.enableVFlow) arraySUAApps.push('VFLOW');
            if(this.globalsVar.enableVmeet) arraySUAApps.push('VMEET');

            let newUserSUA = {
              "email": waitService.email,
              "username": waitService.username,
              "requesttoken": "",
              "name": waitService.nome,
              "surname": waitService.cognome,
              "company": "SUA",
              "start":"",
              "end":"",
              "manager":"",
              "nameRef":"",
              "surnameRef":"",
              "emailRef":"",
              "guest": true,
              "apps": arraySUAApps
            }
            this.authService.RegistrationSUA(newUserSUA).subscribe(
              (response: any) => {
                if(response.Performed){
                  this.authService.signIn(user).subscribe(
                    (response: any) => {
                      if (response.body.token !== '' && response.body.status === 200) {
                        this.spinner.hide();
                        this.onSuccessLogin(response);
                      } else {
                        this._snackBar.open('An error occurred on login', null, {
                          duration: 4000,
                          panelClass: 'toast-error'
                        });
                        this.logOutService.logoutUser();
                      }
                    });
                } else {
                  this._snackBar.open('An error occurred on registration', null, {
                    duration: 4000,
                    panelClass: 'toast-error'
                  });
                  this.logOutService.logoutUser();
                }
              });
          }
       }
    }
  }

  redirectSUA() {
    this.document.location.href = this.globals.customerEndpoint;
  }

  loginUser(isPwdRecovery: boolean) {
    if (!isPwdRecovery) {
      this.isSubmitted = true;
      this.inProgress = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
        this.inProgress = false;
        return;
      } else {

        var keyString = this.utilitiesService.randomString(32, '0123456789abcdef0123456789abcdef');
        var ivString = this.utilitiesService.randomString(32, 'abcdef9876543210abcdef9876543210');
        var encryptPassword = this.loginForm.value.password;
        encryptPassword = this.utilitiesService.encryptPass(encryptPassword,keyString,ivString) + ' ' + keyString + ' ' + ivString;
        let user = {
          password: encryptPassword,
          stayConnected: this.loginForm.value.stayConnected,
          timezone: this.loginForm.value.timezone,
          timezone_offset: this.loginForm.value.timezone_offset,
          user: this.loginForm.value.user,
        }

        this.authService.signIn(user).subscribe(
        (response: any) => {
          if(response.body.status == 401){
            this.showInvalidLogin = true;
            this.inProgress = false;
            this.loginForm.get('password').setValue('');
            if (response.body.trialFailed < 3) {
              this._snackBar.open(this.langService.dictionary.username_password_error, null, {
                duration: 4000,
                panelClass: 'toast-error'
              });
            } else if (response.body.trialFailed == 3) {
              this._snackBar.open('your account has been disabled', null, {
                duration: 4000,
                panelClass: 'toast-error'
              });
            } else {
              this._snackBar.open('An error occurred', null, {
                duration: 4000,
                panelClass: 'toast-error'
              });
            }
            return;
          }else if(response.body.Performed){
            if(!response.body.isEnabled){
              this._snackBar.open(this.langService.dictionary.disabled_user, null, {
                duration: 4000,
                panelClass: 'toast-error'
              });
              this.inProgress = false;
              return;
            }else{
              if (response.body.isGuest) {
                if (!response.body.isPasswordChanged) {
                  sessionStorage.setItem('firstAccess', 'true');
                  this.firstAccess = true;
                }
                if (response.body.isNextPassword) {
                  sessionStorage.setItem('isNextPassword', 'true');
                  this.isNextPassword = true;
                }
              }

              if (response.body.token !== '' && response.body.status === 200) {
                this.onSuccessLogin(response);
              }
            }
          }
        },
        (error: any) => {
          this.showInvalidLogin = true;
          this.inProgress = false;
          return;
        })
      }
    } else { // Is password recovery
      this.recoveryPassword();
    }
  }

  onSuccessLogin(response: any) {
    // Start idle time
    this.idleTimeService.idleTime();
    this.authService.setCookie('access_token', response.body.token, 300000);
    // If TOTP is enabled
    if (response.body.totp !== undefined && response.body.totp === true) {
      if (response.body.state === 0) {
        sessionStorage.setItem('forced', 'true');
        sessionStorage.setItem('access_token', response.body.token);
      }
      // Keep TOTP status
      //sessionStorage.setItem('enabled', 'true');

      this.inProgress = false;
      const location = window.location;
      const url = unescape(location.href);
      if (url.includes('login/v2/flow')) {
        this.loggedTotp.emit(true);
      } else if (url.includes('flow')) {
        const index = url.lastIndexOf('pid');
        const pid = url.substr(index + 4, url.length);
        this.router.navigate(['login/totp'], { queryParams: { pid } });
      } else {
        this.router.navigate(['login/totp']);
      }

    } else if (response.body.backup_codes !== undefined && response.body.backup_codes === true){
      sessionStorage.setItem('access_token', response.body.token);
      this.inProgress = false;
      const location = window.location;
      const url = unescape(location.href);
      if (url.includes('login/v2/flow')) {
        this.loggedTotp.emit(true);
      } else if (url.includes('flow')) {
        const index = url.lastIndexOf('pid');
        const pid = url.substr(index + 4, url.length);
        this.router.navigate(['login/backup_code'], { queryParams: { pid } });
      } else {
        this.router.navigate(['login/backup_code']);
      }
    } else {

      // Retrieve the JWT token and store it
      sessionStorage.setItem('access_token', response.body.token);

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
        if (this.getUserManager.IsUserManager !== undefined && this.getUserManager.IsUserManager !== null) {
          this.authService.userManager = this.getUserManager.IsUserManager;
          sessionStorage.setItem('userManager', this.getUserManager.IsUserManager);
        }
        if ( this.getFolderGroupManager.IsFolderManager !== undefined && this.getFolderGroupManager.IsFolderManager !== null ) {
          this.authService.IsFolderManager = this.getFolderGroupManager.IsFolderManager;
          sessionStorage.setItem('folderManager', this.getFolderGroupManager.IsFolderManager);
        }

        // Get user data especially enabled apps - valide for all types of user
        let waitService = await this.authService.getGuestUser().toPromise();
        if(waitService.Performed){
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

          if(this.globalsVar.enableCalendar365){
            let userOffideId = await this.calendarService.getOutlookMail().toPromise();
            if(userOffideId.Performed){
              sessionStorage.setItem('officeId', userOffideId.outlookMail);
            }else sessionStorage.setItem('officeId', '');
          }else sessionStorage.setItem('officeId', '');

          sessionStorage.setItem('user', currentUser.id);
          sessionStorage.setItem('user_language', currentUser.language);
          sessionStorage.setItem('groups', JSON.stringify(currentUser.groups));
          this.global.isUserAdmin = (currentUser.groups.includes('admin')) ? true : false;
        }
        this.inProgress = false;
        // vflow querystring
        const location = window.location;
        const url = unescape(location.href);
        if (this.isV2Login) {
          this.logged.emit(true);
        } else if (url.includes('flow')) {
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

        } else if (this.authService.isUserGuest && (this.firstAccess ||  this.isNextPassword)) {
          this.dashService.setShowHeader(false);
          this.router.navigate(['new-password-guest']);
        } else {
          this.router.navigate(['dashboard']);
        }
      });
    }
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

  recoveryPassword() {
    /**
     * TODO: controllare se user è LDAP
     * true: visualizzare msg di invio mail all'amministratore di sistema
     * false: visualizzare msg di invio mail all'indirizzo dell'utente
     */
    this.isSubmitted = true;
    this.inProgress = true;

    if (this.loginForm.get('user').invalid) {
      this.inProgress = false;
      return;

    } else {
      /* Call to API*/
      this.authService.passwordRecovery(this.loginForm.value).subscribe(result => {
        this.inProgress = false;
        this.showMsgPwdRecovery = true;
      });
    }
  }

  SetPermanentConnection() { }

  goBackToLogin() {
    this.isPwdRecoveryRequested = false;
    this.showMsgPwdRecovery = false;
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

  verifyMobile() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  gotoLogin() {
    this.beforeLogin = !this.beforeLogin;
  }

  async checkSaml() {
    if (!this.isV2Login) { // If isn't client desktop login with SAML
      let waitService = await this.authService.callSamlEndpoint(this.samlArray[0].point, this.samlArray[0].id).toPromise();
      if (waitService.Performed) {
        this.document.location.href = waitService.RedirectUrl;
      }
    } else { // If is client desktop login with SAML
      this.authService.isUserSaml = true;
      this.logged.emit(true);
    }
  }

  async checkIfSaml(){
    let waitService = await this.authService.isSamlActive().toPromise();
    if(waitService!==null && waitService.Performed){
      if(waitService.SamlActive){
        this.samlArray.push({
          id: waitService.Dto[0].parameters.idp,
          point: waitService.Dto[0].endpoint
        });

        if (this.isNotariato) {
          //this.beforeLogin = false;
          //this.isDirectAppLoading = true;
          this.checkSaml(); // escape VDESK login page and run redirect to Notariato login page
        } else {
          this.beforeLogin = true;
          this.samlName = this.langService.dictionary.saml_login + waitService.Dto[0].name;
        }

      }else{
        this.beforeLogin = false;
      }
      if(!this.isNotariato) this.isDirectAppLoading = false;
    }else{
      this.beforeLogin = false;
    }
    if(!this.isNotariato) this.isDirectAppLoading = false;
  }

}
