import { Component, OnDestroy, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { LogoService } from 'src/app/app-services/logo.service';
import { globals } from 'src/config/globals';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { UtilitiesService } from 'src/app/app-services/utilities.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { WeatherService } from 'src/app/app-services/weather.service';
import { Ruolo } from 'src/app/flow/flow.configuration';
import { DashboardCacheService } from 'src/app/app-services/dashboard-cache.service';
import { browserRefresh } from 'src/app/app.component';
import { UserModel } from 'src/app/flow/models/UserModel';
import { UtilService } from 'src/app/mail/services/util.service';
import { SignatureService } from 'src/app/mail/services/signature.service';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragExit, CdkDragStart, transferArrayItem } from '@angular/cdk/drag-drop';
import { CurrentUser } from 'src/app/app-model/common/user';
import { LanguageService } from 'src/app/app-services/language.service';
import { CacheCardModel } from 'src/app/app-model/dashboard/CacheCardModel';
import { CardSelectorModel } from 'src/app/app-model/dashboard/CardSelectorModel';
import { Column, DraggableComponent, Row, UserDashboardModel } from 'src/app/app-model/dashboard/UserDashboardModel';
import * as _ from 'lodash';
import { OrderModule } from './draggable-card/draggable-card.component';
import { Feeders, LoadFeedsRequest } from 'src/app/app-model/dashboard/LoadFeedsRequest';
import { FeedModel } from 'src/app/app-model/dashboard/FeedModel';
import { ConfirmDialogComponent, ConfirmDialogDataModel } from 'src/app/app-components/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadPostItRequest } from 'src/app/app-model/dashboard/LoadPostItRequest';
import { PostItDto } from 'src/app/app-model/dashboard/CreateUpdatePostItResponse';
import { AppConfig } from 'src/app/app-config';
import { ChatService } from 'src/app/app-services/chat.service';
import { ExpirationService } from 'src/app/expiration/services/expiration.service';
import { Expiration } from 'src/app/expiration/model/expiration';
import { ExpirationStatus } from 'src/app/expiration/model/expiration-status';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any;
  currentUser: CurrentUser;
  isAdmin: boolean;
  UserName: string;
  lastLogin: number;
  userLang = '';
  profilePic: any;
  usedSpace: string;
  actCount = 0;
  dataCount = 0;
  colleaguesCount = 0;
  barValue = 0;
  count = 0;
  iconSpace: string;
  favorDataValue: any[] = [];
  vMeetDataValue: any[] = [];
  calDataValue: any[] = [];
  flowDataValue: any[] = [];
  accountIdVPEC: number;
  folderObj: any = {};
  vPecCurrentUser: string;
  vconnectUrl: string;
  dayName: string;
  cacheModel: CacheCardModel;
  promisesNumber: number;
  getAccountListSubs: Subscription;
  todayDate: string;
  time: string;
  cityName: string;
  weatherTemp: string;
  weatherIcon: string;
  interval: NodeJS.Timer;
  welcomeBannerSrc: string;
  backgroundImageUrl: string;
  startMorning = 6 * 60;
  endMorning = 12 * 60;
  endAfternoon = 18 * 60;
  bannerMsg: string;
  globalsVar: AppConfig;
  isLoadingApp = false;
  inProgress = false;
  isCardRefresh = false;
  isEditDashboard = false;
  isInDrag = false;
  isDragExit = false;
  toggleColorPicker = false;
  isBackgroundColorSelected = true; // true se è da visualizzare colore sfondo, false se è da visualizzare immagine sfondo
  defaultBackgroundColor = '#f9f9f9';
  backgroundColor: string;
  userDashboardModel: UserDashboardModel;
  cloneUserdashboardModel = new UserDashboardModel();
  cardsDataModel = new CardSelectorModel();
  orderModule: OrderModule;
  showNewsArea: boolean;
  feedsData: FeedModel[];
  postItsData: PostItDto[];
  userApps: string[];
  isGuest: boolean = false;
  vmeetUrl = globals.vMeetLink;
  arrayApps: any = [
    { name: 'VSHARE', goto: 'FileSharing', disabled: true, src: 'assets/loghi_apps_launch/logo-launcher-vshare.svg' },
    { name: 'VPEC', goto: 'Mail', disabled: true, src: 'assets/loghi_apps_launch/logo-launcher-vpec.svg' },
    { name: 'VMEET', goto: '', disabled: true, src: 'assets/loghi_apps_launch/logo-launcher-vmeet.svg' },
    { name: 'VFLOW', goto: 'Flow', disabled: true, src: 'assets/loghi_apps_launch/logo-launcher-vflow.svg' },
    { name: 'VCAL', goto: 'Calendar', disabled: true, src: 'assets/loghi_apps_launch/logo-launcher-vcal.svg' },
    { name: 'VCANVAS', goto: 'Canvas', disabled: true, src: 'assets/loghi_apps_launch/logo-launcher-vcanvas.svg' },
  ];
  UserManager: boolean;
  userAppsEnable: any = [];
  notCustom: boolean = false;
  notPec: boolean = false;
  isAuslBo: boolean;
  isTar: boolean;

  constructor(
    public authService: AuthenticationService,
    public spinner: NgxSpinnerService,
    public router: Router,
    public location: Location,
    private logoService: LogoService,
    private dashService: DashboardService,
    private util: UtilitiesService,
    private domSanitizer: DomSanitizer,
    private datePite: DatePipe,
    private weatherService: WeatherService,
    private dashboardCacheService: DashboardCacheService,
    private chatService: ChatService,
    public utilService: UtilService,
    public signService: SignatureService,
    public dataSharingService: DataSharingService,
    public langService: LanguageService,
    private dialog: MatDialog,
    private expirationService: ExpirationService,
  ) {
    this.chatService.hideChat();
    this.inProgress = true;

    // Get the current user
    this.currentUser = this.authService.currentUser;
    this.langService.refreshDictionary();
    this.userLang = this.currentUser.language;
    // if (this.userLang === 'it-IT') {
    //   registerLocaleData(localeIt, 'it');
    // }
    this.userApps = this.authService.userApps;
    this.barValue = 5;
    this.globalsVar = globals;
    this.backgroundColor = this.defaultBackgroundColor;

    this.dashService.setShowHeader(false);
    this.setAdminUserParam();
    this.initialSettings();

    const userManager = sessionStorage.getItem('userManager');
    if (userManager !== undefined && userManager === 'true') {
      this.UserManager = true;
    } else {
      this.UserManager = false;
    }
  }

  ngOnInit() {
    this.isAuslBo = (this.globalsVar.customCustomer.toLowerCase() == 'auslbo') ? true : false;
    this.isTar = (this.globalsVar.customCustomer.toLowerCase() == 'adp')? true : false;
    if(this.isAuslBo){
      if(sessionStorage.getItem('access_token')) {
        this.authService.setCookie('access_token', sessionStorage.getItem('access_token'), 300000)
      }
    }

    if(this.globalsVar.customCustomer.toLowerCase() == 'notariato'){
      this.notCustom = true;
      this.notPec = (sessionStorage.getItem('groups').includes('notbox-pec'))? true : false;
    }
    if (browserRefresh) {
      if (this.authService.isUserGuest && !this.authService.isUserSaml && !this.isTar) { // Updated by B.Ravaglia: la dashbnoard GUEST deve essere caricata solo se l'utente non è SAML
        this.loadGuestTab(this.authService.userApps);
      } else {
        this.loadAndCacheCardData();
      }
    } else if (this.authService.isUserGuest && !this.authService.isUserSaml && !this.isTar) {
      this.loadGuestTab(this.authService.userApps);
    } else {
      // CASE 2: restore cache data when not refresh browser
      this.cacheModel = this.dashboardCacheService.getCacheCardModel();
      this.userDashboardModel = this.dashboardCacheService.getUserDashboardModel();
      
      this.feedsData = this.dashboardCacheService.getCacheFeedModel();
      this.postItsData = this.dashboardCacheService.getCachePostItModel();
      if (this.cacheModel && this.userDashboardModel) {
        this.cacheModel.vmeetCard ? this.cardsDataModel.vmeetCardData = this.cacheModel.vmeetCard : this.cardsDataModel.noVmeetData = true;
        this.cacheModel.vpecCard ? this.cardsDataModel.vpecCardData = this.cacheModel.vpecCard : this.cardsDataModel.noVpecData = true;
        this.cacheModel.vcalCard ? this.cardsDataModel.vCalCardData = this.cacheModel.vcalCard : this.cardsDataModel.noVcalData = true;
        // tslint:disable-next-line: max-line-length
        this.cacheModel.favorCard ? this.cardsDataModel.vshareCardData = this.cacheModel.favorCard : this.cardsDataModel.noVshareData = true;
        // tslint:disable-next-line: max-line-length
        this.cacheModel.vcanvasCard ? this.cardsDataModel.vcanvasCardData = this.cacheModel.vcanvasCard : this.cardsDataModel.noVcanvasData = true;
        this.cacheModel.vflowCard ? this.cardsDataModel.vflowCardData = this.cacheModel.vflowCard : this.cardsDataModel.noVflowData = true;
        this.currentUser = this.cacheModel.currentUser;
        this.isAdmin = this.cacheModel.isAdmin;

        // tslint:disable-next-line: max-line-length
        this.backgroundColor = this.userDashboardModel.backgroundColor ? this.userDashboardModel.backgroundColor : this.defaultBackgroundColor;
        this.backgroundImageUrl = this.userDashboardModel.backgroundImage ? this.userDashboardModel.backgroundImage : '';
        // tslint:disable-next-line: max-line-length
        this.isBackgroundColorSelected = this.userDashboardModel.isColorSelected !== undefined ? this.userDashboardModel.isColorSelected : true;
        this.showNewsArea = this.userDashboardModel.findNewsRow() ? this.userDashboardModel.findNewsRow().isEnabled : false;
        this.cloneUserdashboardModel = this.cloneObject(this.userDashboardModel, new UserDashboardModel());

        this.stopProgressBar();
        if (this.UserManager) {
          this.router.navigate(['settings']);
        }
      } else {
        this.loadAndCacheCardData();
      }
    }
    // call load function every 1 minute
    this.periodicDashboardUpdate();

    this.dashService.newsOrderModule.subscribe(result => {
      if (result) {
        this.orderModule = result;
      } else {
        this.orderModule = null;
      }
    });

    this.dashService.showNewsAndReminders.subscribe(result => {
      if (typeof result === 'boolean') {
        this.showNewsArea = result;
      }
    });
  }

  getFeeds() {
    Promise.all([
      this.loadFeedRss().then(val => { return val }),
    ]).then(results => {
      // feeds
      if (!this.dashService.isSavingFeeders) {
        this.feedsData = results[0];
        this.dashboardCacheService.setCacheFeedModel(this.feedsData);
        this.dashboardCacheService.setUserDashboardModel(this.userDashboardModel);
        this.dashService.setUserDashboardConfig(this.userDashboardModel).toPromise();
      }
    })
  }

  loadAndCacheCardData(isPeriodicRefresh?: boolean) {
    const self = this;
    this.promisesNumber = 9; // number of promises in Promise.all

    Promise.all([
      this.loadFavoritesCardContent().then(val => { self.progressBarFunc(++self.count); return val; }),  // 0
      this.loadVMeetCardContent().then(val => { self.progressBarFunc(++self.count); return val; }),      // 1
      this.loadVPecCardContent().then(val => { self.progressBarFunc(++self.count); return val; }),       // 2
      this.loadVCalCardContent().then(val => { self.progressBarFunc(++self.count); return val; }),       // 3
      this.loadVFlowCardContent().then(val => { self.progressBarFunc(++self.count); return val; }),      // 4
      this.loadVCanvasCardContent().then(val => { self.progressBarFunc(++self.count); return val; }),    // 5
      this.loadUserDashboardConfig(isPeriodicRefresh).then(val => { self.progressBarFunc(++self.count); return val; }),   // 6
      this.loadPostIt().then(val => { self.progressBarFunc(++self.count); return val; }),                // 7
    ])
      .then(results => {
        this.isCardRefresh = false;
        const cacheModel = new CacheCardModel();
        cacheModel.favorCard = results[0];
        cacheModel.vmeetCard = results[1];
        cacheModel.vpecCard = results[2];
        cacheModel.vcalCard = results[3];
        cacheModel.vflowCard = results[4];
        cacheModel.vcanvasCard = results[5];
        cacheModel.currentUser = this.currentUser;
        cacheModel.isAdmin = this.isAdmin;
        let userDashboardModel = null;
        if (results[6]) {
          userDashboardModel = Object.assign(new UserDashboardModel(), results[6]);
        }
        // post-it
        if (!this.dashService.isSavingPostIts) {
          this.postItsData = results[7];
          this.dashboardCacheService.setCachePostItModel(this.postItsData);
        }
        // data cards
        this.cardsDataModel.vmeetCardData = cacheModel.vmeetCard;
        this.cardsDataModel.vpecCardData = cacheModel.vpecCard;
        this.cardsDataModel.vCalCardData = cacheModel.vcalCard;
        this.cardsDataModel.vshareCardData = cacheModel.favorCard;
        this.cardsDataModel.vcanvasCardData = cacheModel.vcanvasCard;
        this.cardsDataModel.vflowCardData = cacheModel.vflowCard;
        this.dashboardCacheService.setCacheCardModel(cacheModel);
        // user dashboard data
        if (!isPeriodicRefresh) {
          this.userDashboardModel = userDashboardModel ? userDashboardModel : this.defaultUserDashboardModel();
          this.updateUserDashboardModel();
          this.cloneUserdashboardModel = this.cloneObject(this.userDashboardModel, new UserDashboardModel());
          this.isBackgroundColorSelected = this.userDashboardModel.isColorSelected;
          this.backgroundImageUrl = this.userDashboardModel.backgroundImage;
          this.backgroundColor = this.userDashboardModel.backgroundColor;
          this.showNewsArea = this.userDashboardModel.findNewsRow() ? this.userDashboardModel.findNewsRow().isEnabled : false;
          this.dashboardCacheService.setUserDashboardModel(this.userDashboardModel);
          this.dashService.setUserDashboardConfig(this.userDashboardModel).toPromise();
        }
        // stop progress bar
        this.stopProgressBar();
        this.getFeeds()
        //setTimeout(() => this.getFeeds(), 5000); //Debounce testing
        
        if (this.UserManager) {
          this.router.navigate(['settings']);
        }
      });
  }

  loadGuestTab(array: any) {
    for (const a in array) {
      if (this.arrayApps.filter(x => x.name.toLowerCase() === array[a].toLowerCase()).length > 0) {
        let name = this.arrayApps.filter(x => x.name.toLowerCase() === array[a].toLowerCase())[0].name
        for(var i in this.arrayApps){
          if(name == this.arrayApps[i].name){
            this.arrayApps[i].disabled = false;
            this.userAppsEnable.push(this.arrayApps[i]);
          } 
        }        
      }
    }
    this.isGuest = (this.isTar)? false : this.authService.isUserGuest;
    this.stopProgressBar();
    if (this.UserManager) {
      this.router.navigate(['settings']);
    }
  }

  navigateTo(element: any) {
    if (element.disabled) {
      return;
    }
    switch (element.name) {
      case 'VSHARE':
        this.logoService.onLauncherClick('vShare');
        this.router.navigateByUrl('filesharing');
        break;
      case 'VPEC':
        this.logoService.onLauncherClick('vPEC');
        this.router.navigateByUrl('mail');
        break;
      case 'VCAL':
        this.logoService.onLauncherClick('vCal');
        this.router.navigateByUrl('calendar');
        break;
      case 'VCANVAS':
        this.logoService.onLauncherClick('vCanvas');
        this.router.navigateByUrl('canvas');
        break;
      case 'VFLOW':
        this.logoService.onLauncherClick('vFlow');
        this.router.navigate(['flow']);
        break;
      case 'VSHARE':
        this.logoService.onLauncherClick('vShare');
        this.router.navigateByUrl('filesharing/all-files');
        break;
    }
  }

  periodicDashboardUpdate() {
    this.interval = setInterval(() => {
      if (!this.isCardRefresh && !this.isEditDashboard) {
        this.isCardRefresh = true;
        this.loadAndCacheCardData(true);
      }
    }, 1000 * 60);
  }

  setAdminUserParam() {
    if (this.currentUser) {
      // Check if current user is Admin
      if (this.currentUser.groups.length > 0) {
        for (const group of this.currentUser.groups) {
          if (group === 'admin') {
            this.isAdmin = true;
          }
        }
      }
    }
  }

  progressBarFunc(count: number) {
    const value = count / this.promisesNumber;
    if (value <= 1) { // 1 == 100%
      if (this.inProgress) {
        this.barValue = value * 100;
      }
    }
  }

  stopProgressBar() {
    if (!browserRefresh) {
      this.inProgress = false;
      this.dashService.setShowHeader(true);
      this.chatService.showChat();
    } else {
      const self = this;
      // timeout per mostrare la barra di caricamento che si completa al 100%
      setTimeout(() => {
        self.inProgress = false;
        self.dashService.setShowHeader(true);
        self.chatService.showChat();
      }, 10);
    }
  }

  initialSettings() {
    // Get vpec current account for the user if exist
    if (globals.vpecEndpoint) {
      this.vPecCurrentUser = sessionStorage.getItem('VPEC_currentUser');
      this.accountIdVPEC = parseInt(sessionStorage.getItem('VPEC_currentId'), 10);

      if ((!this.vPecCurrentUser || this.vPecCurrentUser === undefined) &&
        (isNaN(this.accountIdVPEC) || this.accountIdVPEC === undefined)) {
        this.getAccountListSubs = this.dashService.getAccountList().subscribe((result: any) => {
          if (result && result.Dto && result.Dto.length > 0) {
            sessionStorage.setItem('VPEC_ac_list', btoa(JSON.stringify(result.Dto)));
            this.utilService.accountList = result.Dto;
            this.utilService.accountList.map(async account => {
              const resp = await this.dashService.getSignature(account.id).toPromise();
              if (resp.Dto[0] !== undefined) {
                this.utilService.signatureList.push(resp.Dto[0]);
              }
            });
            const email = result.Dto.map(account => account.email)[0];
            sessionStorage.setItem('VPEC_currentUser', email);
            const id = result.Dto.map(account => account.id)[0];
            sessionStorage.setItem('VPEC_currentId', id);
          }
        });
      }
    }

    //  Set vCal default calendar
    localStorage.setItem('VCAL_defaultCalendar', '0');
  }

  defaultUserDashboardModel() {
    const model = new UserDashboardModel();
    model.backgroundColor = this.defaultBackgroundColor;
    model.backgroundImage = null;
    model.isColorSelected = true;
    if(this.isTar){
      model.rows = [
        {
          index: 0,
          isNewsSection: true,
          isEnabled: true,
          orderNews: 0,
          orderReminders: 1,
          columns: [
            { components: [{ name: 'News' }], index: 0 }
          ]
        },
        {
          index: 1,
          isNewsSection: false,
          columns: [
            { components: [{ name: 'VCal' }], index: 0 },
            { components: [{ name: 'VCanvas' }], index: 1 },
            { components: [{ name: 'VFlow' }], index: 2 },
          ]
        },
        {
          index: 2,
          isNewsSection: false,
          columns: [
            { components: [{ name: 'VMeet' }], index: 0 },
            { components: [{ name: 'VPec' }], index: 1 },
            { components: [{ name: 'VShare' }], index: 2 },
          ]
        },        
      ];
    }else{
      model.rows = [
        {
          index: 0,
          isNewsSection: true,
          isEnabled: true,
          orderNews: 0,
          orderReminders: 1,
          columns: [
            { components: [{ name: 'News' }], index: 0 }
          ]
        },
        {
          index: 1,
          isNewsSection: false,
          columns: [
            { components: [{ name: 'VMeet' }], index: 0 },
            { components: [{ name: 'VPec' }], index: 1 },
            { components: [{ name: 'VCal' }], index: 2 },
          ]
        },
        {
          index: 2,
          isNewsSection: false,
          columns: [
            { components: [{ name: 'VShare' }], index: 0 },
            { components: [{ name: 'VCanvas' }], index: 1 },
            { components: [{ name: 'VFlow' }], index: 2 },
          ]
        },
      ];
    }
    
    return model;
  }

  async loadUserDashboardConfig(isPeriodicRefresh?: boolean) {
    let resultFunction = null;
    if (!isPeriodicRefresh) {
      try {
        const userDashboardModel = await this.dashService.getUserDashboardConfig().toPromise();
        if (userDashboardModel && userDashboardModel.performed && userDashboardModel.configData) {
          resultFunction = userDashboardModel.configData;
        }
      } catch (e) {
        return resultFunction;
      }
    }
    return resultFunction;
  }

  updateUserDashboardModel() {
    // update user model with new element in default model
    const tempDefault = this.defaultUserDashboardModel();
    if (this.userDashboardModel.rows.length === 2) {
      tempDefault.rows[1] = this.userDashboardModel.rows[0];
      tempDefault.rows[1].index = 1;
      tempDefault.rows[2] = this.userDashboardModel.rows[1];
      tempDefault.rows[2].index = 2;
    } else if (this.userDashboardModel.rows.length === 3 && !this.isTar) {
      tempDefault.rows = this.userDashboardModel.rows;
    }
    this.userDashboardModel.rows = tempDefault.rows;

    // modello delle disposizioni ordinato per indice
    this.userDashboardModel.rows.sort((a, b) => (a.index > b.index) ? 1 : -1);
    this.userDashboardModel.rows.forEach(row => {
      row.columns.sort((a, b) => (a.index > b.index) ? 1 : -1);
    });

    // card attive in app-config
    const enabledCards = [];
    this.dashService.getAvailableCards(this.userApps).forEach(cardName => {
      if (this.isCardEnabled(cardName)) {
        enabledCards.push(cardName);
      }
    });

    // card personalizzate salvate dall'utente
    const userOrderedCards = [];
    let newsRow: Row;
    this.userDashboardModel.rows.forEach(row => {
      if (row.isNewsSection) {
        newsRow = row;
      }
      row.columns.forEach(column => {
        userOrderedCards.push(column.components[0].name);
      });
    });

    // creazione nuovo modello in base alle card attive in app-config
    const columnModel = [];
    userOrderedCards.forEach(userCardName => {
      if (enabledCards.indexOf(userCardName) >= 0) {
        const column = new Column(new Array(new DraggableComponent(userCardName)));
        columnModel.push(column);
      }
    });

    // se all'utente viene attivata una card (modulo) non presente nel suo modello viene aggiunta per ultima
    enabledCards.forEach(userCardName => {
      if (userOrderedCards.indexOf(userCardName) < 0) {
        const column = new Column(new Array(new DraggableComponent(userCardName)));
        columnModel.push(column);
      }
    });

    // assegnamento nuove righe nel modello delle disposizioni
    let flag = false;
    this.userDashboardModel.rows.forEach(row => {
      if (!row.isNewsSection) {
        row.columns = []; // vengono svuotate le row nel modello
        if (!flag) {
          for (let i = 0; i < columnModel.length && i < 3; i++) {
            columnModel[i].index = i;
            row.columns.push(columnModel[i]);
          }
          flag = true;
        } else {
          for (let i = 3; i < columnModel.length && i < 6; i++) {
            columnModel[i].index = i - 3;
            row.columns.push(columnModel[i]);
          }
        }
      }
    });
  }

  cloneObject<Type>(objectToClone: Type, clone: Type) {
    const obj = JSON.parse(JSON.stringify(objectToClone));
    return Object.assign(clone, obj);
  }

  isCardEnabled(cardName: string) {
    switch (cardName) {
      case 'VMeet':
        return this.globalsVar.enableVmeet;
      case 'VPec':
        return this.globalsVar.enableVpec;
      case 'VCal':
        return this.globalsVar.enableVcal;
      case 'VShare':
        return this.globalsVar.enableVshare;
      case 'VCanvas':
        return this.globalsVar.enableVcanvas;
      case 'VFlow':
        return this.globalsVar.enableVFlow;
    }
  }

  async getUserInfo() {
    if (this.currentUser) {
      // Check if current user is Admin
      if (this.currentUser.groups.length > 0) {
        for (const group of this.currentUser.groups) {
          if (group === 'admin') {
            this.isAdmin = true;
          }
        }
      }
    }
  }

  async loadFavoritesCardContent() {
    let resultFunction = null;
    try {
      if (globals.enableVshare) {
        const resultList = await this.dashService.getListFavorites().toPromise();
        if (resultList.body.multistatus && resultList.body.multistatus.response) {
          const response = resultList.body.multistatus.response;
          const list = this.util.getResponseFavorites(response);
          list.sort((a, b) => (a.name < b.name) ? 1 : -1);
          list.sort((a, b) => (b.file < a.file) ? 1 : -1);

          if (list.length > 3) {
            resultFunction = list.slice(0, 3);
          } else {
            resultFunction = list;
          }
        } else {
          const cache = this.dashboardCacheService.getCacheCardModel();
          if (cache && cache.favorCard) {
            resultFunction = cache.favorCard;
          }
        }
        resultFunction ? this.cardsDataModel.noVshareData = false : this.cardsDataModel.noVshareData = true;
      }
    } catch (e) {
      resultFunction ? this.cardsDataModel.noVshareData = false : this.cardsDataModel.noVshareData = true;
      return resultFunction;
    }
    return resultFunction;
  }

  async loadVMeetCardContent() {
    let resultFunction = null;
    try {
      if (globals.enableVmeet) {
        if (this.currentUser && this.currentUser.id) {
          const tokenVMeet = sessionStorage.getItem('VMeet_Token');
          const result = await this.dashService.getMyMeetingList(this.currentUser.id, tokenVMeet).toPromise();
          if (result && result.success) {
            const meetingList: any[] = result.data && result.data.length > 0 ? result.data : null;
            if (meetingList) {
              resultFunction = meetingList;
            }
          }
        }
        resultFunction ? this.cardsDataModel.noVmeetData = false : this.cardsDataModel.noVmeetData = true;
      }
    } catch (e) {
      resultFunction ? this.cardsDataModel.noVmeetData = false : this.cardsDataModel.noVmeetData = true;
      return resultFunction;
    }
    return resultFunction;
  }

  async loadVPecCardContent() {
    let resultFunction = null;
    try {
      if (globals.enableVpec) {
        const accountEmailCounts = await this.dashService.getEmailCardCounts().toPromise();
        if (accountEmailCounts && accountEmailCounts.Performed && accountEmailCounts.Dto) {
          resultFunction = accountEmailCounts.Dto;
        }
        resultFunction ? this.cardsDataModel.noVpecData = false : this.cardsDataModel.noVpecData = true;
      }
    } catch (e) {
      resultFunction ? this.cardsDataModel.noVpecData = false : this.cardsDataModel.noVpecData = true;
      return resultFunction;
    }
    return resultFunction;
  }

  async loadVCalCardContent() {
    let resultFunction = null;
    try {
      if (globals.enableVcal) {
        const response = await this.dashService.getCalendarList().toPromise();
        const calendars: any[] = response.Dto ? response.Dto : null;

        if (calendars && calendars.length > 0) {
          const today = new Date().getTime();
          let calCount = 0;
          let calDataValueTmp = [];
          for (let i = 0, len = calendars.length; i < len; i++) {
            const data = { calendarId: calendars[i].calendarId };
            // Get events for each calendar
            const resp = await this.dashService.getCalendarEvents(data).toPromise();
            const events = resp.Dto ? resp.Dto : null;

            if (events && events.length > 0) {
              const calEvents = this.util.getCalendarData(events, today, calendars[i].calendarColor);
              calDataValueTmp = [...calDataValueTmp, ...calEvents];
            }
            calCount++;
          }

          if (globals.enableSchedule) {
            const expirationEvents = await this.getExpirationEvents(today);
            calDataValueTmp = [...calDataValueTmp, ...expirationEvents];
          }

          // Wait for all getCalendarEvents requests resolving
          if (calCount === calendars.length) {
            if (calDataValueTmp.length > 0) {
              const calDataValueSort = calDataValueTmp.sort((a, b) => {
                if (a.startTimestamp < b.startTimestamp) {
                  return -1;
                } else if (a.startTimestamp > b.startTimestamp) {
                  return 1;
                } else { return 0; }
              });
              if (calDataValueSort.length > 3) {
                // Select only first three events
                resultFunction = calDataValueSort.slice(0, 3);
              } else {
                resultFunction = calDataValueSort;
              }
            }
          }
        }
        resultFunction ? this.cardsDataModel.noVcalData = false : this.cardsDataModel.noVcalData = true;
      }
    } catch (e) {
      resultFunction ? this.cardsDataModel.noVcalData = false : this.cardsDataModel.noVcalData = true;
      return resultFunction;
    }
    return resultFunction;
  }

  async getExpirationEvents(today: number): Promise<any[]> {
    const events: any[] = [];
    const expirations: Expiration[] = await this.expirationService.getExpirations(true);
    expirations.forEach(expiration => {  
      const expStartTimestamp= new Date(expiration.datetime).getTime();

      if (expStartTimestamp > today) {  
        if (expiration.status != ExpirationStatus.DRAFT) {
          let partecipantAssignees: any[] = [];
          expiration.assignees.forEach(assignee=>{
            partecipantAssignees.push({
              CN: assignee.id_assignee,
              USERID: assignee.id_assignee,
              profilePicUrl: globals.endpoint + "/setting/info/avatar/getavatar?user=" + assignee.id_assignee + "&size=30",
            });
          });
      
          const color = this.expirationService.getStatusColor(expiration.status, expiration.datetime.toString());
          const expStart = new Date(expiration.datetime.toString());
  
          events.push({
            id: expiration.id.toString(),
            color: color,
            organizerCN: expiration.owner_id,
            organizerUserId: expiration.owner_id,
            summary: expiration.type.label,
            location: expiration.id.toString() + "/" + expiration.status,
            startTime: expStart.toLocaleString(),
            startTimestamp: expStartTimestamp,
            endTime:  '',
            isAllDay: false,
            isTimezoneChecked: false,
            //  repeatLabel: string,
            RecurrenceRule: '',
            description: expiration.description,
            isEncrypted: false,
            attendees: partecipantAssignees,
            calId: '',
            isExpiration: true
          });
        } 
      }
             
    });
    return events;
  }

  async loadVFlowCardContent() {
    let resultFunction = null;
    try {
      if (globals.enableVFlow) {
        const modelUser = new UserModel();
        modelUser.Dto.Nome = this.currentUser.displayname;
        modelUser.Dto.Email = this.currentUser.email;
        modelUser.Dto.Groups = this.currentUser.groups;
        modelUser.Performed = true;

        if (modelUser.Performed) {
          const response = await this.dashService.VFlowGetWFAAuthorized(modelUser, Ruolo.R);
          if (response.Performed) {
            if (response.Dtos.length > 0) {
              this.flowDataValue = response.Dtos;
              resultFunction = response.Dtos;
            }
          }
        }
        resultFunction ? this.cardsDataModel.noVflowData = false : this.cardsDataModel.noVflowData = true;
      }
    } catch (e) {
      resultFunction ? this.cardsDataModel.noVflowData = false : this.cardsDataModel.noVflowData = true;
      return resultFunction;
    }
    return resultFunction;
  }

  async loadVCanvasCardContent() {
    let resultFunction = null;
    try {
      if (globals.enableVcanvas) {
        const apiAppsList = await this.dashService.getAppsList().toPromise();

        if (apiAppsList && apiAppsList.Dto && apiAppsList.Dto.length > 0) {
          const vCanvasData = this.dashService.getFormattedAppsList(apiAppsList.Dto);
          resultFunction = vCanvasData;
          const self = this;
          for (const app of vCanvasData) {
            app.src = self.domSanitizer.bypassSecurityTrustUrl(app.src + '');
          }
        } else {
          const cache = this.dashboardCacheService.getCacheCardModel();
          if (cache && cache.vcanvasCard) {
            resultFunction = cache.vcanvasCard;
          }
        }
        resultFunction ? this.cardsDataModel.noVcanvasData = false : this.cardsDataModel.noVcanvasData = true;
      }
    } catch (e) {
      resultFunction ? this.cardsDataModel.noVcanvasData = false : this.cardsDataModel.noVcanvasData = true;
      return resultFunction;
    }
    return resultFunction;
  }

  async loadFeedRss() {
    let resultFunction = null;
    try {
      const feedersResponse = await this.dashService.getListFeeders().toPromise();
      if (feedersResponse && feedersResponse.Performed && feedersResponse.Dto) {
        const feedRequest = new LoadFeedsRequest();
        feedRequest.feeders = [];
        const feeders = new Feeders();
        feeders.id = feedersResponse.Dto.length > 0 ? feedersResponse.Dto[0].id : -1;
        feeders.take = 3;
        feedRequest.feeders.push(feeders);
        // save feeders url
        if (feeders.id !== -1) {
          this.dashboardCacheService.setFeedersResponse(feedersResponse);
        }
        const feedResponse = await this.dashService.loadFeeds(feedRequest).toPromise();
        if (feedResponse.Performed && feedResponse.Dto && feedResponse.Dto.length > 0) {
          resultFunction = feedResponse.Dto[0];
        }
      }
    } catch (e) {
      return resultFunction;
    }
    return resultFunction;
  }

  async loadPostIt() {
    let resultFunction = null;
    try {
      const loadPostItReq: LoadPostItRequest = {
        skip: 0,
        take: 20
      };
      const postItResponse = await this.dashService.loadPostIt(loadPostItReq).toPromise();
      if (postItResponse && postItResponse.Performed && postItResponse.Dto && postItResponse.Dto.length > 0) {
        const notCompletedPostIt = postItResponse.Dto.filter(p => !p.completed);
        notCompletedPostIt.sort(function (x, y) {
          return y.createdAt - x.createdAt;
        });
        resultFunction = notCompletedPostIt;
      }
    } catch (e) {
      return resultFunction;
    }
    return resultFunction;
  }

  showLoader() {
    this.isLoadingApp = true;
    this.spinner.show();
  }

  goToSettings() {
    if (!this.isEditDashboard) {
      this.dataSharingService.dashboardGoToSettings.next(true);
    }
  }

  getBannerSrc() {
    const d = new Date();
    const now = d.getHours() * 60 + d.getMinutes();
    const userName = this.userDisplayName();

    if (now >= this.startMorning && now < this.endMorning) {
      // mattina
      // tslint:disable-next-line: max-line-length
      this.bannerMsg = this.langService.dictionary.goodMorning_msg + ' <span class="highlighted-text">' + userName + '</span>, ' + this.langService.dictionary.morning_msg + ' <span class="highlighted-text">; )</span>';
      if(this.globalsVar.customCustomer.toLowerCase() == 'adp') return '/assets/img/banner/portocommerciale.jpg';
      else return '/assets/img/banner/morning.png';
    } else if (now >= this.endMorning && now < this.endAfternoon) {
      // pomeriggio
      // tslint:disable-next-line: max-line-length
      this.bannerMsg = this.langService.dictionary.welcome + ' <span class="highlighted-text">' + userName + '</span>, ' + this.langService.dictionary.afternoon_msg + ' <span class="highlighted-text">: )</span>';
      if(this.globalsVar.customCustomer.toLowerCase() == 'adp') return '/assets/img/banner/portocommerciale.jpg';
      else return '/assets/img/banner/afternoon.png';
    } else {
      // sera
      // tslint:disable-next-line: max-line-length
      this.bannerMsg = this.langService.dictionary.good_msg + ' <span class="highlighted-text">' + userName + '</span>, ' + this.langService.dictionary.eavening_msg + ' <span class="highlighted-text">; )</span>';
      if(this.globalsVar.customCustomer.toLowerCase() == 'adp') return '/assets/img/banner/portocommerciale.jpg';
      else return '/assets/img/banner/eavening.png';
    }
  }

  editDashboardBtn() {
    this.isEditDashboard = true;
  }

  openConfirmNewsAreaDialog() {
    const dialogModel: ConfirmDialogDataModel = {
      title: this.langService.dictionary.titleDialogNewsArea,
      content: this.langService.dictionary.contentDialogNewsArea,
      textCancelBtn: this.langService.dictionary.cancelBtnDialogNewsArea,
      textConfirmBtn: this.langService.dictionary.confirmBtnDialogNewsArea
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '780px',
      data: dialogModel,
    });
    return dialogRef;
  }

  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer.data[0].name !== event.container.data[0].name &&
      (event.previousContainer.data[0].name === 'News' ||
        event.container.data[0].name === 'News')) {
      const dialogRef = this.openConfirmNewsAreaDialog();
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Confirm') {
          const newsRow = this.cloneUserdashboardModel.findNewsRow();
          const indexOfNewsRow = this.cloneUserdashboardModel.rows.indexOf(newsRow);
          this.cloneUserdashboardModel.rows.splice(indexOfNewsRow, 1);
          if (indexOfNewsRow === 0) {
            // se l'area news si trova in cima => al trascinamento viene posta in coda
            this.cloneUserdashboardModel.rows.push(newsRow);
          } else {
            // se l'area news si trova in coda => al trascinamento viene posta in cima
            this.cloneUserdashboardModel.rows.unshift(newsRow);
          }
          // riassegnamento indici delle righe dopo il trascinamento
          this.cloneUserdashboardModel.rows.forEach((row, i) => {
            row.index = i;
          });
        }
      });
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, 0, 0);
      transferArrayItem(event.container.data, event.previousContainer.data, 1, 0);
    }
  }

  start(event: CdkDragStart<any>) {
    this.isInDrag = true;
  }

  enter(event: CdkDragEnter<any>) {
  }

  exit(event: CdkDragExit<any>) {
    this.isDragExit = true;
  }

  end(event: CdkDragEnd<any>) {
    this.isInDrag = false;
    this.isDragExit = false;
  }

  userDisplayName() {
    let name = '';
    if (this.currentUser) {
      // Get the name to display for current user
      const displayName: string = this.currentUser.displayname;
      if (displayName.includes(' ')) {
        name = displayName.split(' ')[0];
      } else if (displayName.includes('.')) {
        name = displayName.split('.')[0];
      } else {
        name = displayName;
      }
    }
    return name;
  }

  changeDashboardColor(selectedColor: string) {
    this.backgroundColor = selectedColor;
  }

  changeColorInput(colorInput: string) {
    this.backgroundColor = colorInput;
  }

  cancelEditButton() {
    this.cloneUserdashboardModel = this.cloneObject(this.userDashboardModel, new UserDashboardModel());
    this.backgroundColor = this.cloneUserdashboardModel.backgroundColor;
    this.backgroundImageUrl = this.cloneUserdashboardModel.backgroundImage;
    this.isBackgroundColorSelected = this.cloneUserdashboardModel.isColorSelected;
    this.isEditDashboard = false;
    this.dashService.newsOrderModule.next(null);
    if (this.cloneUserdashboardModel.findNewsRow()) {
      this.dashService.showNewsAndReminders.next(this.cloneUserdashboardModel.findNewsRow().isEnabled);
    }
  }

  async saveEditButton() {
    this.dashService.startLoading();
    this.cloneUserdashboardModel.backgroundColor = this.backgroundColor;
    this.cloneUserdashboardModel.backgroundImage = this.backgroundImageUrl;
    this.cloneUserdashboardModel.isColorSelected = this.isBackgroundColorSelected;
    if (this.orderModule) {
      this.cloneUserdashboardModel.setOrderNews(this.orderModule.orderNews);
      this.cloneUserdashboardModel.setOrderReminders(this.orderModule.orderReminders);
    }
    this.cloneUserdashboardModel.isEnableNewsArea(this.showNewsArea);
    this.userDashboardModel = this.cloneObject(this.cloneUserdashboardModel, new UserDashboardModel());
    this.dashboardCacheService.setUserDashboardModel(this.userDashboardModel);
    await this.dashService.setUserDashboardConfig(this.userDashboardModel).toPromise();
    if (this.isBackgroundColorSelected || this.backgroundImageUrl) {
      this.isEditDashboard = false;
    }
    this.dashService.stopLoading();
  }

  refreshFeedsAfterSave(idFeeder: number) {
    const feedRequest = new LoadFeedsRequest();
    feedRequest.feeders = [];
    const feeders = new Feeders();
    feeders.id = idFeeder;
    feeders.take = 3;
    feedRequest.feeders.push(feeders);
    this.dashService.loadFeeds(feedRequest).subscribe(feedResponse => {
      if (feedResponse.Performed && feedResponse.Dto && feedResponse.Dto.length > 0) {
        this.feedsData = feedResponse.Dto[0];
      }
    });
  }

  uploadBackgroundImage(file: FileList) {
    const imageToUpload = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.backgroundImageUrl = event.target.result;
    };
    reader.readAsDataURL(imageToUpload);
  }

  openUploadImage() {
    if (!this.isBackgroundColorSelected) {
      document.getElementById('inputBackgroundImage').click();
    }
  }

  deleteBackgroundImage() {
    if (!this.isBackgroundColorSelected) {
      this.backgroundImageUrl = null;
    }
  }

  setBackgroundType(type: string) {
    switch (type) {
      case 'color':
        this.isBackgroundColorSelected = true;
        break;
      case 'image':
        this.isBackgroundColorSelected = false;
        break;
    }
  }

  openRemindersHistoryPage() {
    this.router.navigateByUrl('dashboard/reminders');
  }

  ngOnDestroy() {
    if (this.getAccountListSubs) {
      this.getAccountListSubs.unsubscribe();
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
