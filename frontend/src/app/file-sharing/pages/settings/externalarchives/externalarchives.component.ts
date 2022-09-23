import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-settings-externalarchives',
  templateUrl: './externalarchives.component.html',
  styleUrls: ['./externalarchives.component.scss']
})
export class ExternalArchivesComponent implements OnInit {

  dict = new Dictionary();
  hide: boolean = true;
  slideOn: boolean;
  backendList: any = [];
  backendDone: boolean;
  mechanismList: any = [];
  mechanismDone: boolean;
  storageList: any = [];
  storageDone: boolean;
  isCreate: boolean = false;
  newCreateStorage: any = {};
  isdata: boolean = false;
  doneDataLoader: boolean = false;

  globals: any;
  globalPassword: string = '';
  globalUser: string = '';

  namestorage: string = '';
  typestorage: string = '';

  deleteSuccess: string = this.dict.getDictionary('storage_deleted');
  createSuccess: string = this.dict.getDictionary('storage_created');
  credentialUpdated: string = this.dict.getDictionary('global_saved');
  dataMissing: string = this.dict.getDictionary('error_nodata');
  saveString: string = this.dict.getDictionary('save');
  saveInfoString: string = this.dict.getDictionary('global_save_info');
  dictLinkedArchives: string = this.dict.getDictionary('linked_archives');
  globalTitle: string = this.dict.getDictionary('global_title');
  globalSubtitle: string = this.dict.getDictionary('global_subtitle');
  storageTitle: string = this.dict.getDictionary('storage_title');
  storageSubtitle: string = this.dict.getDictionary('storage_subtitle');
  storageSubtitle2: string = this.dict.getDictionary('storage_subtitle2');
  addString: string = this.dict.getDictionary('add');
  dictInsertFolderName: string = this.dict.getDictionary('insert_folder_name');
  dictInserUserName: string = this.dict.getDictionary('insert_username');

  constructor(
    private services: FileSharingService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.showLoader();
    this.getListBackend();
    this.getGlobal();
  }

  showLoader(){
    this.isdata = false;
    this.spinner.show();
  }

  hideLoader(){
    this.spinner.hide();
    this.isdata = true;
  }

  /** GET GLOBAL
   * Get global username and password
   * Check the global slider
   **/
  async getGlobal(){
    let globals = await this.services.storageReadCredential().toPromise();
    this.globals = globals;
    this.globalPassword = globals.password;
    this.globalUser = globals.username;

    if(this.globalPassword && this.globalUser) this.slideOn = true;
    else this.slideOn = false;
  }

  /** SAVE GLOBAL
   * No globals error
   * Get global info and save them
   **/
  async saveGlobal(){
    this.showLoader();
    if(this.globals.password == this.globalPassword && this.globals.username == this.globalUser)
      return;

    if(!this.globalPassword || !this.globalUser){
      this._snackBar.open(this.dataMissing, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
      return;
    }

    let globals = await this.services.storageUpdateCredential(this.globalUser, this.globalPassword).toPromise();
    if(globals.status == 200){
      this.hideLoader();
      this._snackBar.open(this.credentialUpdated, '', {
        duration: 4000,
        panelClass: 'toast-success'
      });
    }
  }

  /** GET LIST BACKEND
   * Get all backends (amazon and smb for now)
   **/
  async getListBackend(){
    let list = await this.services.storageGetBackend().toPromise();
    if(list){
      for(let i in list){
        if(i=='amazons3' || i=='smb'){
          this.backendList.push({
            name: list[i].name,
            schemes: list[i].authSchemes,
            identifier: list[i].identifier,
          });
        }
      }
      this.backendDone = true;
      this.getMechanismList();
    }else{
      this.backendDone = false;
    }
  }

  /** GET MECHANISM LIST
   * Get all mechanism list
   **/
  async getMechanismList(){
    let list = await this.services.storageGetMechanism().toPromise();
    if(list){
      for(let a in this.backendList){
        for(let b in this.backendList[a].schemes){
          if(this.backendList[a].schemes[b]){
            for(let c in list){
              if(b == list[c].scheme){
                this.mechanismList.push(list[c]);
              }
            }
          }
        }
      }
      this.mechanismDone = true;
      this.getListAllStorage();
    }else{
      this.mechanismDone = false;
    }
  }

  /** GET LIST ALL STORAGE
   * Get all storages
   **/
  async getListAllStorage(){
    let list = await this.services.storageListAll().toPromise();
    if(list.status == 200){
      for(var a in list.body){
        let schemes;
        let possibleMechanism = [];
        let index = this.backendList.findIndex(x => x.identifier == list.body[a].backend);
        if(index >= 0){
          schemes = this.backendList[index].schemes;
        }

        for(var l in schemes){
          if(schemes[l]){
            for(var k in this.mechanismList){
              if(l == this.mechanismList[k].scheme)
                possibleMechanism.push(this.mechanismList[k]);
            }
          }          
        }
        
        let obj = {
          id : list.body[a].id,
          name : list.body[a].mountPoint.replace('/',''),
          backend : list.body[a].backend,
          mech : list.body[a].authMechanism,
          mechList: possibleMechanism,
          backendOptions : list.body[a].backendOptions,
          schemes: schemes,
          checklist : list.body[a].mountOptions,
          open: false,
        }
        this.storageList.push(obj);
      }
      this.storageDone = true;
      this.hideLoader();
      this.doneDataLoader = true;
    }else{
      this.storageDone = false;
      this.hideLoader();
      this.doneDataLoader = true;
    }
    
  }

  /** CREATE STORAGE
   * Event: on button click
   * Open create storage, hide button
   * Check if there are values 
   **/
  createStorage(){
    if(!this.typestorage || !this.namestorage){
      this._snackBar.open(this.dataMissing, '', {
        duration: 4000,
        panelClass: 'toast-error'
      });
      return;
    }

    let mechList = [];
    let indexBackend = this.backendList.findIndex(x => x.identifier == this.typestorage);
    for(let a in this.backendList[indexBackend].schemes){
      if(this.backendList[indexBackend].schemes[a]){
        for(let c in this.mechanismList){
          if(a == this.mechanismList[c].scheme){
            mechList.push(this.mechanismList[c]);
          }
        }
      }
    }

    let mech, backendOptions;
    if(this.typestorage == 'smb'){
      mech = 'password::password';
      backendOptions = {
        domain: '',
        host: '',
        password: '',
        root: '',
        share: '',
        show_hidden: false,
        timeout: '',
        user: ''
      }
    }else{
      mech = 'amazons3::accesskey';
      backendOptions = {
        bucket: '',
        hostname: '',
        port: null,
        region: '',
        use_ssl: false,
        use_path_style: false,
        legacy_auth: false,
        key: '',
        secret: ''
      }
    }

    this.newCreateStorage = {
      backend: this.typestorage,
      backendOptions: backendOptions,
      checklist: {
        enable_sharing: false,
        encoding_compatibility: false,
        encrypt: true,
        filesystem_check_changes: 1,
        previews: true,
        readonly: false,
      },
      id: null,
      mech: mech,
      mechList: mechList,
      name: this.namestorage,
      open: false,
      schemes: this.backendList[indexBackend].schemes
    }

    this.isCreate = true;
  }

  /** ADD NEW STORAGE
   * Create new storage with BE call
   * @param $event (any) new storage
   **/
  async addNewStorage($event: any){
    this.showLoader();
    let doneCreate = await this.services.storageCreate($event.add).toPromise();
    if(doneCreate.status == 200){
      $event.list.id = doneCreate.body.id;
      this.storageList.push($event.list);
      this.hideLoader();  
      this._snackBar.open(this.createSuccess, '', {
        duration: 4000,
        panelClass: 'toast-success'
      });
      this.closeCreate();
    }else{
      this.closeCreate();
      this.hideLoader();
    }
  }

  async updateNewStorage($event){
    this.showLoader();
    let doneCreate = await this.services.storageUpdate($event.add.id, $event.add).toPromise();
    if(doneCreate.status == 200){
      let index = this.storageList.findIndex(x => x.id == $event);
      this.storageList.splice(index, 1);
      this.storageList.push($event.list);   
      this.hideLoader();   
      this._snackBar.open(this.createSuccess, '', {
        duration: 4000,
        panelClass: 'toast-success'
      });
      this.closeCreate();
    }else{
      this.closeCreate();
      this.hideLoader();
    }
  }

  /** DELETE STORAGE
   * Delete choosen storage
   * @param $event (any) id of the choosen storage
   *  **/
  async deleteStorage($event: any){
    this.showLoader();
    if($event){
      let doneDelete = await this.services.storageDelete($event).toPromise();
      if(doneDelete.status == 204){
        let index = this.storageList.findIndex(x => x.id == $event);
        this.storageList.splice(index, 1);
        this.hideLoader();
        this._snackBar.open(this.deleteSuccess, '', {
          duration: 4000,
          panelClass: 'toast-success'
        }); 
      }
      this.closeCreate();
    }else{
      this.closeCreate();
      this.hideLoader();
    }    
  }

  closeCreate(){
    this.isCreate = false;
    this.typestorage = '';
    this.namestorage = '';
  }

}
