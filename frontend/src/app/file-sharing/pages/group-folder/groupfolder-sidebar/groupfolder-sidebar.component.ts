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

@Component({
  selector: 'app-groupfolder-sidebar',
  templateUrl: './groupfolder-sidebar.component.html',
  styleUrls: ['./groupfolder-sidebar.component.scss']
})
export class GroupfolderSidebarComponent implements OnInit {
  util = new Utilities();
  @Input() dataSidebar: any[];
  @Input() permissions: any;
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
  addDone: boolean = true;
  openFromSignedDocument: boolean;
  signaturesData: any;
  badgeSignValue: number = 0;
  isLoadingVerify = false;
  signatureVerifyTooltipLabel: string;
  isVpecInstalled: boolean = this._const.isVpecInstalled;
  _sidebarServices: Subscription;
  globalsVar: any;
  isTim: boolean = false;

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
  deletedialogString : string = this.dict.getDictionary('delete_dialog_file_definitively');
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
  deletedialogMultiString : string = this.dict.getDictionary('delete_dialog_files');
  deletedialogStringDefinitively : string = this.dict.getDictionary('delete_dialog_file_definitively');
  deletedialogMultiStringDefinitively : string = this.dict.getDictionary('delete_dialog_files_definitively');
  deletedialogStringTim : string = this.dict.getDictionary('Tim_delete_file_GF');
  deletedialogMultiStringTim : string = this.dict.getDictionary('Tim_delete_files_GF');

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
  
  constructor(
    private SidebarService : SidebarService,
    private fsService: FileSharingService,
    private SidebarTableService: SidebarTableService,
    private router: Router,
    private searchbarService: SearchbarService,
    private dialog: MatDialog,
    private _const: GlobalVariable,
    private logoService: LogoService,
    private LabelService: LabelService,
    private _snackBar: MatSnackBar,
    private dataSharingService: DataSharingService,
    private digitalSigtnatureService: DigitalSignatureService,
    private route: ActivatedRoute,
    private digitalSignatureService: DigitalSignatureService,
    private _deleteservice: DeleteServiceAllfiles,
  ) {
    this.globalsVar = globals;
   }

  ngOnInit() {
    this.openFromSignedDocument = this.route.component === SignedDocumentsFolderComponent;

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this._sidebarServices = this.SidebarService.change.subscribe(data => {
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
      if(data.tag.length==0 && !waitService.Data.includes(null)){
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
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    // CASE OF CLICK ON TABLE SHARE ICON
    if (data.info !== undefined && data.info && data.tabToOpen === 'share') {
      this.isEmpty = false;
      this.tableClick = true;
      this.info = data.info;
      this.name = data.info.name + data.info.extension;
      this.weight = data.info.weight;
      this.date = data.info.dateReal;
      this.previewData = data.info.preview;
      this.isFavorite = data.info.favorite;
      this.isP7M = (data.info.extension == '.p7m')? true : false;
      this.coded = data.coded;
      this.image = data.info.image;
      this.filefolderType();
      // Select the tab to open
      this.tabSelectedIndex = 1;
      this.encipher = (data.info.file)? this.dict.getDictionary('encipher_file') : this.dict.getDictionary('encipher_folder');
      this.decipher = (data.info.file)? this.dict.getDictionary('decipher_file') : this.dict.getDictionary('decipher_folder');
      this.isEncipher = data.coded;
      this.datahasfolder = (data.info.file)? true : false;

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
      
      this.isMultiselect = (this.multiselect.length>0)? true:false;
      this.nameMultiselect = this.getElementsNumberType();
      this.multiselect.sort((a, b) => (a.name < b.name) ? 1 : -1);
      this.multiselect.sort((a, b) => (b.file < a.file) ? 1 : -1);
    }else{
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

  /** FILEFOLDER DELETE
   * Send array of elements to table
   **/
  filefolderDelete() {
    let elements = (this.multiselect.length>0)? this.multiselect : [this.info];
    this._deleteservice.toggle(elements, 'delete', '', '');
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
  }

  /** FILE/FOLDER GET TYPE **/
  filefolderType(){
    if(this.info.file){
      this.getTypeList = (this.info.type=='video')? 3 : 2;
    }else{
      this.getTypeList = 1;
    }
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
    //event.stopPropagation();
    // Remove labelId from array dataSidebar
    this.dataSidebar = this.dataSidebar.filter( value => value.id !== labelId);
    // Pass the label to the header searchbar
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
      for(var b in this.listAddLabel){
        this.notfiletag.push(this.listAddLabel[b].name)
      }

      for(var i in this.filetag){
        let index = this.notfiletag.indexOf(this.filetag[i]);
        if(index >= 0){
          this.notfiletag.splice(index, 1);
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
      for(var i in this.listAddLabel){
        if(this.listAddLabel[i].name == value){
          id = this.listAddLabel[i].id;
          break;
        }
      }
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
        this.fsService.addNewTag(body).subscribe((result: any) => {
          this.fsService.getListLabels().subscribe((result: any) => {
            let response = this.util.getLabelsList(result.body.multistatus.response);
            for(var i in response){
              if(response[i].name == value){
                this.LabelService.toggle(response[i].id, value);
                id = response[i].id;
                this.filetag.push(value);
                this.listAddLabel.push(response[i]);
                break;
              }
            }
  
            body = {userVisible: true, userAssignable: true, canAssign: true, name: value, id: id}
            this.fsService.addTagFile(id, fileid, body).subscribe((result: any) => {
              this.notfiletag.splice(this.notfiletag.indexOf(value),1);
              this.addDone = true;
              this.toggleLabelInput();
            });
          });
        });
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
    this._deleteservice.toggle(this.info.id, 'extract', '', '');
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
    if(waitService.Dto.encrypted) this.isEncipher = true;
    this.showMessage(this.decryptSuccess, 'success');
    this._deleteservice.toggle(this.info.id, 'crypt', '', '');
    this.closeSideBar();
  }

  /** OPEN DIALOG ON DELETE FILE/FOLDER **/
  openDialogDelete(): void {
    if(this.isTim){
      const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
        width: 'fit-content',
        height: 'fit-content',
        data: {string: this.deletedialogStringDefinitively, secondDialog:false}
      });
      dialogRef.afterClosed().subscribe(async result => {
        const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
          width: 'fit-content',
          height: 'fit-content',
          data: {string: this.deletedialogStringTim, secondDialog:true}
        });
        dialogRef.afterClosed().subscribe(async resultTim => {
          if(resultTim) {
            this.filefolderDelete();
          }
        });
      });
    } else {
      const dialogRef = this.dialog.open(DialogDeleteFileComponent, {
        width: 'fit-content',
        height: 'fit-content',
        data: {string: this.deletedialogString}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result) this.filefolderDelete();
      });
    }
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
  
          if(this.multiselect.length>0){
            this.SidebarTableService.toggle(null, this.multiselect, 'copy', others);
          }else{
            this.SidebarTableService.toggle(this.info.id, this.info, 'copy', others);
          }
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

}
