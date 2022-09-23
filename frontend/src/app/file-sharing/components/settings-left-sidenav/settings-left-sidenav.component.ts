import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { Router } from '@angular/router';
import { GlobalVariable } from 'src/app/globalviarables';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { globals } from 'src/config/globals';

@Component({
  selector: 'app-settings-left-sidenav',
  templateUrl: './settings-left-sidenav.component.html',
  styleUrls: ['./settings-left-sidenav.component.scss']
})
export class SettingsLeftSidenavComponent implements OnInit {
  dict = new Dictionary();
  @Input() currentpage: string;
  @Output() newSetPathEvent = new EventEmitter<string>();

  dictNotify: string;
  dictArchives: string;
  dictApp: string;
  dictGroupFolders: string;
  dictSignatureSettings: string;
  globalsVar: any;
  usersSettings: string = this.dict.getDictionary('users_settings');
  groupsSettings: string = this.dict.getDictionary('settings-groups');
  users: string = this.dict.getDictionary('settings-users');
  usersDisable: string = this.dict.getDictionary('settings-disableuser');
  usersLDAP: string = this.dict.getDictionary('settings-ldapuser');
  usersSAML: string = this.dict.getDictionary('settings-samluser');
  panelOpenState: boolean = false;
  userAdmin: boolean;
  GroupFolderManager: boolean;
  isNota: boolean = false;

  constructor(
    private router: Router,
    private global: GlobalVariable,
  ) {
    this.globalsVar = globals;
    const folderManager = sessionStorage.getItem('folderManager');
    if (folderManager !== undefined && folderManager === 'true') {
      this.GroupFolderManager = true;
    } else {
      this.GroupFolderManager = false;
    }
  }


  ngOnInit() {
    this.isNota = (this.globalsVar.customCustomer.toLowerCase() == 'notariato')? true : false;
    this.dictNotify = this.dict.getDictionary('settings-activitiesandnotifications');
    this.dictArchives = this.dict.getDictionary('settings-externalarchives');
    this.dictApp = this.dict.getDictionary('settings-applications');
    this.dictGroupFolders = this.dict.getDictionary('settings-groupfolders');
    this.dictSignatureSettings = this.dict.getDictionary('settings-signaturesettings');

    if(!this.global.isUserAdmin){
      this.global.isUserAdmin = (sessionStorage.getItem('groups').includes('admin'))? true : false;
      this.userAdmin = this.global.isUserAdmin;
    }else{
      this.userAdmin = this.global.isUserAdmin;
    }
   
  }

  emitPath(path) {
    this.newSetPathEvent.emit(path);
  }

}
