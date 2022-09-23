import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppConfig } from 'src/app/app-config';
import { ChatService } from 'src/app/app-services/chat.service';
import { LanguageService } from 'src/app/app-services/language.service';
import { globals } from 'src/config/globals';


@Component({
  selector: 'app-download-mobile',
  templateUrl: './download-mobile.component.html',
  styleUrls: ['./download-mobile.component.scss'],
  providers: [DatePipe]
})

export class DownloadMobileComponent implements OnInit {

  globalsVar: AppConfig;
  displayedColumns: string[] = ['icon', 'name', 'label'];
  isAndroid = true;
  isiOS = false;
  dataSource: any;
  appList = [];
  urlAppFolder: string;
  // appList  = [
  //   {icon: 'videocam', name: 'vMeet', label: this.langService.dictionary.download_now  },
  //   {icon: 'mail', name: 'vPec', label: this.langService.dictionary.download_now },
  //   {icon: 'drive_file_move', name: 'vShare', label: this.langService.dictionary.download_now },
  // ];



  constructor(
    public spinner: NgxSpinnerService,
    public router: Router,
    public langService: LanguageService,
    private chatService: ChatService,
  ) {
    this.chatService.hideChat();
    this.globalsVar = globals;

    if (this.globalsVar.mobile_folder === '') {
      this.urlAppFolder = 'https://hub.liveboxcloud.com/vdesk';
    } else {
      this.urlAppFolder = this.globalsVar.mobile_folder;
    }

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      this.isiOS = true;
      this.isAndroid = false;
    }

  }

  ngOnInit() {
    if (globals.enableVmeet) {
      this.appList.push({icon: 'videocam', name: 'vMeet', label: this.langService.dictionary.download_now  });
    }
    if (globals.enableVpec) {
      this.appList.push({icon: 'mail', name: 'vPec', label: this.langService.dictionary.download_now });
    }
    if (globals.enableVshare) {
      this.appList.push({icon: 'drive_file_move', name: 'vShare', label: this.langService.dictionary.download_now });
    }
    this.dataSource = this.appList;
  }

  download(appName: string) {
    if (appName === 'vShare') {
      this.download_vShare();
    } else if (appName === 'vPec') {
      this.download_vPec();
    } else if (appName === 'vMeet') {
      this.download_vMeet();
    }
  }

  download_vShare() {
    if (this.isiOS) {
      const link = document.createElement('a');
      link.download = 'vShare.ipa';
      link.href = 'itms-services://?action=download-manifest&url=' + this.urlAppFolder + '/vShare.manifest.plist';
      link.click();
    } else if (this.isAndroid) {
      const link = document.createElement('a');
      link.download = 'vShare.apk';
      link.href = this.urlAppFolder + '/vShare.apk';
      link.click();
    }
  }

  download_vPec() {
    if (this.isiOS) {
      const link = document.createElement('a');
      link.download = 'vPec.ipa';
      link.href = 'itms-services://?action=download-manifest&url=' + this.urlAppFolder + '/vPec.manifest.plist';
      link.click();
    } else if (this.isAndroid) {
      const link = document.createElement('a');
      link.download = 'vPec.apk';
      link.href = this.urlAppFolder + '/vPec.apk';
      link.click();
    }
  }

  download_vMeet() {
    if (this.isiOS) {
      const link = document.createElement('a');
      link.download = 'vMeet.ipa';
      link.href = 'itms-services://?action=download-manifest&url=' + this.urlAppFolder + '/vMeet.manifest.plist';
      link.click();
    } else if (this.isAndroid) {
      const link = document.createElement('a');
      link.download = 'vMeet.apk';
      link.href = this.urlAppFolder + '/vMeet.apk';
      link.click();
    }
  }


}
