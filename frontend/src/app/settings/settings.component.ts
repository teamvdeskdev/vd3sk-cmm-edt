import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { DataSharingService } from '../app-services/data-sharing.service';
import { LanguageService } from './services/language.service';
import { CurrentUser } from '../app-model/common/user';
import { AuthenticationService } from '../app-shared/authentication.service';
import { VCanvasSettingsService } from './pages/vcanvas-settings/services/vcanvas-settings.service';
import { UserModel } from '../app-model/admin-settings/vcanvas/UserModel';
import { GroupModel } from '../app-model/admin-settings/vcanvas/GroupModel';
import { AdminSettingsService } from './services/admin-settings.service';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AppConfig } from '../app-config';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  panelOpenState = false;
  showAllFiles = true;
  isSideOpen: boolean;
  controltrick: boolean;
  currentpage: string;
  screen: boolean;
  isSharedOpen: boolean;

  isCanvasOpen: boolean;
  isCanvasSettings = false;
  isCanvasUserDetailsOpened = false;
  isCanvasGroupDetailsOpened = false;
  vCanvasUser: UserModel;
  vCanvasGroup: GroupModel;

  isMultiLevel: boolean;
  openLoadList: boolean;
  globalsVar: AppConfig;
  currentUser: CurrentUser;
  isAdmin = false;

  dictPath: string;

  UserManager: boolean;
  GroupFolderManager: boolean;
  notCustom: boolean = false;


  constructor(
    public router: Router,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private dataSharingService: DataSharingService,
    public langService: LanguageService,
    public authService: AuthenticationService,
    public vCanvasSettingsService: VCanvasSettingsService,
    private _adminService: AdminSettingsService,
    private fsService: FileSharingService,
  ) {
    this.globalsVar = globals;

    const userManager = sessionStorage.getItem('userManager');
    if (userManager !== undefined && userManager === 'true') {
      this.UserManager = true;
    } else {
      this.UserManager = false;
    }
    const folderManager = sessionStorage.getItem('folderManager');
    if (folderManager !== undefined && folderManager === 'true') {
      this.GroupFolderManager = true;
    } else {
      this.GroupFolderManager = false;
    }
  }

  ngOnInit() {
    this.notCustom = (this.globalsVar.customCustomer.toLowerCase() == 'notariato')? true : false;
    this.openLoadList = false;
    this.currentUser = this.authService.currentUser;
    this.setAdminUserParam();
    this.loadDictionary();
    this.isSideOpen = true;
    this.controltrick = false;
    this.getCurrentpage();
    this.screen = (window.innerWidth > 1024) ? true : false;

    // reload dictionary when user change language in settings
    this.dataSharingService.changeUserLanguage.subscribe((isChange: boolean) => {
      if (isChange) {
        this.loadDictionary();
      }
    });
    this.vCanvasSettingsService.onUserDetailsOpened.subscribe((user: UserModel) => {
      this.isCanvasUserDetailsOpened = true;
      this.vCanvasUser = user;
      this.isCanvasSettings = this.isMultiLevel = true;
    });
    this.vCanvasSettingsService.onGroupDetailsOpened.subscribe((group: GroupModel) => {
      this.isCanvasGroupDetailsOpened = true;
      this.vCanvasGroup = group;
      this.isCanvasSettings = this.isMultiLevel = true;
    });

    this.vCanvasSettingsService.onUserDetailsClosed.subscribe((nothing: any) => {
      this.isCanvasUserDetailsOpened = false;
    });

    this.vCanvasSettingsService.onGroupDetailsClosed.subscribe((nothing: any) => {
      this.isCanvasGroupDetailsOpened = false;
    });
  }

  loadDictionary() {
    this.langService.refreshDictionary();
    this.getPath();
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

  getPath() {
    if (this.router.url.includes('settings/user-settings-search')) {
      this.dictPath = this.langService.dictionary.user_search;
    } else if (this.location.path().includes('settings/canvas-user-settings-search')) {
      this.dictPath = this.langService.dictionary.vcanvas_users_settings;
      this.vCanvasInit();
    }else if(this.router.url.includes('settings/groups-settings/users/')){
      this.dictPath = this.langService.dictionary.groups_settings;
    }else if(this.router.url.includes('settings/staging-area-settings')){
      this.dictPath = this.langService.dictionary.stagingAreaSettings;
    } else {
      // Init path
      switch (this.router.url) {
        case '/settings/users-settings':
          this.dictPath = this.langService.dictionary.users_settings;
          break;
        case '/settings/groups-settings':
          this.dictPath = this.langService.dictionary.groups_settings;
          break;
        case '/settings/guest-settings':
          this.dictPath = this.langService.dictionary.guests_settings;
          break;
        case '/settings/samlusers-settings':
            this.dictPath = this.langService.dictionary.saml_settings;
            break;
        case '/settings/samlusersdisabled-settings':
            this.dictPath = this.langService.dictionary.samldisable_settings;
            break;
        case '/settings/disabled-user-settings':
            this.dictPath = this.langService.dictionary.disabled_users;
            break;
        case '/settings/user-settings-search':
          this.dictPath = this.langService.dictionary.user_search;
          break;
        case '/settings/vpec':
          this.dictPath = this.langService.dictionary.vpec_settings;
          break;
        case '/settings/vcanvas':
          this.dictPath = this.langService.dictionary.vcanvas_settings;
          break;
        case '/settings/vcanvas-users':
          this.dictPath = this.langService.dictionary.vcanvas_users_settings;
          this.vCanvasInit();
          break;
        case '/settings/vcanvas-apps':
          this.dictPath = this.langService.dictionary.vcanvas_apps_settings;
          this.vCanvasInit();
          break;
        case '/settings/vcanvas-groups':
          this.dictPath = this.langService.dictionary.vcanvas_groups_settings;
          this.vCanvasInit();
          break;
        case '/settings/vflow':
          this.dictPath = this.langService.dictionary.vflow_settings;
          break;
        case '/settings/vdpa':
          this.dictPath = this.langService.dictionary.vdpa_settings;
          break;
        case '/settings/config-panel':
          this.dictPath = this.langService.dictionary.config_panel;
          break;
        case '/settings/smtp':
          this.dictPath = this.langService.dictionary.smtp;
          break;
        case '/settings/profile':
          this.dictPath = this.langService.dictionary.profile;
          break;
        case '/settings/devicesession':
          this.dictPath = this.langService.dictionary.device_session;
          break;
        case '/settings/authentication':
          this.dictPath = this.langService.dictionary.authentication;
          break;
        case '/settings/encryption':
          this.dictPath = this.langService.dictionary.encryption;
          break;
        case '/settings/configurations':
          this.dictPath = this.langService.dictionary.configurations;
          break;
        case '/settings/outlook':
          this.dictPath = this.langService.dictionary.outlookSettings;
          break;
        case '/settings/staging-area-settings':
            this.dictPath = this.langService.dictionary.stagingAreaSettings;
            break;
      }
    }
    // Check if path changed with internal routing
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.location.path().includes('settings/user-settings-search')) {
          this.dictPath = this.langService.dictionary.user_search;
        } else if (this.location.path().includes('settings/canvas-user-settings-search')) {
          this.dictPath = this.langService.dictionary.vcanvas_users_settings;
          this.currentpage = 'vcanvas-users';
          this.vCanvasInit();
        }else if(this.router.url.includes('settings/groups-settings/users/')){
          this.dictPath = this.langService.dictionary.groups_settings;
        } else {
          this.resetVCanvas();
          switch (this.location.path()) {
            case '/settings/users-settings':
              this.dictPath = this.langService.dictionary.users_settings;
              this.currentpage = 'users-settings';
              break;
            case '/settings/groups-settings':
              this.dictPath = this.langService.dictionary.groups_settings;
              this.currentpage = 'groups-settings';
              break;
            case '/settings/guest-settings':
              this.dictPath = this.langService.dictionary.groups_settings;
              this.currentpage = 'guest-settings';
              break;
            case '/settings/samlusers-settings':
                this.dictPath = this.langService.dictionary.saml_settings;
                this.currentpage = 'samlusers-settings';
                break;
            case '/settings/samlusersdisabled-settings':
              this.dictPath = this.langService.dictionary.samldisable_settings;
              this.currentpage = 'samlusers-settings';
                break;
            case '/settings/disabled-user-settings':
              this.dictPath = this.langService.dictionary.disabled_users;
              this.currentpage = 'users-settings';
              break;
            case '/settings/vpec':
              this.dictPath = this.langService.dictionary.vpec_settings;
              this.currentpage = 'vpec';
              break;
            case '/settings/vcanvas':
              this.dictPath = this.langService.dictionary.vcanvas_settings;
              this.currentpage = 'vcanvas';
              break;
            case '/settings/vcanvas-users':
              this.dictPath = this.langService.dictionary.vcanvas_users_settings;
              this.currentpage = 'vcanvas-users';
              this.vCanvasInit();
              break;
            case '/settings/vcanvas-users':
              this.dictPath = this.langService.dictionary.vcanvas_users_settings;
              this.currentpage = 'vcanvas-users';
              this.vCanvasInit();
              break;

            case '/settings/vcanvas-apps':
              this.dictPath = this.langService.dictionary.vcanvas_apps_settings;
              this.currentpage = 'vcanvas-apps';
              this.vCanvasInit();
              break;

            case '/settings/vcanvas-groups':
              this.dictPath = this.langService.dictionary.vcanvas_groups_settings;
              this.currentpage = 'vcanvas-groups';
              this.vCanvasInit();
              break;
            case '/settings/vflow':
              this.dictPath = this.langService.dictionary.vflow_settings;
              this.currentpage = 'vflow';
              break;
            case '/settings/vdpa':
              this.dictPath = this.langService.dictionary.vdpa_settings;
              this.currentpage = 'vdpa';
              break;
            case '/settings/config-panel':
              this.dictPath = this.langService.dictionary.config_panel;
              this.currentpage = 'config-panel';
              break;
            case '/settings/smtp':
              this.dictPath = this.langService.dictionary.smtp;
              this.currentpage = 'smtp';
              break;
            case '/settings/profile':
              this.dictPath = this.langService.dictionary.profile;
              this.currentpage = 'profile';
              break;
            case '/settings/devicesession':
              this.dictPath = this.langService.dictionary.device_session;
              this.currentpage = 'devicesession';
              break;
            case '/settings/authentication':
              this.dictPath = this.langService.dictionary.authentication;
              this.currentpage = 'authentication';
              break;
            case '/settings/encryption':
              this.dictPath = this.langService.dictionary.encryption;
              this.currentpage = 'encryption';
              break;
            case '/settings/configurations':
              this.dictPath = this.langService.dictionary.configurations;
              this.currentpage = 'configurations';
              break;
            case '/settings/outlook':
                this.dictPath = this.langService.dictionary.outlookSettings;
                this.currentpage = 'outlook';
                break;
            case '/settings/staging-area-settings':
                this.dictPath = this.langService.dictionary.stagingAreaSettings;
                this.currentpage = 'staging-area-settings';
                break;
            default:
              if (this.isAdmin) {
                this.dictPath = this.langService.dictionary.users_settings;
                this.currentpage = 'users-settings';
              } else {
                this.dictPath = this.langService.dictionary.profile;
                this.currentpage = 'profile';
              }
              break;
          }
        }
      }
    });
  }
  vCanvasInit() {
    this.isCanvasOpen = this.isCanvasSettings = this.isMultiLevel = true;
  }
  resetVCanvas() {
    this.isCanvasOpen = this.isCanvasSettings = this.isMultiLevel = false;
    this.isCanvasUserDetailsOpened = this.isCanvasGroupDetailsOpened = false;
  }
  toggleClickScreen(drawer) {
    drawer = drawer.toggle();
    this.controltrick = !this.controltrick;
  }

  /** GET CURRENT PAGE
   * Get url and check the pages
   */
  getCurrentpage() {
    const url = window.location.href;
    const array = ['users-settings', 'groups-settings', 'vpec',
      'vcanvas-users', 'canvas-user-settings-search', 'vcanvas-apps', 'vcanvas-groups', 'vcanvas', 'vflow', 'vdpa', 'config-panel', 'smtp',
      'profile', 'devicesession', 'authentication', 'encryption', 'guest-settings', 'samlusers-settings', 'setting-report', 'staging-area-settings'];

    for (const i in array) {
      //if (url.includes(array[i])) {
      if (new RegExp("\\b" + array[i] + "\\b").test(url)) {
        if (array[i] === 'canvas-user-settings-search') this.currentpage = 'vcanvas-users';
        else this.currentpage = array[i];
        break;
      }
    }
  }

  goBack() {
    this.router.navigateByUrl('dashboard');
    /*this.location.back();*/
  }

  /** LIST SHARE TOGGLE
   * Use jquery
   * Toggle list shared
   **/
  listCanvasToggle() {
    //@ts-ignore
    if ($('.listCanvasDropdown').is(':hidden')) {
      //@ts-ignore
      $('.listCanvasDropdown').slideDown();
      this.isCanvasOpen = true;
    } else {
      //@ts-ignore
      $('.listCanvasDropdown').slideUp();
      this.isCanvasOpen = false;
    }
  }

  downloadReport(){
    this._adminService.getReport().subscribe((result: any) => {
      let content = atob(result);
      var csvData = new Blob([content], {type: 'text/csv;charset=utf-8;'});
      var csvURL = window.URL.createObjectURL(csvData);
      var tempLink = document.createElement('a');
      tempLink.href = csvURL;
      let date = new Date();
      let humanDate = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + '-' + date.getMinutes();
      tempLink.setAttribute('download', 'Report'+ humanDate +'.csv');
      tempLink.click();
    });
  }

}



