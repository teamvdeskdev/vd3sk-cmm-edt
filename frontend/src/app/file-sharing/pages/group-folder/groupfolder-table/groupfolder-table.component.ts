import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Dictionary } from '../../../dictionary/dictionary';
import { Utilities, FileSharingData } from '../../../utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from '../../../services/file-sharing.service';
import { Router, RouterModule } from '@angular/router';
import { SidebarService, SidebarTableService } from '../../../services/sidebar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AudioVideoComponent } from '../../../components/dialogs/audio-video/audio-video.component';
import { DialogPdfComponent } from '../../../components/dialogs/dialog-pdf/dialog-pdf.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DuplicateFileComponent } from 'src/app/file-sharing/components/dialogs/duplicate-file/duplicate-file.component';
import { DataSharingService } from 'src/app/app-services/data-sharing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RenameFileComponent } from '../../../components/dialogs/rename-file/rename-file.component';
import { DeleteServiceAllfiles, CreateService } from 'src/app/file-sharing/services/sidebar.service';
import { TextEditorComponent } from 'src/app/file-sharing/components/dialogs/text-editor/text-editor.component';
import { GlobalVariable } from 'src/app/globalviarables';
import { Subscription } from 'rxjs';
import { ExtractSignedDocumentRequest } from '../../../model/ExtractSignatureDocuments';
import { DigitalSignatureService } from 'src/app/file-sharing/components/digital-signature/digital-signature.service';
import {HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType} from '@angular/common/http';
import { globals } from 'src/config/globals';
import { Dragdroputils } from 'src/app/file-sharing/services/dragdroputils';

@Component({
  selector: 'app-groupfolder-table',
  templateUrl: './groupfolder-table.component.html',
  styleUrls: ['./groupfolder-table.component.scss']
})
export class GroupfolderTableComponent implements OnInit, OnDestroy, OnChanges {

  /* @Input, @Output */
  @Input() noData;
  @Input() dataValue;
  @Input() pageFavorite: boolean;
  @Input() getpage: string;
  @Input() permissions: any;
  @Input() blockActions: boolean;
  @Output() reload: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  dict = new Dictionary();
  util = new Utilities();
  getAllContent: string;
  selectedid: number;
  copySuccess: string = this.dict.getDictionary('copy_done');
  isCrearable: boolean = false;
  isSharable: boolean = false;
  isDeletable: boolean = false;
  renameSuccess: string = this.dict.getDictionary('rename_success');
  isLoading: boolean = false;
  name = this.dict.getDictionary('name');
  fileweight = this.dict.getDictionary('size');
  lastupdate = this.dict.getDictionary('last_update');
  dictLabelShared = this.dict.getDictionary('label_shared');
  user = sessionStorage.getItem('user');
  deleted_file: string = this.dict.getDictionary('deleted_file');
  deleted_files: string = this.dict.getDictionary('deleted_files_success');
  moveSuccess: string = this.dict.getDictionary('move_done');
  movesSuccess: string = this.dict.getDictionary('moves_done');
  loadingData: string = this.dict.getDictionary('loadingdata');
  error_system: string = this.dict.getDictionary('error_system');
  otherServices: Subscription;
  createServices: Subscription;
  sidebarServices: Subscription;
  serviceUpload: Subscription;
  isUploading: boolean = false;
  percentDone: any = 0;
  uploadTotal: number = 0;
  arrayTotal: any = [];
  sortUpdate: boolean = false;
  isTim: boolean = false;
  globalsVar: any;

  static utilStatic = new Utilities();
  /* For upload file count - loading image*/
  static uploadCount = 1;
  componentUploadCount = 1;

  displayedColumns: string[];
  dataSource: MatTableDataSource<FileSharingData>;
  static dataSourceStatic;
  selection = new SelectionModel<FileSharingData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private SidebarService: SidebarService,
    private SidebarTableService: SidebarTableService,
    private dialog: MatDialog,
    private _spinner: NgxSpinnerService,
    private dataSharingService: DataSharingService,
    private _snackBar: MatSnackBar,
    private _deleteservice: DeleteServiceAllfiles,
    private _create: CreateService,
    private _global: GlobalVariable,
    private digitalSignatureService: DigitalSignatureService,
    private _dragdrop: Dragdroputils,
  ) {
    this.globalsVar = globals;
    this.sidebarServices = this.SidebarTableService.change.subscribe(data => {
      if (data.type == 'copy') {
        if (Array.isArray(data.info)) this.getCopyFile(data.info, data.others);
        else {
          let string = {
            path: (data.info.homepath)? data.info.homepath : data.info.path,
            name: (data.info.realname)? data.info.realname : data.info.name,
            exte: data.info.extension
          }
          this.getCopyFile(string, data.others);
        }
      }

    });

    this.createServices = this._create.changestatus.subscribe(data => {
      if(data.type == 'folder') this.createNewFolder(data);
      else if(data.type == 'doc' || data.type == 'exel' || data.type == 'power') this.createNewFileOO(data.name);
      else if(data.type == 'note') this.createNewFileTxt(data.name);
      else if(data.type == 'upload') this.uploadFile(data.data);
      else if(data.type == 'dragdrop') this.onDragDrop(data.data);
      else if(data.type == 'row') this.receiveIdToggleRow();
    });

    this.otherServices = this._deleteservice.deleteserviceallfiles.subscribe(data => {
      if(data.event == 'delete') this.receiveIdDelete(data.elements);
      else if(data.event == 'favorite') this.receiveIdToggleFavorite(data.elements);
      else if(data.event == 'rename') this.receiveIdRename(data.elements);
      else if(data.event == 'crypt') this.cryptFile(data.elements);
      else if(data.event == 'move') this.moveFile(data.elements, data.destinations);
    });    
  }

  ngOnInit() {
    this.isTim = (this.globalsVar.customCustomer.toLowerCase() == 'tim')? true : false;
    if(this.permissions){
      if(this.permissions.isCrearable) this.isCrearable = true;
      if(this.permissions.isSharable) this.isSharable = true;
      if(this.permissions.isDeletable) this.isDeletable = true;
    }
    if(this.isTim){
      if(this.blockActions) this.displayedColumns = ['id', 'image', 'name', 'dateFunc', 'weight'];
      else this.displayedColumns = ['select', 'id', 'image', 'name', 'dateFunc', 'weight', 'senddetails'];
    }else{
      if(this.isSharable) this.displayedColumns = ['select', 'id', 'image', 'name', 'share', 'dateFunc', 'weight', 'senddetails'];
      else if(this.blockActions) this.displayedColumns = ['id', 'image', 'name', 'dateFunc', 'weight'];
      else this.displayedColumns = ['select', 'id', 'image', 'name', 'dateFunc', 'weight', 'senddetails'];
    }    

    this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
    this.dataSource.data = this.dataValue;
    this.getAllContent = this.getContentString();
    this.focusRowFavorites();
  }

  showLoader(){
    this.isLoading = true;
    this._spinner.show();
  }

  hideLoader(){
    this._spinner.hide();
    this.isLoading = false;
  }

  showMessage(message: string, type: string){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: ('toast-' + type)
    });
  }

  orderValues(){
    this.dataValue.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    this.dataValue.sort((a, b) => (b.file > a.file) ? 1 : -1);
    this.dataValue.sort((a, b) => (a.favorite < b.favorite) ? 1 : -1);
    this._global.dataAllFiles = this.dataValue;
    this.getAllContent = this.getContentString();
  }

  focusRowFavorites() {
    const favoriteElement = this.dataSharingService.getFavoritesCardData();
    const sharedFileId = this.dataSharingService.getSharedFileId();

    if (favoriteElement) {
      if (!favoriteElement.file && !favoriteElement.extension) {
        this.openFolder(favoriteElement.path);
      } else {
        this.dataValue.forEach((row: any) => {
          if (row.id === favoriteElement.id) {
            row.isRow = true;
          }
        });
      }
    } else if (sharedFileId) {

      this.dataValue.forEach(row => {
        if (row.id === sharedFileId) {
          row.isRow = true;
        }
      });
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    let array = [];
    if (this.isAllSelected()) {
      this.dataSource.data.forEach(row => { row.isRow = false; });
      this.SidebarService.toggle(array, null, 'group-folder');
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => {
        if(!row.isRow) row.isRow = !row.isRow;
        array.push(row);
        this.selection.select(row);
      });
      this.SidebarService.toggle(array, null, 'group-folder');
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: FileSharingData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /** ON SELECT ROW
   * On select row send multiple data to sidebar
   *  Id is null on toggle (second value)
   **/
  onSelectRow($event, row) {
    this.clearRowAll();
    row.isRow = (this.selection.isSelected(row)) ? false : true;
    this.SidebarService.toggle(row, null, 'group-folder');
    return `${$event ? this.selection.toggle(row) : null}`;
  }

  /** CLEAR ROW ALL
   * Clear al row on changes check/no
   **/
  clearRowAll() {
    for (let i in this.dataValue) {
      if (this.dataValue[i].isRow) {
        this.dataValue[i].isRow = false;
        break;
      }
    }
  }

  /** SORT EVERYTHING
   * Sort table columns for type (name, size, date)
   * @param type : string
   **/
   sortEverything(type: string){
    if(this.sortUpdate){
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() > a.name.toLowerCase()) ? 1 : -1);
      else if(type=="date") this.dataValue.sort((a, b) => (b.lastUpdate > a.lastUpdate) ? 1 : -1);
      else if(type=="size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) > parseInt(a.fileWeight)) ? 1 : -1);
      this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }else{
      if(type=="name") this.dataValue.sort((a, b) => (b.name.toLowerCase() < a.name.toLowerCase()) ? 1 : -1);
      else if(type=="date") this.dataValue.sort((a, b) => (b.lastUpdate < a.lastUpdate) ? 1 : -1);
      else if(type=="size") this.dataValue.sort((a, b) => (parseInt(b.fileWeight) < parseInt(a.fileWeight)) ? 1 : -1);
      this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.sortUpdate = !this.sortUpdate;
    }    
  }

  /** CHANGE NAME
   * Event : on click send data to save new name
   * TO DO: call service on done
   * @param name
   * @param id
   */
  async changeName(id: number, newname: string) {
    for (let i in this.dataValue) {
      if (this.dataValue[i].id == id && this.dataValue[i].name != newname) {
        let source = ((this.dataValue[i].path == '/') ? '' : this.dataValue[i].path) + this.dataValue[i].name + this.dataValue[i].extension;
        let destination = ((this.dataValue[i].path == '/') ? '' : this.dataValue[i].path) + newname + this.dataValue[i].extension;
        let waitService = await this.fsService.renameFileFolder(source, destination).toPromise();
        if(waitService.status.toLowerCase() == 'success'){
          this.showMessage(this.renameSuccess, 'success');
          this.dataValue[i].name = newname;
          this.dataValue[i].realname = newname;
          this.dataValue[i].isRow = false;
          this.hideLoader();
          this.SidebarService.toggle(this.dataValue[i], id, 'group-folder');
          break;
        }
      }
    }
  }

  /** OPEN FOLDER
   * Get element name and file on click
   * Call service files to get content
   * @param name
   */
  openFolder(name: string) {
    let url = decodeURIComponent(this.router.url);
    if (url.includes('/filesharing/folder/')) {
      let check = '/filesharing/folder/';
      let index = url.indexOf(check);
      let pathvalue = url.slice(index + check.length);
      let home = '&home=';
      let path = pathvalue.slice((pathvalue.indexOf(home) + home.length));
      // Nuova gestione path
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
        this.dataSharingService.changePath(name);
      });;
      GroupfolderTableComponent.dataSourceStatic.data = [];
    } else {
      let check = '/filesharing/';
      let index = url.indexOf(check);
      let path = url.slice(index + check.length);
      // Nuova gestione path
      this.dataSharingService.changePath(name);
      name = name.replace(/\//g, '%252F');
      this.router.navigate(['filesharing', 'folder', name], { queryParams: { name: name, home: path } }).finally( () => {
        this.dataSharingService.changePath(name);
      });;
      GroupfolderTableComponent.dataSourceStatic.data = [];
    }
  }

  closeUpload(){
    this.serviceUpload.unsubscribe();
    this.isUploading = !this.isUploading;
    this.showMessage(this.dict.getDictionary('uploadStoped'), 'success');
  }

  /** CHECK NAME FILE/FOLDER CLICK **/
  onNameClick(element: any) {

    if (element.file) {

      if(this.util.allData.video.includes(element.extension) || this.util.allData.audio.includes(element.extension) ||
      this.util.allData.image.includes(element.extension)){
        this.openDialogAudioVideo(element);
      }else if(this.util.allData.pdf.includes(element.extension)){
        this.showLoader()
        let uri = element.path + ((element.realname)? element.realname : element.name) + element.extension;
        this.fsService.getBody(uri).subscribe((result: any) => {
          var reader = new FileReader();
          reader.readAsDataURL(result.body);
          reader.onloadend = function () {
            return reader.result;
          }

          var interval = setInterval(function(){
            if(reader.result){
              this.hideLoader();
              clearInterval(interval);
              this.openDialogPdf(element, reader.result);
            }
          }.bind(this), 1000);

        });
      } else if (this.util.allData.text.includes(element.extension) || this.util.allData.spredsheet.includes(element.extension) ||
        this.util.allData.powerpoint.includes(element.extension) || this.util.allData.richtext.includes(element.extension)) {
          let name = ((element.realname)? element.realname : element.name) + element.extension;
          let FilePath = element.path + ((element.realname)? element.realname : element.name) + element.extension;
          this.openOnlyOffice(element.id, name, FilePath);
      }

    } else {
      if (this.getpage != 'protected') {
        let completeName, arrayComplete = '';
        if (element.path.length > 0 && element.path != '/') {
          let testArray = element.path.split('/');
          for (let i in testArray) {
            if (testArray[i].length == 0)
              testArray.splice(i, 1);
          }
          //if(testArray[testArray.length - 1] == element.name) testArray.splice(testArray.length - 1, 1);
          arrayComplete = testArray.join('/');
        }

        completeName = arrayComplete + ((arrayComplete.length > 0) ? '/' : '') + element.name;
        this.openFolder(completeName);
      }
    }
  }

  /** OPEN ONLY OFFICE
   * Open file in new blank page 
   * @param id (number)
   * @param name (string) name and extension
   */
  openOnlyOffice(id: number, name: string, FilePath?: string){
    const fullName =  (FilePath) ? '%252F' + FilePath.replace(/\//g, '%252F') : name;
    let navigate = this.router.serializeUrl(
      this.router.createUrlTree([`/onlyoffice/${'id=' + id + '&name=' + fullName + '&shareToken='}`])
    );
    const fileTab =  window.open(navigate, '_blank');

    if (FilePath !== undefined) {
      // Track the file update in log collector
      const updateCheckInterval = setInterval(async function() {
        if (fileTab.closed) {
          let TimeTabCLosed = await this.fsService.getTimeClosed().toPromise();
          setTimeout( async() => {
            let waitService = await this.fsService.getAllFiles(FilePath).toPromise();
            if(waitService.status == 200) {
              let getLastModified = waitService.body.multistatus.response.propstat[0].prop.getlastmodified;
              if(getLastModified) {
                let TimeNow = TimeTabCLosed.timestamp * 1000;
                let dataReal = new Date(getLastModified).getTime();
                var compreso = dataReal >= (TimeNow - 15000) && dataReal <= (TimeNow + 15000);
                if(compreso) {
                  this.fsService.trackFileUpdate(FilePath).subscribe((result: any) => {
                  });
                }
              }
            }
          }, 15000);
          clearInterval(updateCheckInterval);
        }
      }.bind(this), 5000);
    }
  }

  getContentString() {
    let folders = 0, files = 0, size = 0;
    for (var i in this.dataValue) {
      folders = (!this.dataValue[i].file) ? folders + 1 : folders;
      files = (this.dataValue[i].file) ? files + 1 : files;
      size = (this.dataValue[i].fileWeight > 0) ? (size + parseInt(this.dataValue[i].fileWeight)) : size;
    }
    let string = folders + ' Cartelle e ' + files + ' Files - ' + this.util.getWeight(size) + ' occupati';
    return string;
  }

  openShare($event) {
    for (const i in this.dataValue) {
      if (this.dataValue[i].id === $event) {
        const data = { info: this.dataValue[i], tabToOpen: 'share' };
        this.SidebarService.toggle(data, $event, 'group-folder');
        break;
      }
    }
  }


/********************************************************/
/** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (START) ***/
/********************************************************/

receiveIdToggleRow() {
  this.selection.clear();
}

  /** RECEIVE ID DELETE
   * Get element id from sidebar after event delete
   * Hide element with boolean
   * Close list settings on done
   */
  async receiveIdDelete(arrayid: any) {
    this.showLoader();
    for(var i in arrayid){
      let element = arrayid[i];
      let path = (element.path)? element.path : element.homepath;
      path = (path!=undefined)? path : '/';
      let name = (element.realname)? element.realname : element.name;
      let waitService = await this.fsService.delete(path + name + element.extension).toPromise();
      if(waitService.status == 500){
        //this.showMessage(this.error_system, 'error');
        this.hideLoader();
        return;
      }//else if(waitService.status.toLowerCase() == 'success'){ //in attesa di fix BE
        else {
        element.hide = !element.hide;
        let index = this.dataValue.findIndex(x => x.id == element.id);
        this.dataValue.splice(index, 1);
      }
    }
    if(arrayid.length>1) this.showMessage(this.deleted_files, 'success');
    else this.showMessage(this.deleted_file, 'success');

    this.orderValues();

    if(this.dataValue.filter(x => x.hide == false).length==0){
      this.noData = true;
    }
    this.hideLoader();
  }

  async extractSignatureFile(arrayid: any){
    const verifyRequest = new ExtractSignedDocumentRequest();
    verifyRequest.fileId = arrayid;
    verifyRequest.destinationPath = '/';
    let waitService = await this.digitalSignatureService.extractDocumentSignature(verifyRequest).toPromise();
    if(waitService.Perfomed){
        if(waitService.Dto.existsBefore) this.showMessage(this.dict.getDictionary('errorExtractDone'), 'error');
        else this.showMessage(this.dict.getDictionary('extractDone'), 'success');
    }else this.showMessage(this.dict.getDictionary('errorExtract'), 'error');
  }

  /** MOVE FILE 
   * Get list id from sidebar
   * Hide then remove elements from list
   * Close list settings on done
   **/
  async moveFile(arrayid: any, finaldestination){
    this.showLoader();
    for(var i in arrayid){
      let name = (arrayid[i].realname)? arrayid[i].realname : arrayid[i].name;
      let source = arrayid[i].path + name + arrayid[i].extension;
      let completename = name + arrayid[i].extension;
      let destination = finaldestination + completename;
      let waitService = await this.fsService.moveFileFolder(source, destination).toPromise();
      if(waitService.status == 'success'){
        arrayid[i].hide = !arrayid[i].hide;
        let index = this.dataValue.findIndex(x => x.id == arrayid[i].id);
        this.dataValue.splice(index, 1);         
      }
    }

    if(arrayid.length>1) this.showMessage(this.movesSuccess, 'success');
    else this.showMessage(this.moveSuccess, 'success');

    this.hideLoader();
  }

  /** RECEIVE ID RENAME
   * Get element id from sidebar after event rename
   * Show rename input on table
   * Close list setting on done
   */
  receiveIdRename($event) {
    this.showLoader();
    let renameElement;
    this.dataValue.forEach(element => {
      if (element.id == $event) {
        renameElement = element;
        return;
      }
    });

    const dialogRef = this.dialog.open(RenameFileComponent, {
      width: '30%',
      height: '30%',
      data: renameElement,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.done) this.changeName(renameElement.id, result.name);
      else this.hideLoader();
    });
  }

  /** RECEIVE ID TOGGLE FAVORITE
   * Get element id from sidebar after event favorite
   * Hide element with boolean
   * Order list on done
   * @param $event (any) id of element
   */
  receiveIdToggleFavorite($event) {
    this.showLoader();
    let item;
    for(var i in this.dataValue){
      if(this.dataValue[i].id == $event){
        item = this.dataValue[i];
        break;
      }
    }
    
    this.fsService.addToFavorite(item.path + item.name + item.extension, item.favorite).subscribe((waitService: any) =>{
      if(waitService.status == 200){
        let message = (item.favorite)? this.dict.getDictionary('favorite_remove') : this.dict.getDictionary('favorite_add');
        this.showMessage(message, 'success');
        item.favorite = !item.favorite;
        this.orderValues();
      }
      this.hideLoader();
    });
  }

  cryptFile(id){
    for(var i in this.dataValue){
      if(this.dataValue[i].id == id){
        this.dataValue[i].hide = !this.dataValue[i].hide;
        let index = this.dataValue.findIndex(x => x.id == id);
        this.dataValue.splice(index, 1);
        break;
      }
    }
  }

/** RECEIVE ID DETAILS
 * Get element id from child after event open details
 * Open side bar with details
 * Close list setting on done
 */
receiveIdDetails($event: any) {
  if (this.isAllSelected()) {
    this.dataSource.data.forEach(row => { row.isRow = false; });
    this.SidebarService.toggle([], null, 'allfiles');
    this.selection.clear();
  }

  if ($event.image != 'storage') {
    this.clearRowAll();

    for (let i in this.dataValue) {
      if (this.dataValue[i].id == $event.id) {
        this.SidebarService.toggle(this.dataValue[i], $event.id, 'group-folder');
        this.selectedid = $event.id;
        this.dataValue[i].isRow = true;
        break;
      }
    }
  }
}

/** ON DRAG DROP
   * Used on upload fragdrop of files and folders
   * Upload first normal files then handle duplicate
   **/
 async onDragDrop(data: any){
  let entry = data.entry;
  let items = data.items;
  let path = new URLSearchParams(window.location.search).get('name');
  if(path && path.includes('%252F'))
    path = path.replace(/%252F/g, '/');
  path = (!!path) ? path + '/' : '';

  //Check and get duplicate
  let arrayOriginal = [], arrayNew = [];
  for(var i in entry){
    let checkExist = this.dataValue.some(el => (el.name + el.extension) == entry[i].name);
    if(checkExist){
      let index = this.dataValue.findIndex(el => (el.name + el.extension) == entry[i].name);
      arrayOriginal.push(this.dataValue[index]);
      arrayNew.push(entry[i]);
    }else{
      //If file/folder not duplicated => create them
      if(entry[i].type || items[i].isFile){
        this.uploadCheckedFile(path, entry[i], '');
      }else{
        let dataValue = this.util.getFolderElementAllfiles(entry[i], true, path);
        if(this.dataValue.length==0){
          this.dataValue.push(dataValue);
          this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
          this.dataSource.data = this.dataValue;
          this.noData = false;
        }else{
          this.dataValue.push(dataValue);
          this.dataSource.data = this.dataValue;
        }
        this.orderValues();
        let serviceWait = await this.fsService.createFolder(path + entry[i].name).toPromise();
        if(serviceWait.status == 'success'){
          await this._dragdrop.getUploadedFiles(items[i], '', path);
          this.showMessage(this.dict.getDictionary('folderCreated'),'success');
        }
      }
    }
  }

  if(arrayOriginal.length>0 && arrayNew.length>0){
    const dialogRef = this.dialog.open(DuplicateFileComponent, {
      width: '40%',
      height: '60%',
      data: { data: arrayOriginal, files: arrayNew }
    });
    dialogRef.afterClosed().subscribe(async result => {
      if(result.length==0){
        this.hideLoader();
      }else{
        for(var a in result){
          if(result[a].new && result[a].old){
            if(result[a].classimage != 'folder'){
              let count = 0;
              for (var b in this.dataValue) {
                if (this.dataValue[b].name.includes(result[a].name.slice(0, result[a].name.lastIndexOf('.'))))
                  count = count + 1;
              }
              let extension = result[a].name.slice(result[a].name.lastIndexOf('.'));
              let name = result[a].name.slice(0, result[a].name.lastIndexOf('.'));
              let realname = (count>1)? name + ' (' + count + ')' + extension : name + ' (' + 1 + ')' + extension;
              let index = arrayNew.findIndex(el => el.name == result[a].name);
              this.uploadCheckedFile(path, arrayNew[index], realname);
            }else{
              let count = 0;
              for (var ik in this.dataValue) {
                if (this.dataValue[ik].name == result[a].name || this.dataValue[ik].name.includes(result[a].name + '('))
                  count = count + 1;
              }
              let realname = (count>1)? result[a].name + ' (' + count + ')' : result[a].name + ' (' + 1 + ')';
              result[a].name = realname;
              let dataValue = this.util.getFolderElementAllfiles(result[a], true, path);
              if(this.dataValue.length==0){
                this.dataValue.push(dataValue);
                this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
                this.dataSource.data = this.dataValue;
                this.noData = false;
              }else{
                this.dataValue.push(dataValue);
                this.dataSource.data = this.dataValue;
              }
              this.orderValues();
              let serviceWait = await this.fsService.createFolder(path + result[a].name).toPromise();
              if(serviceWait.status == 'success'){
                await this._dragdrop.getUploadedFiles(items[a], result[a].name, path);
                this.showMessage(this.dict.getDictionary('folderCreated'),'success');
              }
            }
          }else if(result[a].new && !result[a].old){
            //files new then folders
            if(result[a].classimage != 'folder'){
              let index = arrayNew.findIndex(el => el.name == result[a].name);                
              this.uploadCheckedFile(path, arrayNew[index], '');
            }else{
              let waitService = await this.fsService.delete(path + result[a].name).toPromise();
              if(waitService.status.toLowerCase() == 'success'){
                let index2 = this.dataValue.findIndex(x => x.name == result[a].name);
                this.dataValue[index2].hide = !this.dataValue[index2].hide;                    
                this.dataValue.splice(index2, 1);

                let dataValue = this.util.getFolderElementAllfiles(result[a], true, path);
                if(this.dataValue.length==0){
                  this.dataValue.push(dataValue);
                  this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
                  this.dataSource.data = this.dataValue;
                  this.noData = false;
                }else{
                  this.dataValue.push(dataValue);
                  this.dataSource.data = this.dataValue;
                }
                this.orderValues();
                let serviceWait = await this.fsService.createFolder(path + result[a].name).toPromise();
                if(serviceWait.status == 'success'){
                  await this._dragdrop.getUploadedFiles(items[a], '', path);
                  this.showMessage(this.dict.getDictionary('folderCreated'),'success');
                }
              }
            }
          }
        }
      }
    });
  }
}

/** COMPONENT UPLOAD FILE
 * Upload file/folder on drag&drop
 * @param fileObj
 **/
componentUploadFile(fileObj) {
  this.componentUploadCount = 1;
  //this.componentIsLoading = true;
  var files = fileObj.files;
  var folder = new URLSearchParams(window.location.search).get('name');
  folder = (!!folder) ? folder + '/' : '';
  if (fileObj.isFolder) {
    var folderObj = fileObj.folderObj;
    this.dataSource.data.push(this.util.getFolderElement(folderObj, true, true));
    this.dataSource.filter = "";
    this.fsService.createFolder(folder + folderObj.name).subscribe((result: any) => {
      for (var file of files) {
        this.fsService.upload(folder + folderObj.name + '/' + file.name, file).subscribe((result: any) => {
          //if (this.componentUploadCount == files.length) this.componentIsLoading = false;
          this.componentUploadCount++;
        });
      }
    });
  } else {
    for (var file of files) {
      this.fsService.upload(folder + file.name, file).subscribe((result: any) => {
        this.dataSource.data.push(this.util.getElementByFile(files[this.componentUploadCount - 1], folder));
        this.dataSource.filter = "";
        //if (this.componentUploadCount == files.length) this.componentIsLoading = false;
        this.componentUploadCount++;
      });
    }
  }
}

  async getCopyFile(val, others) {
    if (Array.isArray(val)) {
      for (var a = 0; a < val.length; a++) {
        let count = 1;
        for (var b in this.dataValue) {
          if ((this.dataValue[b].name.includes(val[a].name) && this.dataValue[b].name.includes('(copy')) && this.dataValue[b].extension == val[a].extension) {
            count = count + 1;
          }
        }

        let source = val[a].path + val[a].name + val[a].extension;
        let name = val[a].name + ' (copy ' + count + ')' + val[a].extension
        let destination = others.destination + name;
        let waitService = await this.fsService.copyFile(source, destination).toPromise();
        if(waitService.status == 'success') this.showMessage(this.copySuccess, 'success');          
      }
      if (!others.destination || others.destination == '/') this.reload.emit('');
    } else {
      let count = 1
      for (var i in this.dataValue) {
        if ((this.dataValue[i].name.includes(val.name) && this.dataValue[i].name.includes('(copy')) && this.dataValue[i].extension == val.exte) {
          count = count + 1;
        }
      }

      let source = val.path + val.name + val.exte;
      let name = val.name + ' (copy ' + count + ')' + val.exte
      let destination = others.destination + name;
      let waitService = await this.fsService.copyFile(source, destination).toPromise();
      if(waitService.status == 'success'){
        this.showMessage(this.copySuccess, 'success');
        if (!others.destination || others.destination == '/') this.reload.emit('');
      }
    }
  }
/********************************************************/
/*** FUNCTIONS OR OUTPUT FUNCTION FROM SIDEBAR (END)   **/
/********************************************************/


/** OPEN DIALOG AUDIO-VIDEO FILE **/
openDialogAudioVideo(data): void {
  this.showLoader();
  
  this.fsService.getUrl(data).subscribe((result: any) => {
      const dialogRef = this.dialog.open(AudioVideoComponent, {
        width: '60%',
        height: '60%',
        data: {data: data, href: result}
      });

    dialogRef.afterClosed().subscribe(result => {});
    this.hideLoader();
  });
}

/** OPEN DIALOG PDF **/
openDialogPdf(data, base) {
  const dialogRef = this.dialog.open(DialogPdfComponent, {
    width: '70%',
    height: '85%',
    data: { data: data, base: base }
  });

  dialogRef.afterClosed().subscribe(result => {});
}

    /********************************************************/
   /************** FUNCTIONS CREATE (START)   **************/
  /********************************************************/

  /** CREATE NEW FOLDER
   * @param name (string) name of new folder
   **/
  async createNewFolder(data: any) {
    let name = data.name;
    if(!this.isLoading) this.showLoader();

    if(data.path){
      folder = data.path;
    }else{
      var folder = new URLSearchParams(window.location.search).get('name');
      if(folder){
        if(folder.includes('%252F')) folder = folder.replace(/%252F/g, '/');
        folder = (folder && folder.slice(-1)!='/') ? folder + '/' : folder;
      }else folder = '/';
    }

    let waitServiceCreate = await this.fsService.createFolder(folder + name).toPromise();
    if(waitServiceCreate.status.toLowerCase() == 'success'){
      if(data.path){
        this.showMessage(this.dict.getDictionary('folderCreated'),'success');
      }else{
        let waitServiceInfo = await this.fsService.getAllFiles(folder + name).toPromise();
        if(waitServiceInfo.status == 200){
          let dataValue = this.util.getFolderElement(waitServiceInfo.body.multistatus.response, false, false);
          if(this.dataValue.length==0){
            this.dataValue.push(dataValue);
            this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
            this.dataSource.data = this.dataValue;
          }else{
            this.dataValue.push(dataValue);
            this.dataSource.data = this.dataValue;
          }
          this.orderValues();
          this.hideLoader();
          this.showMessage(this.dict.getDictionary('folderCreated'),'success');
          this.noData = false;
        }
      }
    }
  }

  async createNewFileOO(name: string){
    if(!this.isLoading) this.showLoader();

    var folder = new URLSearchParams(window.location.search).get('name');
    if(folder && folder.includes('%252F'))
      folder = folder.replace(/%252F/g, '/');
    folder = (!!folder) ? folder + '/' : '';
    let checkEmpty = (this.dataValue.length>0)? false : true;

    let extension = name.substring(name.lastIndexOf('.'), name.length);
    let nameUsed = name.replace(extension, '');

    let waitService = await this.fsService.createOnlyOffice(name, folder, '').toPromise();
    if(waitService.status == 200){
      let waitServiceFiles = await this.fsService.getAllFiles(folder + '/' + name).toPromise();
      if(waitServiceFiles.status == 200){
        if(name.indexOf('.')!=0){
          let dataValue = this.util.getFileElementOO(nameUsed, extension, folder, waitServiceFiles.body.multistatus.response.propstat[0].prop);
          if(this.dataValue.length==0){
            this.dataValue.push(dataValue);
            this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
            this.dataSource.data = this.dataValue;
          }else{
            this.dataValue.push(dataValue);
            this.dataSource.data = this.dataValue;
          }
          this.orderValues();
          this.openOnlyOffice(waitService.body.id, waitService.body.name);
          this.hideLoader();
          this.noData = false;
        }
      }     
    }
  }

  async createNewFileTxt(name: string){
    if(!this.isLoading) this.showLoader();

    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';

    let waitService = await this.fsService.createNewTextFile(folder + '/' + name).toPromise();
    if(waitService.status.toLowerCase() == 'success'){
      if(name.indexOf('.')!=0){
        let waitServiceFiles = await this.fsService.getAllFiles(folder + '/' + name).toPromise();
        if(waitServiceFiles.status == 200){
          let fileid = waitServiceFiles.body.multistatus.response.propstat[0].prop.fileid;
          let file = waitServiceFiles.body.multistatus.response.propstat[0].prop;
          let dataValue = this.util.getFileElementTxt(name, fileid, folder, false, file);
          if(this.dataValue.length==0){
            this.dataValue.push(dataValue);
            this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
            this.dataSource.data = this.dataValue;
          }else{
            this.dataValue.push(dataValue);
            this.dataSource.data = this.dataValue;
          }
          this.orderValues();
          this.fsService.createSession(fileid, name).subscribe((resultcreate: any) => {
            this.openTextEditor(fileid, name, resultcreate);
          });
        }        
      }else{
        this.hideLoader();          
      }
    }
  }

  openTextEditor(fileid, name, resultcreate): void {
    this.hideLoader();
    const dialogRef = this.dialog.open(TextEditorComponent, {
      width: '70%',
      height: '70%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;

      var resultText = result.filetext.replace( /(<([^>]+)>)/ig, '');
      let steps = this.util.buildSteps(resultText);
      let data = {
        documentId: resultcreate.body.document.id,
        filePath: '/remote.php/dav/files/'+ resultcreate.body.session.userId+ '/' + name,
        sessionId: resultcreate.body.session.id,
        sessionToken: resultcreate.body.session.token,
        steps: steps,
        token: 0,
        version: resultcreate.body.document.currentVersion,         
      };
      this.fsService.pushNewFileText(data).subscribe((result: any) => {
        let data2 = {
          documentId: resultcreate.body.document.id,
          filePath: '/remote.php/dav/files/'+ resultcreate.body.session.userId+ '/' + name,
          force: false,
          manualSave: false,
          sessionId: resultcreate.body.session.id,
          sessionToken: resultcreate.body.session.token,
          token: null,
          version: resultcreate.body.document.currentVersion,
        };
        this.fsService.fileSync(data2).subscribe((result: any)=> {
          let data3 = {
            autosaveContent: resultText,
            documentId: resultcreate.body.document.id,
            filePath: '/remote.php/dav/files/'+ resultcreate.body.session.userId+ '/' + name,
            force: false,
            manualSave: false,
            sessionId: resultcreate.body.session.id,
            sessionToken: resultcreate.body.session.token,
            token: null,
            version: result.body.document.currentVersion,
          };
          this.fsService.fileSync(data3).subscribe((result: any)=> {
            this.fsService.closeSession(fileid, name).subscribe((result: any) => {});
          });
        });
      });
      this.hideLoader();
    });    
  }

  /**
   * Manage File Upload
   */
  uploadFile(fileObj) {
    var files = fileObj.files;
    var folder = new URLSearchParams(window.location.search).get('name');
    folder = (!!folder) ? folder + '/' : '';
    if (fileObj.isFolder) {
      var folderObj = fileObj.folderObj;
      let dataValue = this.util.getFolderElementAllfiles(folderObj, true, folder);
      if(this.dataValue.length==0){
        this.dataValue.push(dataValue);
        this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
        this.dataSource.data = this.dataValue;
        this.noData = false;
      }else{
        this.dataValue.push(dataValue);
        this.dataSource.data = this.dataValue;
      }
      this.orderValues();
      this.fsService.createFolder(folder + folderObj.name).subscribe((result: any) => {
        for (var file of files) {
          this.fsService.upload(folder + folderObj.name + '/' + file.name, file).subscribe((result: any) => {
            if (result.type === HttpEventType.UploadProgress) {
              this.isUploading = true;
              this.percentDone = Math.round(100 * (result.loaded / result.total));
            } 
    
            if (result.type === HttpEventType.Response)
              this.isUploading = false;
          });
        }
      });
    } else {
      let arrayCheck = [];
      let data = this.dataValue;
      for (var file of files) {
        for (var a in data) {
          if (data[a].name + data[a].extension == file.name) {
            arrayCheck.push(data[a]);
          }
        }
      }

      if (arrayCheck.length > 0) {
        const dialogRef = this.dialog.open(DuplicateFileComponent, {
          width: '40%',
          height: '60%',
          data: { data: arrayCheck, files: files }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(!result || result == undefined){
            this.hideLoader();
          }else if(result.length>0){
            for(var i in result){
              if(result[i].new && !result[i].old){
                for(var file of files){
                  if(file.name == result[i].name && file.name.indexOf('.')!=0){
                    this.uploadCheckedFile(folder, file, '');
                  }
                }
              } else if (result[i].new && result[i].old) {
                for (var check of files) {
                  let count = 0;
                  for (var a in data) {
                    if (data[a].name.includes(check.name.slice(0, check.name.lastIndexOf('.'))))
                      count = count + 1;
                  }
                  let extension = check.name.slice(check.name.lastIndexOf('.'));
                  let name = check.name.slice(0, check.name.lastIndexOf('.'));
                  let realname = (count>1)? name + ' (' + count + ')' + extension : name + ' (' + 1 + ')' + extension;
                  if(name.indexOf('.')!=0)
                  this.uploadCheckedFile(folder, check, realname);
                }
              } else {
                this.isUploading = false;
              }
            }
          } else {
            this.isUploading = false;
          }
        });
      }else{
        if(files.length>1){
          for(var size in files){
            if(typeof files[size].size == 'number')
              this.uploadTotal = this.uploadTotal + files[size].size;
          }
        }
        for(var file of files){
          if(file.name.indexOf('.')!=0)
          this.uploadCheckedFile(folder, file, '');
        }
      }
    }
  }

  /** UPLOAD CHECKED FILE **/
  uploadCheckedFile(folder, file, realname) {
    let sendname;
    if (realname.length > 0) sendname = realname;
    else sendname = file.name;
    if(folder && folder.includes('%252F'))
    folder = folder.replace(/%252F/g, '/');

    this.fsService.upload(folder + sendname, file).subscribe((result: any) => {
      let resultTotal = (this.uploadTotal>0)? this.uploadTotal : result.total;
      
      if (result.type === HttpEventType.UploadProgress) {
          this.isUploading = true;
          if(this.arrayTotal.length==0){
            this.arrayTotal.push({total: result.total, value: result.loaded});
            this.percentDone = Math.round(100 * (result.loaded / resultTotal));
          }else{
            let index = this.arrayTotal.findIndex(x => x.total == result.total)
            if(index < 0)this.arrayTotal.push({total: result.total, value: result.loaded});
            else this.arrayTotal[index].value = result.loaded;
            let loaded = this.arrayTotal.map(item => item.value).reduce((prev, next) => prev + next);
            this.percentDone = Math.round(100 * (loaded / resultTotal));
          }          
      } 

      if (result.type === HttpEventType.Response) {
        this.fsService.getAllFiles(folder + sendname).subscribe((result: any) => {
          for (var item of this.dataValue) {
            if ((item.name + item.extension) == sendname) {
              item.hide = !item.hide;
              break;
            }
          }
  
          let dataValue = this.util.getElementByFile(result.body.multistatus.response, folder);
          if(this.dataValue.length==0){
            this.dataValue.push(dataValue);
            this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
            this.dataSource.data = this.dataValue;
            this.noData = false;
          }else{
            this.dataValue.push(dataValue);
            this.dataSource.data = this.dataValue;
          }
          this.isUploading = false;
        });
      }
    });
  }

    /********************************************************/
   /*************** FUNCTIONS CREATE (END)  ****************/
  /********************************************************/

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.dataValue;
    if(!activity || activity.currentValue.length==0){
      this.dataValue = [];
      this.noData = true;
      this.hideLoader();
    }else if (activity.currentValue.length>0 && (!activity.previousValue || activity.previousValue.length>=0)) {
      this.showLoader();
      if(this.permissions){
        if(this.permissions.isCrearable)
          this.isCrearable = true;
  
        if(this.permissions.isSharable)
          this.isSharable = true;
  
        if(this.permissions.isDeletable)
          this.isDeletable = true;
      }

      this.dataSource = GroupfolderTableComponent.dataSourceStatic = new MatTableDataSource<FileSharingData>();
      this.dataSource.data = this.dataValue;
      this.getAllContent = this.getContentString();
      this.focusRowFavorites();
      this.hideLoader();
    }
  }

  ngOnDestroy(){
    if(this.otherServices) this.otherServices.unsubscribe();
    if(this.createServices) this.createServices.unsubscribe();
    if(this.sidebarServices) this.sidebarServices.unsubscribe();
    if(this.serviceUpload) this.serviceUpload.unsubscribe();

    this.dataSharingService.setFavoritesCardData(null);
    this.dataSharingService.setSharedFileId(null);
  }

}
