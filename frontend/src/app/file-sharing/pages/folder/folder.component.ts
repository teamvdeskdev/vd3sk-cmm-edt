import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FileSharingService } from '../../services/file-sharing.service';
import { Utilities, FileSharingData } from '../../utilities';
import { NgxSpinnerService } from 'ngx-spinner';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { GroupFolderButton } from 'src/app/file-sharing/services/sidebar.service';
import { Subscription } from 'rxjs';
import { GlobalVariable } from 'src/app/globalviarables';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit, OnDestroy, OnChanges {
  //CHECK PAGE
  util = new Utilities();
  dict = new Dictionary();
  dataValue = [];
  getValue;
  selected = 'folder'
  pageFavorite: boolean;
  userId: any;
  myArray = [];
  name : string;
  getpage: string;
  noData: boolean;
  home: string;
  isfolder: boolean;
  done: boolean = false;
  errorData: boolean = false;
  permissions: any;
  blockActions: boolean = false;

  routeParamsSub: Subscription;
  allFilesSub: Subscription;
  externalArchivesSub: Subscription;
  GroupsFolderSub: Subscription;
  sharesSub:Subscription;
  vpecSub: Subscription;
  deletedSub: Subscription;

  unauthorized: string = this.dict.getDictionary('unauthorized_storage');

  constructor(
    private fsService: FileSharingService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private sendButton: GroupFolderButton,
    private _global: GlobalVariable,
    ) {
      this.fsService.infoLoad.subscribe(result => {
        this.load();
      });
     }

  ngOnInit() {
    this.load();
  }

  load(){
    // Observe changes for route params
    
    this.routeParamsSub = this.route.params.subscribe( (params) => {
      this.showLoader();
      let nameParams = params.name.replace(/%252F/g, '/')
      if(!this.name || (this.name != nameParams)){
        this.name = this.route.snapshot.queryParams.name.replace(/%252F/g, '/');
        this.home = this.route.snapshot.queryParams.home;      
  
        if(this.home == 'all-files' || this.home == 'recents' ||
        this.home == 'favorites' || this.home == 'favorites' ||
        this.home == 'protectedfile'){
          this.allFileRelated();
        }else if(this.home == 'vflow'){
          this.allFilesSub = this.fsService.getOpenFolder(this.name).subscribe((result: any) => {
            if(result.status==404){
              this.dataValue = [];
              this._global.dataAllFiles = this.dataValue;
              this.noData = true;
              this.hideLoader();
            }else if (result.status == 200){
              let response = result.body.multistatus.response;
              let username = result.username;
              if(response && Array.isArray(response)){
                this.dataValue = this.util.getResponseFlow(response, username, this.name);                
                this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
                this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
                this._global.dataAllFiles = this.dataValue;
                this.noData = false;
                this.hideLoader();
              }else{
                this.dataValue = [];
                this._global.dataAllFiles = this.dataValue;
                this.noData = true;
                this.hideLoader();
              }
            }
          });
        }else if(this.home == 'externalarchives'){
          this.externalArchivesSub = this.fsService.getOpenFolder(this.name).subscribe((result: any) => {
            if(result.status==503){
              this.errorData = true;
              this.hideLoader();
            }else{
              let response = result.body.multistatus.response;
              let username = result.username;
              if(response && Array.isArray(response)){
                  this.dataValue = this.util.getResponseExternalArchivesFolder(response, username, this.name);
                  this.noData = false;
                  this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
                  this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
              }else{
                  this.noData = true;
              }
              this.hideLoader();
            }
          });
        }else if(this.home == 'group-folder'){
          this.GroupsFolderSub = this.fsService.getOpenFolder(this.name).subscribe((result: any) => {
              let response = result.body.multistatus.response;
              let username = result.username;
              if(response && Array.isArray(response)){
                let result = this.util.getResponseGroupsFolder(response, username, this.name)
                this.dataValue = result.data;
                this.permissions = result.permissions;
                this.noData = false;
                this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
                this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
              }else{
                let permissions = this.util.getPermissions(response.propstat[0].prop.permissions, false);
                this.permissions = permissions;
                this.noData = true;
                this.dataValue = [];
              }
              this.sendButton.toggle(this.permissions.isCrearable);
              this.hideLoader();
          });
        }else if(this.home == 'attachmentsvpec'){
          this.vpecSub = this.fsService.getOpenFolder(this.name).subscribe((result: any) => {
            if(result.body.multistatus.response){
              this.noData = false;
              this.dataValue = this.util.getResponseVpec(result.body.multistatus.response, '');
              this.dataValue.sort((a, b) => (a.timestamp < b.timestamp) ? 1 : -1);
            }else{
              this.noData = true;
            }
            this.hideLoader();
          });
        } else if(this.home == 'shares' || this.home == 'shared-by-you' || 
          this.home == 'shared-by-others' || this.home == 'shared-by-link') {
          this.sharesSub = this.fsService.getOpenFolder(this.name).subscribe( (result: any) => {
            if (result.body.multistatus.response.length) {
              this.noData = false;
              result.body.multistatus.response.shift();
              this.dataValue = this.util.getShareFormattedResponse(result.body.multistatus.response, 'openFolder');
              this.dataValue.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
              this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
            } else {
              this.noData = true;
            }
            this.hideLoader();
          });
  
        }else if(this.home == 'labels'){
  
        }else if(this.home == 'deleted'){
            this.deletedSub = this.fsService.navigateDeletedFolder(this.name).subscribe((result: any) => {
                let response = result.body.multistatus.response;
                if(response && Array.isArray(response)){
                    this.dataValue = this.util.getResponseDeletedFiles(response);
                    this.noData = false;
                    this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
                    this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
                }else{
                    this.noData = true;
                }
                this.hideLoader();
            });
        }
  
        this.isfolder = true;
        this.pageFavorite = (this.home == 'favorites')? true : false;
        this.getpage = this.home;
      }
    });
  }

  async allFileRelated(){
    let allFilesSub = await this.fsService.getOpenFolder(this.name).toPromise();
    if(allFilesSub.status==404){
      this.dataValue = [];
      this._global.dataAllFiles = this.dataValue;
      this.noData = true;
      this.hideLoader();
    }else if (allFilesSub.status == 200){
      let response = allFilesSub.body.multistatus.response;
      let username = allFilesSub.username;
      if(response && Array.isArray(response)){
        this.dataValue = this.util.getResponseAllFiles(response, username, this.name);                
        this.dataValue.sort((a, b) => (a.name < b.name) ? 1 : -1);
        this.dataValue.sort((a, b) => (b.file < a.file) ? 1 : -1);
        this._global.dataAllFiles = this.dataValue;
        this.noData = false;
        this.hideLoader();
      }else{
        this.dataValue = [];
        this._global.dataAllFiles = this.dataValue;
        this.noData = true;
        this.hideLoader();
      }
    }
  }

  showLoader(){
    this.done = false;
    this.spinner.show();
  }

  hideLoader(){
    this.spinner.hide();
    this.done = true;
  }

  ngOnChanges(){
  }

  ngOnDestroy() {
    if (this.routeParamsSub) {
      this.routeParamsSub.unsubscribe();
    }
    if (this.allFilesSub) {
      this.allFilesSub.unsubscribe();
    }
    if (this.externalArchivesSub) {
      this.externalArchivesSub.unsubscribe();
    }
    if (this.sharesSub) {
      this.sharesSub.unsubscribe();
    }    
    if (this.vpecSub) {
      this.vpecSub.unsubscribe();
    }
    if (this.deletedSub) {
      this.deletedSub.unsubscribe();
    }
  }

}
