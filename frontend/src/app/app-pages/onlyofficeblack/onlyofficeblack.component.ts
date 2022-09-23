import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/app-services/dashboard.service';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { globals } from 'src/config/globals';
import { LogoService } from 'src/app/app-services/logo.service';
import { AdminSettingsService } from 'src/app/settings/services/admin-settings.service';

@Component({
  selector: 'app-onlyofficeblack',
  templateUrl: './onlyofficeblack.component.html',
  styleUrls: ['./onlyofficeblack.component.scss']
})

export class OnlyofficeblackComponent implements OnInit {
  profilePicUrl = '';
  pictureLoading = false;
  config;
  nodata = true;

  constructor(
    private dashService: DashboardService,
    private fsService: FileSharingService,
    private router: Router,
    private logoService: LogoService,
    private adminService : AdminSettingsService,
  ) {
    this.logoService.profilePictureChange.subscribe(data => {
      if (data === true) {
        this.pictureLoading = true;
        setTimeout(() => {
          this.pictureLoading = false;
          this.profilePicUrl = `${globals.endpoint}/setting/info/avatar/currentavatar?size=30&` + new Date().getTime();
        }, 3000);
      }
    });
   }

  ngOnInit() {
    let url = decodeURIComponent(this.router.url);
    let chatIndex = url.indexOf('chat');
    let firstIndex = url.indexOf('id=') + 'id='.length;
    let secondIndex = url.indexOf('&name=') + '&name='.length;
    let thirdIndex = (url.includes('&shareToken='))? (url.indexOf('&shareToken=') + '&shareToken='.length) : -2;
    let id = url.substring(firstIndex, url.indexOf('&name='));
    let name = (thirdIndex)? url.substring(secondIndex, url.indexOf('&shareToken=')) : url.substring(secondIndex);
    let token = (thirdIndex)? url.substring(thirdIndex): '';
    let readonly = (url.includes('&readonly='))? true : false;
    // If chat onlyoffice, open in readonly mode
    if (chatIndex > 0) {
      readonly = true;
    }
    this.profilePicUrl = `${globals.endpoint}/setting/info/avatar/currentavatar?size=30&` + new Date().getTime();
    setTimeout(()=>{
      this.adminService.getOnlyOfficeUrl().subscribe((result: any) => {
        let script = (!result)? ' https://alnitak.liveboxcloud.com/web-apps/apps/api/documents/api.js' : result + 'web-apps/apps/api/documents/api.js';
        if(script.includes('http:')) script.replace('http', 'https');
        this.fsService.openOnlyOffice(id, name, token).subscribe((result: any) => {
          let edit = (result.body.document.permissions.edit)? true : false;
          let review = (edit)? true : false;

          this.config = {
            editorConfig: {
              "document": {
                "fileType": result.body.document.fileType,
                "key": result.body.document.key,
                "title": result.body.document.title,
                "url": result.body.document.url,
                "permissions": {
                  "changeHistory": (readonly) ? false : true,
                  "comment": (readonly) ? false : true,
                  "download": (readonly) ? false : true,
                  "edit": (readonly) ? false : edit,
                  "fillForms": (readonly) ? false : true,
                  "modifyContentControl": (readonly) ? false : true,
                  "modifyFilter": (readonly) ? false : true,
                  "print": (readonly) ? false : true,
                  "review": (readonly) ? false : review
                },
              },
              "documentType": result.body.documentType,
              "editorConfig": {
                  "callbackUrl": result.body.editorConfig.callbackUrl,
                  lang: "en",
                  region: "en-US",
                  customization: {
                    compactHeader: true,
                    toolbarNoTabs: true,
                    autosave: true,
                  },
                  "user": {
                    id: window.sessionStorage.user,
                    name: window.sessionStorage.user,
                  }
              },
              height: "100%",
              width: "100%"
            },
            script: script,
          }
    
          this.nodata = false;
        });
      });    
    }, 1000);
  }

}
