import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { Router, ActivatedRoute, NavigationEnd, Route, NavigationStart } from '@angular/router';
import { SettingsService } from 'src/app/app-services/settings.service';
import { SearchbarService } from 'src/app/app-services/searchbar.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LogoService } from 'src/app/app-services/logo.service';
import { NotificationsService } from 'src/app/app-services/notifications.service';
import { interval, Observable, Subscription, throwError } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { startWith, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { globals } from 'src/config/globals';
import { LabelService } from 'src/app/file-sharing/services/sidebar.service';
import { DashboardCacheService } from 'src/app/app-services/dashboard-cache.service';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { LanguageService } from 'src/app/app-services/language.service';
import { browserRefresh } from 'src/app/app.component';
import { CacheHeaderModel } from 'src/app/app-model/dashboard/CacheHeaderModel';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilitiesService } from 'src/app/app-services/utilities.service';
import { AppConfig } from 'src/app/app-config';
import { ChatService } from 'src/app/app-services/chat.service';
import { ThrowStmt } from '@angular/compiler';
import { LogoutService } from 'src/app/app-shared/logout.service';
import { IdleTimeService } from 'src/app/app-shared/idle-time.service';
import { MatDialog } from '@angular/material/dialog';

declare var initializeChat: Function;

export interface Label {
  id: string;
  name: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  /** Now just add the application here - in the apps array - to allow the various processes.  
   * @name app name
   * @logo associated logo
   * @specialUrl if exist, navigate in different url, instead of @name with toLowerCase() applied.
   *   Example: this.router.navigateByUrl('mail') for app with name Mail
  */
  apps = [
    {
      name: 'Dashboard',
      logo: 'vDesk'
    },
    {
      name: 'Download',
      logo: 'vDesk'
    },
    {
      name: 'FileSharing',
      logo: 'vShare'
    },
    {
      name: 'Mail',
      logo: 'vPEC'
    },
    {
      name: 'Calendar',
      logo: 'vCal'
    },
    {
      name: 'Canvas',
      logo: 'vCanvas'
    },
    {
      name: 'Flow',
      logo: 'vFlow',
      specialUrl: 'flow'
    }
  ];

  showMenu = false;
  impostazioni = new SettingsService();
  searchForm: FormGroup;
  openNotif = false;
  notificationsList: any[] = [];
  selectedApp: string;
  isLabelSearch = false;
  labelSub = new Subscription();
  profilePicUrl = '';
  pictureLoading = false;
  vconnectUrl: string;
  vmeetUrl: string;
  isUsersSettings = false;
  isCanvasUsersSettings = false;
  showClaim = true;
  cacheHeaderModel: CacheHeaderModel;
  isNotificationsRefresh = false;
  regex = /^[^%$?^]*$/;
  chatOpened = false;
  isGuest: boolean = false;
  guestShare: boolean = false;
  guestMeet: boolean = false;
  guestPec: boolean = false;
  guestCal: boolean = false;
  guestFlow: boolean = false;
  guestCanvas: boolean = false;
  guestTask: boolean = false;
  searchValue: string = '';


  objDate = [
    { singular: 'year_ago', plural: 'years_ago', value: 31536000 },
    { singular: 'month_ago', plural: 'months_ago', value: 2628000 },
    { singular: 'week_ago', plural: 'weeks_ago', value: 604800 },
    { singular: 'day_ago', plural: 'days_ago', value: 86400 },
    { singular: 'hour_ago', plural: 'hours_ago', value: 3600 },
    { singular: 'minute_ago', plural: 'minutes_ago', value: 60 }
  ];

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredLabels: Observable<Label[]>;
  selectedLabels: Label[] = [];
  allLabels: Label[] = [];
  notificationsBadge: string;
  notificationsCount: number;
  notificationsListNew: any[] = [];
  interval: NodeJS.Timer;
  searchPlaceHolder: string;
  globalsVar: AppConfig;
  notifCacheModel: CacheHeaderModel;
  UserManager: boolean;
  notCustom: boolean = false;
  notPec: boolean = false;
  isADP: boolean = false;
  getHtmlHeader: string;

  @Output() openChat = new EventEmitter<boolean>();

  @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
  @ViewChild('labelAuto') matAutocomplete: MatAutocomplete;

  @ViewChild('toggleButtonNotif') toggleButton: ElementRef;
  @ViewChild('dropdownNotif') menu: ElementRef;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private searchbarService: SearchbarService,
    private formBuilder: FormBuilder,
    private logoService: LogoService,
    private notifService: NotificationsService,
    private location: Location,
    private LabelService: LabelService,
    public chatService: ChatService,
    private dashboardCacheService: DashboardCacheService,
    private renderer: Renderer2,
    private dataSharingService: DataSharingService,
    public langService: LanguageService,
    private dashboardService: DashboardService,
    private snackBar: MatSnackBar,
    private utilitiesService: UtilitiesService,
    private logoutService: LogoutService,
    private idleTimeService: IdleTimeService,
    private dialog: MatDialog
  ) {
    this.globalsVar = globals;
    this.notifCacheModel = new CacheHeaderModel();
    this.getHtmlHeader = (this.globalsVar.customCustomer.toLowerCase() == 'notariato')? langService.dictionary.header_claim_msg_notbox : langService.dictionary.header_claim_msg;

    const userManager = sessionStorage.getItem('userManager');
    if (userManager !== undefined && userManager === 'true') {
      this.UserManager = true;
    } else {
      this.UserManager = false;
    }

    // close notifications dropdown when click outside
    //if (!this.UserManager) {
    this.renderer.listen('window', 'click', (e: any) => {
      if (!this.toggleButton.nativeElement.contains(e.target) &&
        !this.menu.nativeElement.contains(e.target) &&
        e.target.id !== 'delete-single-notification' &&
        e.target.id !== 'read-all-notif') {
        this.openNotif = false;
      }
    });
    //}

  }

  ngOnInit() {
    this.isADP = (this.globalsVar.customCustomer.toLowerCase() == 'adp')? true : false;
    if(this.globalsVar.customCustomer.toLowerCase() == 'notariato'){
      this.notCustom = true;
      this.notPec = true;
      //this.notPec = (sessionStorage.getItem('groups').includes('notbox-pec'))? true : false;
    }
    this.isGuest = this.authService.isUserGuest;
    // if(this.isGuest) this.checkApps(this.authService.userApps);
    this.checkApps(this.authService.userApps);
    const converse = document.getElementById('conversejs');
    if (browserRefresh) {
      this.loadAndCacheNotifications();
      this.loadAndCacheAvatar();
      if (this.globalsVar.enableChat && this.globalsVar.enableVmeet) {
        this.chatService.setChatBadge();
        if (!converse) {
          try {
            const settings = this.chatService.setChatSettings(this.authService.currentUser, this.globalsVar.vMeetEndpoint, this.globalsVar.vMeetLink, this.globalsVar.endpoint);
            initializeChat(settings);
          } catch (e) {
            throwError('Something bad happened with chat initialization;').subscribe();
          }
        }
      }
    } else {
      this.cacheHeaderModel = this.dashboardCacheService.getCacheHeaderModel();
      if (this.cacheHeaderModel) {
        this.notificationsList = this.cacheHeaderModel.notificationsList;
        this.notificationsBadge = this.cacheHeaderModel.notifCounter;
        this.profilePicUrl = this.cacheHeaderModel.userAvatarBase64;
      } else {
        this.loadAndCacheNotifications();
        this.loadAndCacheAvatar();
      }
      if (this.globalsVar.enableChat && this.globalsVar.enableVmeet) {
        this.chatService.setChatBadge();
        if (!converse) {
          try {
            const settings = this.chatService.setChatSettings(this.authService.currentUser, this.globalsVar.vMeetEndpoint, this.globalsVar.vMeetLink, this.globalsVar.endpoint);
            initializeChat(settings);
          } catch (e) {
            throwError('Something bad happened with chat initialization;').subscribe();
          }
        }
      }
    }

    // check notifications every 1 minute
    this.periodicNotificationsUpdate();

    /** Initialization when the app changes */
    this.logoService.launcherClick.subscribe(data => {
      this.changeAppInit(data);
    });

    this.logoService.profilePictureChange.subscribe(data => {
      if (data === true) {
        this.pictureLoading = true;
        setTimeout(() => {
          this.pictureLoading = false;
          this.loadAndCacheAvatar();
        }, 3000);
      }
    });

    // this.vconnectUrl = 'https://vconnect-demo.liveboxcloud.com';
    this.vmeetUrl = globals.vMeetLink;

    // Get all label list
    this.searchbarService.getListLabels().subscribe(result => {
      if (result.body.multistatus !== undefined) {
        const temp: any[] = result.body.multistatus.response;
        if (Array.isArray(temp)) {
          // Remove the first element of the array
          temp.shift();
          // Fill allLabels array
          temp.forEach(obj => {
            const item: Label = { id: obj.propstat.prop.id, name: obj.propstat.prop.displayname };
            this.allLabels.push(item);
          });
        }
      }
    });

    this.LabelService.change.subscribe(data => {
      this.allLabels.push(data);
    });

    // Init searchForm
    this.searchForm = this.formBuilder.group({
      search: new FormControl(''),
      app: new FormControl('vDesk')
    });

    // Check if user navigate to Labels page
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.location.path() === '/filesharing/labels') {
          this.isUsersSettings = false;
          this.isLabelSearch = true;

          // Init searchForm
          this.searchForm = this.formBuilder.group({
            search: new FormControl(this.selectedLabels),
            app: new FormControl('vShare')
          });

          this.filteredLabels = this.searchForm.controls.search.valueChanges.pipe(
            startWith(''),
            map((text: string) => (text && text.length >= 1) ? this._filter(text) : this.allLabels)
          );

          // Subscription for labels Sidebar event (on click of a sidebar label)
          this.labelSub = this.searchbarService.labelClicked$.subscribe(labelId => {
            const elem: Label = { id: '', name: '' };
            for (const item of this.allLabels) {
              if (item.id === labelId) {
                elem.id = labelId;
                elem.name = item.name.trim();
                this.selectedLabels.push(elem);
                break;
              }
            }
            this.searchFormSubmit();
          });

        } else if (this.location.path().includes('/settings/users-settings') ||
          this.location.path().includes('/settings/user-settings-search')) {
          this.isUsersSettings = true;
          this.isLabelSearch = false;
        } else if (this.location.path().includes('/settings/vcanvas-users')
          || this.location.path().includes('/settings/canvas-user-settings-search')) {
          this.isCanvasUsersSettings = true;
          this.isLabelSearch = false;
        } else if (this.location.path().includes('/filesharing/search-result/')) {
          this.isUsersSettings = this.isCanvasUsersSettings = false;
          this.selectedLabels = [];
          this.labelSub.unsubscribe();
          this.isLabelSearch = false;
        } else {
          this.isUsersSettings = this.isCanvasUsersSettings = false;
          this.selectedLabels = [];
          this.searchForm.get('search').setValue(null);
          this.labelSub.unsubscribe();
          this.isLabelSearch = false;
        }
      }
    });

    // Init app value in searchbar filter
    this.apps.forEach(app => {
      if (this.impostazioni['is' + app.name]) {
        this.searchForm.setValue({ search: '', app: app.logo });
      }
    });

    if (this.location.path().includes('vflow')) {
      this.changeAppInit('vFlow');
    }

    let appHolder = (this.app.value == 'vPEC' && this.globalsVar.customCustomer.toLowerCase() == 'notariato')? 'Mail' : this.app.value;
    this.searchPlaceHolder = this.langService.dictionary.search_in + ' ' + appHolder;

    // reload dictionary when user change language in settings
    this.dataSharingService.changeUserLanguage.subscribe((isChange: boolean) => {
      if (isChange) {
        this.loadDictionary();
      }
    });

    this.router.events.subscribe(navigation => {
      if (navigation instanceof NavigationStart) {
        const url: string = navigation.url;
        const splittedUrl = url.split('/');

        if (splittedUrl[1].includes('dashboard')) {
          this.showClaim = true;
        } else {
          this.showClaim = false;
        }

        // check route when press back/forward button in the browser
        if (navigation.restoredState) {

          if (splittedUrl[1].includes('dashboard')) {
            this.changeAppInit('vDesk');
            this.showClaim = true;
          } else {
            this.showClaim = false;
          }
          if (splittedUrl[1].includes('filesharing')) {
            this.changeAppInit('vShare');
          }
          if (splittedUrl[1].includes('mail')) {
            this.changeAppInit('vPEC');
          }
          if (splittedUrl[1].includes('calendar')) {
            this.changeAppInit('vCal');
          }
          if (splittedUrl[1].includes('canvas')) {
            this.changeAppInit('vCanvas');
          }
          if (splittedUrl[1].includes('flow')) {
            this.changeAppInit('vFlow');
          }
        }
      }
    });

    this.dataSharingService.dashboardGoToSettings.subscribe(result => {
      if (result) {
        this.dataSharingService.dashboardGoToSettings.next(false);
        this.goToSettings('');
      }
    });

  }

  checkApps(array: any) {
    if (array.length === 0) { // Added by B.Ravaglia for TIM users
      this.displayAllLaunchers();
    } else {
      for (let b in array) {
        switch (array[b].toLowerCase()) {
          case 'vshare':
            this.guestShare = true;
            break;
          case 'vmeet':
            this.guestMeet = true;
            break;
          case 'vpec':
            this.guestPec = true;
            break;
          case 'vcal':
            this.guestCal = true;
            break;
          case 'vflow':
            this.guestFlow = true;
            break;
          case 'vcanvas':
            this.guestCanvas = true;
            break;
        }
      }
    }
  }

  displayAllLaunchers() {
    this.guestShare = true;
    this.guestMeet = true;
    this.guestPec = true;
    this.guestCal = true;
    this.guestFlow = true;
    this.guestCanvas = true;
    this.guestTask = true;
  }

  loadAndCacheNotifications() {
    this.notifService.getAllNotifications().subscribe(result => {
      this.isNotificationsRefresh = false;
      if (result && result.body && result.body.ocs) {
        this.updateNotificationCounter(result);
        this.notificationsList = result.body.ocs.data;
        this.notifService.assignIconToNotification(this.notificationsList);
        this.notifCacheModel.notificationsList = this.notificationsList;
        this.notifCacheModel.notifCounter = this.notificationsBadge;
        this.notifCacheModel.userAvatarBase64 = this.profilePicUrl ? this.profilePicUrl : null;
        this.dashboardCacheService.setCacheHeaderModel(this.notifCacheModel);
        if(this.notifService.onNotificationListChanged){
          this.notifService.onNotificationListChanged.next(this.notificationsList);
        }
      }
    });
  }

  loadAndCacheAvatar() {
    this.dashboardService.getAvatar(30).subscribe((result: Blob) => {
      const self = this;
      const reader = new FileReader();
      reader.readAsDataURL(result);
      reader.onloadend = () => {
        const base64data = reader.result.toString().split(',')[1];
        self.notifCacheModel.userAvatarBase64 = 'data:image/png;base64,' + base64data;
        self.profilePicUrl = self.notifCacheModel.userAvatarBase64;
        sessionStorage.setItem('avatar', self.profilePicUrl);
      };
    });
  }

  periodicNotificationsUpdate() {
    this.interval = setInterval(() => {
      if (!this.isNotificationsRefresh) {
        this.isNotificationsRefresh = true;
        this.loadAndCacheNotifications();
      }
    }, 1000 * 60);
  }

  /**
   * Refresh dictionary language
   */
  loadDictionary() {
    this.langService.refreshDictionary();
  }

  changeAppInit(appLogo) {
    this.setAllAppToFalse();
    const app = this.apps.find(appObj => appObj.logo === appLogo);
    this.setAppToTrue(app.name);
    this.searchForm.setValue({ search: '', app: appLogo });

    let appHolder = (this.app.value == 'vPEC' && this.globalsVar.customCustomer.toLowerCase() == 'notariato')? 'Mail' : this.app.value;
    this.searchPlaceHolder = this.langService.dictionary.search_in + ' ' + appHolder;
  }

  get search() {
    return this.searchForm.get('search');
  }
  get app() {
    return this.searchForm.get('app');
  }

  addLabel(event: MatChipInputEvent): void {
    // Add label only when matAutocomplete is not open to make
    // sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our label
      if ((value || '').trim()) {
        const elem: Label = { id: '', name: value.trim() };
        this.selectedLabels.push(elem);
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.searchForm.get('search').setValue(null);
      this.searchFormSubmit();
    }
  }

  removeLabel(label: Label): void {
    const index = this.selectedLabels.indexOf(label);

    if (index >= 0) {
      this.selectedLabels.splice(index, 1);
      this.searchFormSubmit();
    }
  }

  labelSelected(event: MatAutocompleteSelectedEvent): void {
    const ind = event.option.viewValue.indexOf(' add');
    const labelSelected = event.option.viewValue.substring(0, ind);

    for (const item of this.allLabels) {
      if (item.name === labelSelected) {
        this.selectedLabels.push(item);
        this.labelInput.nativeElement.value = '';
        this.searchForm.get('search').setValue(null);
        break;
      }
    }
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    let tmp: any[] = [];
    tmp = this.allLabels.filter((labelObj) => {
      const labelName: string = labelObj.name;
      if (labelName.toLowerCase().includes(filterValue)) {
        return labelObj;
      }
    });

    return tmp;
  }


  searchFormSubmit() {
    let timeout;
    if (timeout) clearTimeout(timeout);

    if (this.isLabelSearch) { // LABELS SEARCH CASE
      // Pass the selected labels to the component Labels
      this.searchbarService.onLabelsSubmit(this.selectedLabels);

    } else { // GENERIC SEARCH CASE
      const query = this.searchForm.get('search').value;
      this.searchValue = query;
      const app = this.searchForm.get('app').value;

      if (this.regex.test(query)) {
        if (app === 'vShare') {

          timeout = setTimeout(function () {
            this.router.navigateByUrl('filesharing/search-result/' + this.searchValue);
          }.bind(this), 1000);


        } else if (app === 'vPEC') {
          this.router.navigateByUrl('mail/search-result/' + query);

        }
      } else {
        this.snackBar.open(this.langService.dictionary.no_special_character, '', {
          duration: 4000,
          panelClass: 'toast-error'
        });
      }

    }
  }

  searchFormSubmitShare() {
    const query = this.searchForm.get('search').value;
    if (query.length >= 3) {
      let timeout;
      if (timeout) clearTimeout(timeout);
      this.searchValue = query;
      const app = this.searchForm.get('app').value;

      if (this.regex.test(query)) {
        if (app === 'vShare') {
          timeout = setTimeout(function () {
            this.router.navigateByUrl('filesharing/search-result/' + this.searchValue);
          }.bind(this), 1000);
        }
      } else {
        this.snackBar.open(this.langService.dictionary.no_special_character, '', {
          duration: 4000,
          panelClass: 'toast-error'
        });
      }
    }
  }

  searchUser() {
    const query = this.searchForm.get('search').value;
    const app = this.searchForm.get('app').value;

    if (this.regex.test(query)) {
      if (app === 'vDesk') {
        this.router.navigateByUrl('settings/user-settings-search/' + query);
      }
    } else {
      this.snackBar.open(this.langService.dictionary.no_special_character, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }

  }

  searchCanvasUser() {
    const query = this.searchForm.get('search').value;
    const app = this.searchForm.get('app').value;

    if (this.regex.test(query)) {
      if (app === 'vDesk') {
        this.router.navigateByUrl('settings/canvas-user-settings-search/' + query);
      }
    } else {
      this.snackBar.open(this.langService.dictionary.no_special_character, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
    }

  }

  toggleNotificationList() {
    this.openNotif = this.openNotif ? false : true;
  }

  openCloseChat() {
    // this.openSidebar.emit(true);
    if (this.chatOpened) {
      this.chatService.hideControlBox();
      this.chatOpened = false;

    } else {
      this.chatService.showControlbox();
      this.chatOpened = true;
    }
  }

  updateNotificationCounter(result: any) {
    const count = result.body.ocs.data.length;

    if (count > 0) {
      this.notificationsCount = count;

      if (count > 99) {
        this.notificationsBadge = '99+';
      } else {
        this.notificationsBadge = String(this.notificationsCount);
      }

    } else if (count === 0) {
      this.notificationsCount = null;
      this.notificationsBadge = '';
    }
  }

  goToApp(app: any) {
    if (app === 'vShare') {
      this.dataSharingService.selectVshareFromHeader.next(true);
    }
    if (app === 'vPEC' && this.router.url.includes('/mail/settings')) {
      // When click VPEC, if current location is /mail/settings, 
      // emit the event reloadMail that is subscribed in mail.component.ts.
      // This is necessary for reload the folders list in VPEC left sidebar
      this.dataSharingService.reloadMail('mail'); 
    }

    app = this.apps.find(appObj => appObj.logo === app);
    let appUrl = app.hasOwnProperty('specialUrl') ? app.specialUrl : app.name.toLowerCase();
    if (app.name === 'Flow') {
      if (this.globalsVar.enableVDoc) {
        appUrl = 'vflow/v1/dashboard';
      } else {
        appUrl = 'vflow';
      }
    }
    this.router.navigateByUrl(appUrl);
    this.changeAppInit(app.logo);
  }

  goToDownload() {
    this.router.navigateByUrl('download');
  }

  setAppToTrue(appName) {
    this.impostazioni['is' + appName] = true;
  }

  setAllAppToFalse() {
    this.apps.forEach(appName => { this.impostazioni['is' + appName.name] = false; });
  }

  logout() {
    this.logoutService.logoutUser();
    this.idleTimeService.stopIdle();
  }

  public getNotifTimeFunc(value: number): any {
    const nowDate = Math.trunc(Date.now() / 1000);
    const result = nowDate - (value / 1000);
    let date: any;
    for (const item of this.objDate) {
      const counter = Math.trunc(result / item.value);
      if (counter > 0) {
        date = counter + ((counter > 1) ? this.langService.dictionary[item.plural] : this.langService.dictionary[item.singular]);
        break;
      }
    }
    if (!date) { date = this.langService.dictionary.less_minute; }

    return date;
  }

  deleteNotification(id: any) {
    this.notificationsList = this.notificationsList.filter(elem => {
      return elem.notification_id !== id;
    });
    this.notificationsCount -= 1;
    this.notificationsBadge = String(this.notificationsCount);
    this.notifService.deleteNotification(id).subscribe(result => {
      this.loadAndCacheNotifications();
    });
  }

  markAllNotifAsRead() {
    this.notificationsList = null;
    this.notificationsCount = 0;
    this.notificationsBadge = '';
    this.notifService.deleteAllNotification().subscribe(result => {
      this.loadAndCacheNotifications();
    });
  }

  goToSettings(page: string) {
    // if (page === 'profile') {
    //   this.router.navigateByUrl('settings/profile');
    // } else {
    //   this.router.navigateByUrl('settings/encryption');
    //   // this.router.navigateByUrl('settings');
    // }
    this.router.navigateByUrl('settings/profile');

    // this.impostazioni.isDashboard = true;
    this.setAllAppToFalse();
    this.setAppToTrue('Dashboard');
    this.searchForm.setValue({ search: '', app: 'vDesk' });
  }

  setAdminUserParam() {
    let currentUser = this.authService.currentUser;
    if (currentUser) {
      // Check if current user is Admin
      if (currentUser.groups.length > 0) {
        for (const group of currentUser.groups) {
          if (group === 'admin') {
            return true;
          }
        }
      }
    }
    return false;
  }

  getDateNotification(date: string): string {
    if (date) {
      const d = new Date(date);
      const dateNotification = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();

      return dateNotification;
    }
  }

  getTimeNotification(date: string): string {
    if (date) {
      const d = new Date(date);
      const timeNotification = this.addZero(d.getHours()) + ':' + this.addZero(d.getMinutes());

      return timeNotification;
    }
  }

  addZero(i: any) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }

  goToLink(link: string) {
    if(link.includes('expiration')){
      const linkArray = link.split('=');
      const expId = linkArray[1];
      /*this.expirationService.getExpiration(parseInt(expId)).then((expiration_)=>{
        if(expiration_){
          let expInputData: ExpirationInputData = {
            mode: null,
            expiration: expiration_,
            componentMode: ComponentMode.VIEW
          };  
          const dialogRef = this.dialog.open(ExpirationComponent, {
            width: '980px',
            height : 'auto',
            data: expInputData
          });
        }
      });
      */

    }else if (link.includes('mail/inbox') && link.includes('=')) {
      const linkArray = link.split('=');

      // Get accountId param value
      const accountIdArray = linkArray[1].split('&');
      const accountId = accountIdArray[0];

      // Get accountMail param value
      const userArray = linkArray[2].split('&');
      const user = userArray[0];

      // Get messageId param value
      const messageId = linkArray[3];

      // Set vpec account session variables
      sessionStorage.setItem('VPEC_currentId', accountId);
      sessionStorage.setItem('VPEC_currentUser', user);
      sessionStorage.setItem('VPEC_notifMessageId', messageId);

      this.changeAppInit('vPEC');
      this.router.navigateByUrl('mail');
    }else if (link.includes('mail/inbox')){
      this.changeAppInit('vPEC');
      this.router.navigateByUrl('mail');
    } else if (link.includes('calendar?startDate')) {
      const linkArray = link.split('=');
      // Get startDate param value
      const startDate = linkArray[1];
      // Set vCal session variables
      sessionStorage.setItem('VCAL_startDate', startDate);

      this.changeAppInit('vCal');
      this.router.navigateByUrl('calendar');
    } else if (link.includes('filesharing?name')) {
      const linkArray = link.split('=');
      const path = linkArray[1];
      sessionStorage.setItem('VSHARE_path', path);
      this.changeAppInit('vShare');
      this.router.navigateByUrl('filesharing');
    } else if (link.includes(globals.vMeetLink)) {
      const vmeetToken = sessionStorage.getItem('VMeet_Token');
      if (vmeetToken) {
        const url = link + '?jwt=' + vmeetToken;
        window.open(url, '_blank');
      }
    } else {
      if (link.includes('linkTarget=blank')) {
        window.open(link, '_blank');
      } else {
        window.open(link, '_parent');
      }
    }
  }

  checkSearchPlaceHolder() {
    if (this.searchPlaceHolder) {
      this.searchPlaceHolder = null;
      return;
    } else {
      let appHolder = (this.app.value == 'vPEC' && this.globalsVar.customCustomer.toLowerCase() == 'notariato')? 'Mail' : this.app.value;
      this.searchPlaceHolder = this.langService.dictionary.search_in + ' ' + appHolder;
      return;
    }
  }

  truncateText(text: string, maxCharacters: number) {
    const truncatedText = this.utilitiesService.truncateText(text, maxCharacters);
    return truncatedText;
  }

  /** RETURN DASHBOARD
   * On click return froma app to dashboard
   * Taranto only for now
   **/
  returnDashboard(){
    if(this.isADP){
      let app: any = 'vDesk';  
      app = this.apps.find(appObj => appObj.logo === app);
      let appUrl = app.hasOwnProperty('specialUrl') ? app.specialUrl : app.name.toLowerCase();
      this.router.navigateByUrl(appUrl);
      this.changeAppInit(app.logo);
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
