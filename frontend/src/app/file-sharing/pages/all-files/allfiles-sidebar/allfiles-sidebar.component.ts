import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SidebarService, SidebarTableService, LabelService } from 'src/app/file-sharing/services/sidebar.service';
import { Dictionary } from 'src/app/file-sharing/dictionary/dictionary';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Utilities } from 'src/app/file-sharing/utilities';
import {FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { SearchbarService } from 'src/app/app-services/searchbar.service';
import { DialogDeleteFileComponent } from 'src/app/file-sharing/components/dialogs/delete-file/delete-file.component';
import { DialogMoveCopyFileComponent } from 'src/app/file-sharing/components/dialogs/copy-file/copy-file.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { GlobalVariable } from 'src/app/globalviarables';
import { PasswordDialogComponent } from 'src/app/file-sharing/components/dialogs/password-dialog/password-dialog.component';
import { SignDialogComponent } from 'src/app/file-sharing/components/dialogs/sign-dialog/sign-dialog.component'
import { LogoService } from 'src/app/app-services/logo.service';
import { element } from 'protractor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { DigitalSignatureService } from 'src/app/file-sharing/components/digital-signature/digital-signature.service';
import { CanSignResponse } from 'src/app/file-sharing/model/CanSignResponse';
import { SignedDocumentsFolderComponent } from 'src/app/file-sharing/pages/signed-documents-folder/signed-documents-folder.component';
import { SignatureVerifyRequest } from 'src/app/file-sharing/model/SignatureVerifyRequest';
import { DeleteServiceAllfiles } from 'src/app/file-sharing/services/sidebar.service';
import { globals } from 'src/config/globals';
import { ShareService } from 'src/app/file-sharing/services/share.service';
import { AuthenticationService } from 'src/app/app-shared/authentication.service';
import { CurrentUser } from 'src/app/app-model/common/user';
import { ExpirationComponent } from 'src/app/expiration/component/expiration.component';
import { LanguageService } from 'src/app/app-services/language.service';
import { ExpirationMode } from 'src/app/expiration/model/expiration-mode';
import { ExpirationInputData } from 'src/app/expiration/model/expiration-input-data';
import { ComponentMode } from 'src/app/expiration/model/component-mode';

@Component({
  selector: 'app-allfiles-sidebar',
  templateUrl: './allfiles-sidebar.component.html',
  styleUrls: ['./allfiles-sidebar.component.scss']
})
export class AllfilesSidebarComponent implements OnInit, OnDestroy {
  util = new Utilities();
  @Input() dataSidebar: any[];
  info = null;
  name = null;
  weight = null;
  date = null;
  previewData = false;
  isFavorite: boolean;
  isP7M: boolean;
  coded: boolean;
  image: string;
  dict = new Dictionary();
  readonly: boolean = false;
  isEmpty: boolean = true;
  tableClick: boolean = false;
  getTypeList = 0;
  //MULTISELECT
  multiselect = [];
  nameMultiselect = '';
  isMultiselect = false;
  isEncipher: boolean;
  datahasfolder: boolean;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  showlabelinput: boolean = false;
  filetag = [];       //list tag on this file
  listAddLabel = [];  //list all tag
  notfiletag = [];    //list tag not on file
  tabSelectedIndex = 0;
  infohome: string;
  tag: boolean;
  isAttachment: boolean;
  addDone: boolean = true;
  openFromSignedDocument: boolean;
  signaturesData: any;
  badgeSignValue: number = 0;
  isLoadingVerify = false;
  signatureVerifyTooltipLabel: string;
  isVpecInstalled: boolean = this._const.isVpecInstalled;
  _sidebarServices: Subscription;
  globalsVar: any;
  share: boolean = false;
  user = sessionStorage.getItem('user');
  FolderZero: boolean;
  isOwner: boolean;
  isTim: boolean;
  hasDeletePermission: boolean = false;
  currentUser: CurrentUser;
  showDownloadButton: boolean = false;
  showExpirationPlugin: boolean = false;
  notCustom: boolean = false;
  notShare: boolean = true;
  notPec: boolean = false;
  page: string = 'all-files';

  // DICTIONARY VARIABLES
  rename          : string = this.dict.getDictionary('rename');
  movecopy        : string = this.dict.getDictionary('movecopy');
  addFavorites    : string = this.dict.getDictionary('add_favorites');
  removeFavorites : string = this.dict.getDictionary('remove_favorites');
  download        : string = this.dict.getDictionary('download');
  mail            : string = this.dict.getDictionary('send_by_mail');
  delete          : string = this.dict.getDictionary('delete');
  text            : string = this.dict.getDictionary('info_file_folder');
  deleteAll       : string = this.dict.getDictionary('deleteAll');
  restore         : string = this.dict.getDictionary('restore');
  labels          : string = this.dict.getDictionary('labels');
  deletedialogString : string = this.dict.getDictionary('delete_dialog_file');
  deletedialogMultiString : string = this.dict.getDictionary('delete_dialog_files');
  deletedialogStringDefinitively : string = this.dict.getDictionary('delete_dialog_file_definitively');
  deletedialogMultiStringDefinitively : string = this.dict.getDictionary('delete_dialog_files_definitively');
  deletedialogStringTim : string = this.dict.getDictionary('Tim_delete_file');
  deletedialogMultiStringTim : string = this.dict.getDictionary('Tim_delete_files');
  encipher        : string;
  decipher        : string;
  sign: string = this.dict.getDictionary('sign_file');
  extractSigned: string = this.dict.getDictionary('extractSigned');
  signed_file: string = this.dict.getDictionary('signed_file');
  deleted_file: string = this.dict.getDictionary('deleted_file');
  deleted_files: string = this.dict.getDictionary('deleted_files_success');
  restored_files: string = this.dict.getDictionary('restored_files');
  moveSuccess: string = this.dict.getDictionary('move_done');
  dictSignatureSingle = this.dict.getDictionary('signature_single');
  dictSignatureMultiple = this.dict.getDictionary('signature_multiple');
  fileNotFound: string = this.dict.getDictionary('file_not_found');
  decryptSuccess: string = this.dict.getDictionary('done_decrypt');
  encryptSuccess: string = this.dict.getDictionary('done_encrypt');
  existLabel: string = this.dict.getDictionary('existLabel');

   //tooltip
   dictShared: string = this.dict.getDictionary('shared');
   dictAddLabel: string = this.dict.getDictionary('add_label');
   dictActions: string = this.dict.getDictionary('actions');
   dictActivities: string = this.dict.getDictionary('activities');
   dictVersions: string = this.dict.getDictionary('versions');

  //obj list events
  arrayEvents = [
    {name: this.dict.getDictionary('actions'), image: 'list'},
    {name: this.dict.getDictionary('activities'), image: 'flash_on'},
    {name: this.dict.getDictionary('sharing'), image: 'share'},
    {name: this.dict.getDictionary('versions'), image: 'history'}
  ]
  data: any;
  checkShare: boolean = false;
  selectedFile: any
  
  constructor(
    private SidebarService : SidebarService,
    private fsService: FileSharingService,
    private SidebarTableService: SidebarTableService,
    private router: Router,
    private searchbarService: SearchbarService,
    private dialog: MatDialog,
    public langService: LanguageService,
    private _const: GlobalVariable,
    private logoService: LogoService,
    private LabelService: LabelService,
    private _snackBar: MatSnackBar,
    private dataSharingService: DataSharingService,
    private digitalSigtnatureService: DigitalSignatureService,
    private route: ActivatedRoute,
    private digitalSignatureService: DigitalSignatureService,
    private _deleteservice: DeleteServiceAllfiles,
    private shareService: ShareService,
    private authService: AuthenticationService
  ) { 
    this.globalsVar = globals;
  }

  ngOnInit() {
    this.currentUser = this.authService.currentUser;
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    if(this.globalsVar.customCustomer.toLowerCase() == 'notariato'){
      this.notCustom = true;
      this.notShare = (sessionStorage.getItem('groups').includes('notbox-firma'))? true : false;
      this.notPec = (sessionStorage.getItem('groups').includes('notbox-pec'))? true : false;
    }
    this.openFromSignedDocument = this.route.component === SignedDocumentsFolderComponent;
    this.showExpirationPlugin = this.globalsVar.enableSchedule;

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

    this._sidebarServices = this.SidebarService.change.subscribe(data => {
      if(data)
        this.selectedFile = data
      if(data.info){
        this.checkShare = (data.tabToOpen  == 'share') ? true : false ;
        data = data.info;
      }else this.checkShare = false;
      this.openFromSignedDocument = (this.multiselect.length==0 && ('tag' in data) && data.tag.tag && data.tag.tag.includes('SignedFile'))? true : false;
      this.setSidebarData(data);
      if (this.openFromSignedDocument || (!this.openFromSignedDocument && (data.extension=='.p7m' || data.extension=='.pdf'))) {
        if(!this.openFromSignedDocument) this.openFromSignedDocument = true;
        this.loadVerifySignatureData(data);
      }
    });
  }

  showMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: ('toast-' + type)
    });
  }

  async loadVerifySignatureData(data: any) {
    this.isLoadingVerify = true;
    const fileId = data.id;
    const verifyRequest = new SignatureVerifyRequest();
    verifyRequest.AccountId = -1;
    verifyRequest.ServiceId = -1;
    verifyRequest.Params = {};
    verifyRequest.Document = Number(fileId);

    let waitService = await this.digitalSignatureService.verifyDocumentSignature(verifyRequest).toPromise();
    if (waitService && waitService.Performed && waitService.Data && waitService.Data.length > 0) {
      if(data.tag==0 && !waitService.Data.includes(null)){
        let tagServices = await this.fsService.tagSignedFiles(parseInt(data.id)).toPromise();
        if(tagServices.Perfomed){
          data.classimage = 'p7m';
          data.tag.tag = ['SignedFile'];
        } 
      }

      this.badgeSignValue = (waitService.Data.includes(null))? 0 : waitService.Data.length;       
      this.signaturesData = waitService.Data;

      if (this.badgeSignValue === 1) {
        this.signatureVerifyTooltipLabel = this.dictSignatureSingle;
      } else {
        this.signatureVerifyTooltipLabel = this.dictSignatureMultiple;
      }
    }
    this.isLoadingVerify = false;
  }

  setSidebarData(data: any) {
    this.FolderZero = (data.path == "") ? true : false;
    this.isOwner = (data.owner == this.user) ? true : false;
    // Set download button if not is Tim or if is Tim and 
    // data is a folder and the current user is the folder 0 owner or
    // data is a file and not is readonly
    this.showDownloadButton = (!this.isTim || (this.isTim && ((!data.file && this.isOwner) || (data.file && !data.readonly)))) ? true : false;
    // CASE OF CLICK ON TABLE SHARE ICON
    if (data !== undefined && data && this.checkShare) {
      this.checkDeletePermission(data);
      this.isEmpty = false;
      this.tableClick = true;
      this.info = data;
      this.name = data.name + data.extension;
      this.weight = data.weight;
      this.date = data.dateReal;
      this.previewData = data.preview;
      this.isFavorite = data.favorite;
      this.isP7M = (data.extension == '.p7m')? true : false;
      this.coded = data.coded;
      this.image = data.image;
      this.filefolderType();
      // Select the tab to open
      this.tabSelectedIndex = 1;
      this.encipher = (data.file)? this.dict.getDictionary('encipher_file') : this.dict.getDictionary('encipher_folder');
      this.decipher = (data.file)? this.dict.getDictionary('decipher_file') : this.dict.getDictionary('decipher_folder');
      this.isEncipher = data.coded;
      this.datahasfolder = (data.file)? true : false;
      this.share = data.share;
    }else if(Array.isArray(data)){ // CASE OF SELECT ALL CHECKBOX
      this.closeOldSidebar();
      if(data.length>0){
        for(var i in data){
          if(this.multiselect.filter(x => x.id == data[i].id).length==0)
            this.multiselect.push(data[i]);
        }
      }else{
        this.multiselect = []
      }

      this.datahasfolder = true;
      for(let i=0; i<this.multiselect.length; i++){
        if(this.multiselect[i].file == false){
          this.datahasfolder = false;
          break;
        }
      }
      
      this.coded = false;
      for(let i=0; i<this.multiselect.length; i++){
        if(this.multiselect[i].coded){
          this.coded = true;
          break;
        }
      }

      this.share = false;
      for(let i=0; i<this.multiselect.length; i++){
        if(this.multiselect[i].share){
          this.share = true;
          break;
        }
      }

      this.isMultiselect = (this.multiselect.length>0)? true:false;
      this.nameMultiselect = this.getElementsNumberType();
      this.multiselect.sort((a, b) => (a.name < b.name) ? 1 : -1);
      this.multiselect.sort((a, b) => (b.file < a.file) ? 1 : -1);
    } else if(data.isRow || (!data.isRow && this.multiselect.length>0)) { // CASE MULTISELECTION
      this.closeOldSidebar();
      if(data.isRow){
        this.multiselect.push(data);
      } else{
        for(let i=0; i<this.multiselect.length; i++){
          if(this.multiselect[i].id == data.id){
            this.multiselect.splice(i, 1);
            break;
          }
        }
      }

      this.datahasfolder = true;
      for(let i=0; i<this.multiselect.length; i++){
        if(this.multiselect[i].file == false){
          this.datahasfolder = false;
          break;
        }
      }

      this.coded = false;
      for(let i=0; i<this.multiselect.length; i++){
        if(this.multiselect[i].coded){
          this.coded = true;
          break;
        }
      }

      this.share = false;
      for(let i=0; i<this.multiselect.length; i++){
        if(this.multiselect[i].share){
          this.share = true;
          break;
        }
      }
      
      this.isMultiselect = (this.multiselect.length>0)? true:false;
      this.nameMultiselect = this.getElementsNumberType();
      this.multiselect.sort((a, b) => (a.name < b.name) ? 1 : -1);
      this.multiselect.sort((a, b) => (b.file < a.file) ? 1 : -1);
    }else{
      this.checkDeletePermission(data);
      this.readonly = data.readonly;
      this.isEmpty = false;
      this.tableClick = true;
      this.info = data;
      this.name = data.name + data.extension;
      this.weight = data.weight;
      this.date = data.dateReal;
      this.previewData = data.preview;
      this.isFavorite = data.favorite;
      this.isP7M = (data.extension == '.p7m')? true : false;
      this.image = data.image;
      this.coded = data.coded;
      this.filetag = [];
      this.listAddLabel = [];
      this.notfiletag = [];
      this.showlabelinput = false;
      this.infohome = this.getPathFather();
      this.filefolderType();
      this.getListLabels();
      // Select the tab to open
      this.tabSelectedIndex = 0;
      var checkFile = ('file' in data)? data.file : data.isfile; 
      this.encipher = (checkFile)? this.dict.getDictionary('encipher_file') : this.dict.getDictionary('encipher_folder');
      this.decipher = (checkFile)? this.dict.getDictionary('decipher_file') : this.dict.getDictionary('decipher_folder');
      this.isEncipher = data.coded;
      this.datahasfolder = (data.file)? true : false;
      this.isAttachment = ('isAttachment' in data && data.isAttachment)? true : false;
      this.share = data.share;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.notfiletag.filter(option => option.toLowerCase().includes(filterValue));
  }

  /** FILE/FOLDER DOWNLOAD **/
  filefolderDownload() {
    if(this.multiselect.length>1){ // multiple download with selected row
      let path, filename, name = [];
      for(var i in this.multiselect){
        filename = (('realname' in this.multiselect[i])? this.multiselect[i].realname : this.multiselect[i].name) + this.multiselect[i].extension;
        name.push(filename);
        path = (!path || path!= this.multiselect[i].path)? this.multiselect[i].path : path;
      }
      this.fsService.download(path, JSON.stringify(name), '', 'download');
    }else if(this.multiselect.length==1){
      let path, filename;
      filename = ('realname' in this.multiselect[0])? this.multiselect[0].realname : this.multiselect[0].name;
      path = (this.multiselect[0].path)? this.multiselect[0].path : '/';
      
      let uri = path + filename + (('realname' in this.multiselect[0])? this.multiselect[0].extension : '');
      let filenamesend = path + filename;
      this.fsService.download(uri, filenamesend , this.multiselect[0].extension, filename);
    }else{ //single file/folder download
      let filename = ('realname' in this.info && this.info.realname.length>0)? this.info.realname : this.info.name;
      let path = ('homepath' in this.info)? this.info.homepath : this.info.path;

      let uri = path + filename + (('realname' in this.info)? this.info.extension : '');
      let filenamesend = path + (('realname' in this.info && this.info.realname.length>0)? this.info.realname : this.info.name);
      this.fsService.download(uri, filenamesend , this.info.extension, this.info.name);
    }
  }

  checkDeletePermission(data: any): void {
    const folderPermissions = ['31', '29', '27', '25', '15', '13', '11', '9'];
    const filePermissions = ['19', '3'];
    if (data && !data.file) { // is folder
      this.hasDeletePermission = folderPermissions.includes(data.permission) ? true : false;
    } else { // is file
      if (this.isTim){
        this.checkPermissionsOnFatherFolder(data, folderPermissions);
      } else {
        this.hasDeletePermission = filePermissions.includes(data.permission) ? true : false;
      }
    }
  }

  async checkPermissionsOnFatherFolder(data: any, folderPermissions: string[]) {
    const body = { nodeId: data.id, userId: this.currentUser.id };
    let userPermissionFather = await this.shareService.getUserPermission(body).toPromise();
    if (userPermissionFather.Performed){
      const userPermissionOnFatherFolder = (userPermissionFather.Permissions) ? userPermissionFather.Permissions.toString() : '31';
      this.hasDeletePermission = folderPermissions.includes(userPermissionOnFatherFolder) ? true : false;
    } else {
      this._snackBar.open(this.dict.getDictionary('error_system'), '', {
        duration: 4000,
        panelClass: ('toast-error')
      });
      return;
    } 
  }

  /** FILEFOLDER DELETE
   * Send array of elements to table
   **/
  filefolderDelete() {
    let elements = (this.multiselect.length>0)? this.multiselect : [this.info];
    this._deleteservice.toggle(elements, 'delete', '', '');    
    this.closeSideBar();
  }

  /** FILE/FOLDER RENAME 
   * Send data to table
   **/
  filefolderRename(){
    this._deleteservice.toggle(this.info.id, 'rename', '', '');
  }

  /** FILE/FOLDER FAVORITE 
   * Send data to table
   **/
  filefolderFavorite(){
    this._deleteservice.toggle(this.info.id, 'favorite', '', '');
    this.isFavorite = !this.isFavorite;
  }

  /** FILE/FOLDER CLOSE **/
  closeSideBar(){
    this.info = null, this.name = null;
    this.date = null, this.weight = null;
    this.previewData = false, this.isEmpty = true;
    this.tableClick = false;
    this.filetag = [], this.listAddLabel = [];
    this.notfiletag = [], this.tabSelectedIndex = 0;

    if(this.multiselect.length>0){
      for(var i in this.multiselect){
        this._deleteservice.toggle(this.multiselect[i].id, 'row', '', '');
      }
      this.multiselect = [], this.isMultiselect = false, this.nameMultiselect = '';
    }
  }

  closeOldSidebar(){
    this.info = null, this.name = null;
    this.date = null, this.weight = null;
    this.previewData = false, this.isEmpty = true;
    this.tableClick = false;
    this.filetag = [], this.listAddLabel = [];
    this.notfiletag = [], this.tabSelectedIndex = 0;
    this.share = false;
  }

  /** FILE/FOLDER GET TYPE **/
  filefolderType(){
    if(this.info.file) this.getTypeList = (this.info.type=='video')? 3 : 2;
    else this.getTypeList = 1;
  }

  /** GET ELEMENTS NUMBER TYPE
   * Get the complete string for multisected files on sidebar
   *  **/
  getElementsNumberType(){
    let folders=0, files=0;
    for(var i in this.multiselect){
      if(!this.multiselect[i].file) folders = folders + 1;
      else files = files + 1;
    }

    let folderString = (folders>1)? (folders +' '+ this.dict.getDictionary('folders')): ((folders>0)? (folders +' '+ this.dict.getDictionary('folder')) : '');
    let fileString = (files>1)? (files +' '+ this.dict.getDictionary('files')): ((files>0)? (files +' '+ this.dict.getDictionary('file')) : '');
    let selectedString = (folders+files>1)? this.dict.getDictionary('selected-plural') : this.dict.getDictionary('selected-singular');
    let andString = (folderString && fileString)? (' '+this.dict.getDictionary('and')+' ') : '';
    let string = folderString + andString + fileString +' '+ selectedString;
    return string;
  }

  changeSidebarTab(value){
    this.tabSelectedIndex = value;
  }

  addLabelSearch(labelId) {
    this.dataSidebar = this.dataSidebar.filter( value => value.id !== labelId);
    this.searchbarService.onLabelsSelection(labelId);
  }

  /**GET LIST LABELS
   * Get list of all tags from BE
   * Then get all the tags on this single file
   **/
  async getListLabels(){
    let waitService = await this.fsService.getListLabels().toPromise();
    if (waitService && waitService.body && waitService.body.multistatus.response) {
      let response = waitService.body.multistatus.response;
      this.listAddLabel = this.util.getLabelsList(response);
      this.listAddLabel.sort((a, b) => (a.name < b.name) ? 1 : -1);
    }
    this.getFileTags();
  }

  /** TOGGLE LABEL INPUT
   * Hide/show tags list input 
   **/
  toggleLabelInput(){
    this.showlabelinput = !this.showlabelinput;
  }

  /** GET FILE TAG
   * Get all tags used of file
   * Get activity list and use it to get all the tags
   * Add tags on file to "filetag" and the others on "notfiletag"
   **/
  async getFileTags(){
    let waitService = await this.fsService.getTagsFile(this.info.id).toPromise();
    if(waitService.status == 200){
      this.filetag = this.util.getFileLabels(waitService.body.multistatus.response);

      this.notfiletag = [];
      
      if(this.listAddLabel.length>0){
        for(var b in this.listAddLabel){
          this.notfiletag.push(this.listAddLabel[b].name)
        }
      }      

      if(this.filetag.length>0){
        for(var i in this.filetag){
          let index = this.notfiletag.indexOf(this.filetag[i]);
          if(index >= 0){
            this.notfiletag.splice(index, 1);
          }
        }
      }      
    }
  }

  /** ADD TAG TO FILE
   * @param value name of the tag from click event
   * Add tag to file in 2 methods: 
   * Add existing tag: in that case we just add the tag on the file
   * Add new tag: in that case with create the new tag; list all the tags to get the id and then add it to the file
   **/
  async addTagToFile(value){
    if(value){
      this.addDone = false;
      let id;

      let findId = this.listAddLabel.filter(x=> x.name == value);
      if(findId.length>0) id = findId[0].id;

      let body;
      let fileid = this.info.id;
  
      if(id){
        body = {userVisible: true, userAssignable: true, canAssign: true, name: value, id: id}
        let waitService = await this.fsService.addTagFile(id, fileid, body).toPromise();
        if(waitService.status == 409){
          this.showMessage(this.existLabel, 'error');
          this.addDone = true;
          this.toggleLabelInput();
        }else if(waitService.status == 200){
          this.filetag.push(value);
          this.notfiletag.splice(this.notfiletag.indexOf(value),1);
          this.getListLabels();
          this.addDone = true;
          this.toggleLabelInput();
        }
      }else{
        body = {userVisible: true, userAssignable: true, canAssign: true, name: value}
        let addnewtagService = await this.fsService.addNewTag(body).toPromise();
        if(addnewtagService.status == 200){
          let getlistService = await this.fsService.getListLabels().toPromise();
          if(getlistService.status == 200){
            let response = this.util.getLabelsList(getlistService.body.multistatus.response);
            let getFromResponse = response.filter(x=> x.name == value);
            if(getFromResponse.length>0){
              this.LabelService.toggle(getFromResponse[0].id, value);
              id = getFromResponse[0].id;
              this.filetag.push(value);
              this.listAddLabel.push(getFromResponse[0]);
            } 
  
            body = {userVisible: true, userAssignable: true, canAssign: true, name: value, id: id}
            let addtagfileService = await this.fsService.addTagFile(id, fileid, body).toPromise();
            if(addtagfileService.status == 200){
              this.notfiletag.splice(this.notfiletag.indexOf(value),1);
              this.addDone = true;
              this.toggleLabelInput();
            }
          }
        }          
      }
    } else this.showMessage(this.dict.getDictionary('tagNameError'), 'error');
  }

  /** REMOVE TAG FROM FILE
   * @param element name of the element to remove
   * Remove tag from a file  
   **/
  async removeTagFromFile(element: string){
    let id;
    let fileid = this.info.id;
    for(var i in this.listAddLabel){
      if(this.listAddLabel[i].name == element){
        id = this.listAddLabel[i].id;
        break;
      }
    }

    let waitService = await this.fsService.removeTagFromFile(fileid, id).toPromise();
    if(waitService.status == 204){
      if(this.filetag.includes(element))
      this.filetag.splice(this.filetag.indexOf(element),1);
    }
  }

  /** OPEN MAIL WITH ATTACH **/
  openMailAttach(){
    this._const.sendmail = [];

    if(this.multiselect.length>0){
      for(var i in this.multiselect){
        this._const.sendmail.push(this.multiselect[i]);
      }
    }
    else this._const.sendmail.push(this.info);

    this._const.app = 'vShare';
    
    this.router.navigateByUrl('mail');
    this.logoService.onLauncherClick('vPEC');
  }

  /** FILE SIGN
   * FAKE
   * 
   **/
  fileSign(){
    const dialogRef = this.dialog.open(SignDialogComponent, {
      width: '370px',
      height: '270px',
      data: {},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.showMessage(this.signed_file, 'success');
    });
  }

  openDigitalSignature(info: any) {
    this.digitalSigtnatureService.getCanSign().subscribe((response: CanSignResponse) => {
      if (response && response.Performed && response.CanSign) {
        this.dataSharingService.setFileInfo(info);
        this.dataSharingService.setSavePath('/' + info.path);
        this.router.navigateByUrl('filesharing/digital-signature/set-signature');
      }
    });
  }

  extractSignatureFile(info: any){
    this._deleteservice.toggle(this.info, 'extract', '', '');
  }

  /** GET PATH FATHER
   * Get the last folder path of a file
   **/
  getPathFather(){
    if(!this.info.path || this.info.path=='/') return this.dict.getDictionary('all-files');
    else{
      let array = this.info.path.split('/');
      let home = (array[array.length-1].length==0)? array[array.length-2] : array[array.length-1];
      return home;
    }        
  }
  

   //----------------------------------------//
  //--------------- DIALOGS ----------------//
 //----------------------------------------//

  /** OPEN DIALOG ON CRYPT FILE/FOLDER **/
  openDialogCrypt(file, check): void{
    const dialogRef = this.dialog.open(PasswordDialogComponent, {
      width: '370px',
      height: '270px',
      data: {check: check, extension: file.extension, weight: file.fileWeight},
    });
    dialogRef.afterClosed().subscribe( async password => {
      if(password){
        let id = parseInt(this.info.id);
        file.isCoding = true;
        let waitService;

        if(check){  
          if(file.file) waitService = await this.fsService.encryptFile(id).toPromise();
          else waitService = await this.fsService.encryptFolder(id).toPromise();
          this.responseEncrypt(file, waitService);
        }else{
          if(file.file) waitService = await this.fsService.decryptFile(id).toPromise();
          else waitService = await this.fsService.decryptFolder(id).toPromise();
          this.responseDecrypt(file, waitService);
        }
      }      
    });
  }

  /** RESPONSE ENCRYPT
   * Same response for encrypt file/folder 
   * @param file (boolean) check if is file or folder
   * @param waitService (any) response service
   **/
  responseEncrypt(file, waitService){
    file.isCoding = false;
    file.id = waitService.Dto.encryptedContainerId;
    if(waitService.Dto.encrypted) this.isEncipher = true;
    this.showMessage(this.decryptSuccess, 'success');
    this._deleteservice.toggle(this.info.id, 'crypt', '', waitService.Dto.encryptedContainerId);
    this.closeSideBar();
    this.fsService.setInfoLoad(true);
  }

  /** RESPONSE DECRYPT
   * Same response for encrypt file/folder 
   * @param file (boolean) check if is file or folder
   * @param waitService (any) response service
   **/
   responseDecrypt(file, waitService){
    file.isCoding = false;
    file.id = waitService.Dto.decryptedContainerId;
    if(waitService.Dto.encrypted) this.isEncipher = false;
    this.showMessage(this.encryptSuccess, 'success');
    this._deleteservice.toggle(this.info.id, 'decrypt', '', waitService.Dto.decryptedContainerId);
    this.closeSideBar();
    this.fsService.setInfoLoad(true);
  }

  /** OPEN DIALOG ON DELETE FILE/FOLDER **/
  openDialogDelete(isMultiselect): void {  
    if (this.isTim && !this.isOwner){
      var string = (this.multiselect.length > 1) ? this.deletedialogMultiStringDefinitively : this.deletedialogStringDefinitively;
    } else {
      var string = (this.multiselect.length > 1) ? this.deletedialogMultiString : this.deletedialogString;
    }
    const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
      width: 'fit-content',
      height: 'fit-content',
      data: {string: string, secondDialog:false}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(this.isTim && !this.isOwner && result){
        var string = (this.multiselect.length > 1) ? this.deletedialogMultiStringTim : this.deletedialogStringTim;
        const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
          width: '480px',
          height: 'fit-content',
          data: {string: string, secondDialog:true}
        });
        dialogRef.afterClosed().subscribe(resultTim => {
          if(resultTim) this.filefolderDelete();
        });  
      } else if(result) {
        this.filefolderDelete();
      }
    });
  }

  /** OPEN DIALOG ON COPY/MOVE FILE/FOLDER **/
  openDialogMoveCopy(): void {
    let data;
    if(this.info) data = {path: this.info.path, name: this.info.name, extension: this.info.extension};
    else {
      for(var a in this.multiselect){
        if(!data) data = [];
        data.push({path: this.multiselect[a].path, name: this.multiselect[a].name, extension: this.multiselect[a].extension});
      }
    }
    
    const dialogRef = this.dialog.open(DialogMoveCopyFileComponent, {
      width: '70%',
      height: '70%',
      data: {data:data, link: false},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.destination.length>0 && result.event.length>0){
        if(result.event=='m'){
          if(this.multiselect.length>0){
            this._deleteservice.toggle(this.multiselect, 'move', result.destination, '');
            this.closeSideBar();
          }else{
            this._deleteservice.toggle([this.info], 'move', result.destination, '');
            this.closeSideBar();           
          }
        }else{
          let others = {
            destination: result.destination,
          };
  
          if(this.multiselect.length>0) this.SidebarTableService.toggle(null, this.multiselect, 'copy', others);
          else this.SidebarTableService.toggle(this.info.id, this.info, 'copy', others);
        }            
      }
    });
  }

  //\\----------------------------------------//\\

  ngOnDestroy(){
    if(this._sidebarServices){
      this._sidebarServices.unsubscribe();
    }
  }

  openDialogAddExpiration(): void{
    if(this.selectedFile.reshare){
      
      let expInputData: ExpirationInputData = {
        mode:ExpirationMode.VSHARE,
        data: this.selectedFile,
        componentMode: ComponentMode.EDIT
      };  
      const dialogRef = this.dialog.open(ExpirationComponent, {
        width: '980px',
        height : 'auto',
        //data: {mode: 'newExpiration', file: this.selectedFile},
        data: expInputData
      });
      dialogRef.afterClosed().subscribe(result => {
        
      });  
    }else{

      this.showMessage(this.dict.getDictionary('noshare_permission'), 'error');
    }
    
  
  }
}
