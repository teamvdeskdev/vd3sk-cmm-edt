import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-create-storage',
  templateUrl: './create-storage.component.html',
  styleUrls: ['./create-storage.component.scss']
})
export class CreateStorageComponent implements OnInit {
  
  dict = new Dictionary();
  authenticate: string = this.dict.getDictionary('authenticate');
  hostString: string = this.dict.getDictionary('host');
  shareString: string = this.dict.getDictionary('shareconfig');
  subfolderString: string = this.dict.getDictionary('subfolder');
  domainString: string = this.dict.getDictionary('domein');
  userName: string = this.dict.getDictionary('user_name');
  password: string = this.dict.getDictionary('password');
  save: string = this.dict.getDictionary('save');
  deleteString: string = this.dict.getDictionary('delete');
  showHiddenString: string = this.dict.getDictionary('show_hidden_file');
  bucketString: string = this.dict.getDictionary('bucket');
  hostnameString: string = this.dict.getDictionary('hostname');
  portString: string = this.dict.getDictionary('port');
  regionString: string = this.dict.getDictionary('region');
  accesskeyString: string = this.dict.getDictionary('access_key');
  secretkeyString: string = this.dict.getDictionary('secret_key');
  enablesslString: string = this.dict.getDictionary('enable_ssl');
  pathstyleString: string = this.dict.getDictionary('enable_pathstyle');
  authenticationv2String: string = this.dict.getDictionary('authentication_v2');
  setpermissionsString: string = this.dict.getDictionary('set_permissions');
  checkupdateString: string = this.dict.getDictionary('check_update');
  
  @Input() storage: any;
  @Input() mechanismList: any;
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();

  //SAMBA
  showPassword: boolean;
  mech: string;
  createUser: string = '';
  createPass: string = '';
  hostcreate: string = '';
  sharecreate: string = '';
  subfoldercreate: string = '';
  domaincreate: string = '';
  showHidden: boolean;

  //AMAZON
  bucket: string = '';
  host: string = '';
  port: number;
  region: string = '';
  key: string = '';
  secretKey: string = '';
  ssl: boolean = false;
  style: boolean = false;
  authentication: boolean = false;
  

  // This four are used on everything
  checkboxPreview: boolean;
  checkboxPreviewString: string = this.dict.getDictionary('check_preview');
  checkboxShare: boolean;
  checkboxShareString: string = this.dict.getDictionary('check_share');
  checkboxCompatibility: boolean;
  checkboxCompatibilityString: string = this.dict.getDictionary('check_codify');
  checkboxReadonly: boolean;
  checkboxReadonlyString: string = this.dict.getDictionary('check_readonly');
  checkUpdate: any;
  checkUpdateSelect: number;

  
  config: number;

  constructor() { }

  ngOnInit() {
    this.config = this.checkConfig();
    //SAMBA
    this.createUser = this.storage.backendOptions.user;
    this.createPass = this.storage.backendOptions.password;
    this.hostcreate = this.storage.backendOptions.host;
    this.sharecreate = this.storage.backendOptions.share;
    this.domaincreate = this.storage.backendOptions.domain;
    this.subfoldercreate = this.storage.backendOptions.root;
    this.showHidden = this.storage.backendOptions.show_hidden;
    this.checkUpdateSelect = this.storage.checklist.filesystem_check_changes;
    this.checkboxPreview = this.storage.checklist.previews;
    this.checkboxShare = this.storage.checklist.enable_sharing;
    this.checkboxCompatibility = this.storage.checklist.encoding_compatibility;
    this.checkboxReadonly = this.storage.checklist.readonly;
    this.mech = this.storage.mech;
    this.showPassword = ('password::password'.includes(this.storage.mech))? true : false;

    //AMAZON
    this.bucket = this.storage.backendOptions.bucket;
    this.host = this.storage.backendOptions.hostname;
    this.port = this.storage.backendOptions.port;
    this.region = this.storage.backendOptions.region;
    this.key = this.storage.backendOptions.key;
    this.secretKey = this.storage.backendOptions.secret;
    this.ssl = this.storage.backendOptions.use_ssl;
    this.style = this.storage.backendOptions.use_path_style;
    this.authentication = this.storage.backendOptions.legacy_auth;

    this.checkUpdate = [
      {name: 'Mai', selected: 0},
      {name: 'Una volta per accesso diretto', selected: 1}
    ];
  }

  /** CHECK CONFIG
   * Get body of the create in function of storage backend
   **/
  checkConfig(){
    let config;
    if(this.storage.backend == 'smb') config = 1;
    else if(this.storage.backend == 'amazons3') config = 2;

    return config;
  }

  /** DELETE STORAGE
   * Send storage id to parent component
   **/
  deleteStorage(){
    this.delete.emit(this.storage.id);
  }

  /** GET SELECTED MECHANISM
   * Used on SMB
   * Toggle password and username on change select
   * @param mechanism (any)
   **/
  getSelectedMechanism(mechanism: any){
    if(mechanism.identifier != 'password::password') this.showPassword = false;
    else this.showPassword = true;
  }

  createNewStorage(){
    this.storage;
    let backendOptions = {};

    let mountOptions = {
      encrypt: true,
      previews: this.checkboxPreview,
      enable_sharing: this.checkboxShare,
      filesystem_check_changes: this.checkUpdateSelect,
      encoding_compatibility: this.checkboxCompatibility,
      readonly: this.checkboxReadonly
    };

    if(this.storage.backend == 'smb'){
      if(this.mech == 'password::password'){
        backendOptions = {
          host: this.hostcreate,
          share: this.sharecreate,
          root: this.subfoldercreate,
          domain: this.domaincreate,
          show_hidden: this.showHidden,
          timeout: '',
          user: this.createUser,
          password: this.createPass
        };
      }else{
        backendOptions = {
          host: this.hostcreate,
          share: this.sharecreate,
          root: this.subfoldercreate,
          domain: this.domaincreate,
          show_hidden: this.showHidden,
          timeout: '',
        };
      }      
    }else if(this.storage.backend == 'amazons3'){
      backendOptions = {
        bucket: this.bucket,
        hostname: this.host,
        port: this.port,
        region: this.region,
        use_ssl: this.ssl,
        use_path_style: this.style,
        legacy_auth: this.authentication,
        key: this.key,
        secret: this.secretKey
      };
    }

    let newStorage;
    if(!this.storage.id){
      newStorage = {
        mountPoint: this.storage.name,
        backend: this.storage.backend,
        authMechanism: this.mech,
        backendOptions: backendOptions,
        testOnly: true,
        mountOptions: mountOptions,
        applicableUsers: [],
        applicableGroups: [],
        priority: 100
      };
    }else{
      newStorage = {
        mountPoint: this.storage.name,
        backend: this.storage.backend,
        authMechanism: this.mech,
        backendOptions: backendOptions,
        testOnly: true,
        mountOptions: mountOptions,
        applicableUsers: [],
        applicableGroups: [],
        priority: 100,
        id: this.storage.id,
      };
    }
    

    this.storage.backendOptions = backendOptions;
    this.storage.checklist = mountOptions;
    this.storage.mech = this.mech;
    
    if(this.storage.id){
      this.update.emit({add: newStorage, list: this.storage});
    }else{
      this.create.emit({add: newStorage, list: this.storage});
    }
    
  }
}
