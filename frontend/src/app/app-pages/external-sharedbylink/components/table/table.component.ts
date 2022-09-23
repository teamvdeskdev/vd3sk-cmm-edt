import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Utilities, PublicData } from 'src/app/file-sharing/utilities';
import { __importDefault } from 'tslib';
import { FileSharingService } from 'src/app/file-sharing/services/file-sharing.service';
import { Router } from '@angular/router';
import { LinkTableSide, LinkSideTable } from 'src/app/file-sharing/services/sidebar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { UploadLink } from 'src/app/app-pages/external-sharedbylink/components/services/link.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LanguageService } from 'src/app/app-services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-table-link',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponentLink implements OnInit {
  /* @Input, @Output */
  @Input() dataValue;
  @Input() token;
  @Input() authorization;
  @Input() allPermission;
  @Input() noData;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() reload: EventEmitter<any> = new EventEmitter();
  @Output() newuploadFile = new EventEmitter();
  @ViewChild(MatSort) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  /* Others data value */
  util = new Utilities();
  data: any;
  getAllContent: string;
  user: string;
  newname: string;
  isLoading: boolean = false;
  uploadLink: Subscription;
  subLinkSideTable: Subscription;

  static isLoadingStatic: boolean;
  static utilStatic = new Utilities();
  static fsServiceStatic;
  static spinnerStatic;
  static routerStatic;
  static dialogStatic;
  static autorizationStatic;
  static staticnewuploadFile;
  /* For upload file count - loading image*/
  static uploadCount = 1;

  displayedColumns: string[] = ['select', 'id', 'image', 'name', 'dateFunc', 'weight', 'senddetails'];
  dataSource: MatTableDataSource<PublicData>;
  static dataSourceStatic;
  selection = new SelectionModel<PublicData>(true, []);

  constructor(
    private fsService: FileSharingService,
    private router: Router,
    private LinkTableSide : LinkTableSide,
    private LinkSideTable : LinkSideTable,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private _uploadLink: UploadLink,
    private _snackBar: MatSnackBar,
    private _spinner: NgxSpinnerService,
    public langService: LanguageService
  ) {
    this.uploadLink = this._uploadLink.changestatus.subscribe(data => {
      if(data.type == 'upload') this.uploadFile(data.data);
      else if(data.type == 'delete') this.deleteFiles(data.data);
      else if(data.type == 'folder') this.createFolder(data.data);
      else if(data.type == 'oofile') this.createOnlyOffice(data.data);
    });

    this.user = sessionStorage.getItem('user');

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    TableComponentLink.fsServiceStatic = fsService;
    TableComponentLink.routerStatic = router;
    TableComponentLink.spinnerStatic = spinner;
    TableComponentLink.dialogStatic = dialog;
    TableComponentLink.autorizationStatic = this.authorization;
    TableComponentLink.staticnewuploadFile = this.newuploadFile;
  }

  ngOnInit() {

    if (this.dataValue.length > 0 && this.dataValue) {
      this.data = this.dataValue;
    } else {
      this.data = [];
    }

    this.dataSource = TableComponentLink.dataSourceStatic = new MatTableDataSource<PublicData>();
    this.dataSource.data = this.data;

    this.getAllContent = this.getContentString();

    this.subLinkSideTable = this.LinkSideTable.change.subscribe(data => {
      if(data.type=='delete' || data.type=='move'){
        this.receiveIdDelete(data.id);
      }else if(data.type=='rename'){
        this.receiveIdRename(data.id);
      }else if(data.type=='copy'){
        if(Array.isArray(data.id)) this.getCopyFile(data.id, data.destination);
        else{
          let string = {
            completepath: data.id.completepath,
            name: data.id.name,
            extension: data.id.extension,
          }
          this.getCopyFile(string, data.destination);
        }
      }

    });
  }

  showLoader(){
    this.isLoading = true;
    this._spinner.show();
  }

  hideLoader(){
    this._spinner.hide();
    this.isLoading = false;
  }

  toastMessage(message, status){
    this._snackBar.open(message, '', {
      duration: 4000,
      panelClass: 'toast-' + status
    });
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
    if(this.isAllSelected()){
      this.dataSource.data.forEach(row => { row.isRow = false; });
      this.LinkTableSide.toggle(array, false);
      this.selection.clear();
    }else{
      this.dataSource.data.forEach(row => {
        row.isRow = true;
        array.push(row);
        this.selection.select(row);
      });
      this.LinkTableSide.toggle(array, true);
    }   
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PublicData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  /** ON SELECT ROW 
   * On select row send multiple data to sidebar
   *  Id is null on toggle (second value)
   **/
  onSelectRow($event, row){
    row.isRow = (this.selection.isSelected(row))? false : true;
    this.LinkTableSide.toggle(row, row.isRow);
    return `${$event ? this.selection.toggle(row) : null}`;
  }

  getContentString(){
    let folders=0, files=0, size=0;
    for(var i in this.data){
      folders = (!this.data[i].isfile)? folders+1 : folders;
      files = (this.data[i].isfile)? files+1 : files;
      size = (this.data[i].weight>0)? (size + parseInt(this.data[i].weight)) : size;
    }
    let string = folders + ' Cartelle e '+ files +' Files - '+ this.util.getWeight(size) +' occupati';
    return string;
  }

  ngOnChanges(changes: SimpleChanges) {
    const activity = changes.dataValue;
    if (activity.currentValue.length>0 && (activity.previousValue!=undefined && activity.previousValue.length>0)) {
      //this.ngOnInit();
    }
  }

  /* RECEIVE ID DETAILS
    Get id and send it to sidebar  
  */
  receiveIdDetails(id: number){
    this.dataSource.data.forEach(row => { row.isRow = false; });
    this.selection.clear();

    for(var i in this.data){
      if(this.data[i].id == id){
        this.LinkTableSide.toggle(this.data[i], null);
      }
    }
  }

  async uploadFile($event){
    this.showLoader();
    //this.checkDuplicated($event);

    if($event.length>0){
      let name = $event[0].name;
      this.fsService.uploadPublic(name, this.authorization, $event[0]).subscribe(async result => {
        if(result.status.toLowerCase() == 'success'){
          if(!$event.isFolder){
            let waitFile = await this.fsService.dataFilePublic(name, this.authorization).toPromise();
            if(waitFile.status == 200){
              let getFile = this.util.getPublicFile(waitFile.body.multistatus.response, false, '');
              this.data.push(getFile);
              this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
              this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
              this.dataSource = TableComponentLink.dataSourceStatic = new MatTableDataSource<PublicData>();
              this.dataSource.data = this.data;
              this.getAllContent = this.getContentString();
              if(this.noData) this.noData = !this.noData;
              this.hideLoader();
            }
          }
        }      
      });      
    }else{
      // Drag&Drop files
      if($event.files.length>0){
        for(var a in $event.files){
          if(!isNaN(parseInt(a))){
            let name = $event.files[a].name;
            this.fsService.uploadPublic(name, this.authorization, $event.files[a]).subscribe(async result => {
              if(result.status.toLowerCase() == 'success'){
                if(!$event.isFolder){
                  let waitFile = await this.fsService.dataFilePublic(name, this.authorization).toPromise();
                  if(waitFile.status == 200){
                    let getFile = this.util.getPublicFile(waitFile.body.multistatus.response, false, '');
                    this.data.push(getFile);
                    this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
                    this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
                    this.dataSource = TableComponentLink.dataSourceStatic = new MatTableDataSource<PublicData>();
                    this.dataSource.data = this.data;
                    this.getAllContent = this.getContentString();
                    if(this.noData) this.noData = !this.noData;
                    this.hideLoader();
                  }
                }
              }            
            });            
          }
        }
      }else{
        let folder = new URLSearchParams(window.location.search).get('name');
        folder = ( !! folder) ? folder + '/' : '';
        let folderObj = $event.folderObj;
        let waitFolder = await this.fsService.createFolderPublic(folder + folderObj.name, this.authorization).toPromise();
        if(waitFolder.status.toLowerCase() == 'success'){
          let waitFile = await this.fsService.dataFilePublic(folder + folderObj.name, this.authorization).toPromise();
          if(waitFile.status == 200){
            let getFile = this.util.getPublicFile(waitFile.body.multistatus.response, false, '');
            this.data.push(getFile);
            this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
            this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
            this.dataSource = TableComponentLink.dataSourceStatic = new MatTableDataSource<PublicData>();
            this.dataSource.data = this.data;
            for (var file of $event.files) {
              let waitUpload = await this.fsService.uploadPublic(folder + folderObj.name + '/' + file.name, this.authorization, file).toPromise();
            }
            this.hideLoader();
          }
        }
      }
    }
  }

  /** CREATE FOLDER
   * Create folder then recover data and add them to table
   * @param data (string) folder's name
   **/
  async createFolder(data: string){
    this.showLoader();
    let folder = new URLSearchParams(window.location.search).get('path');
    folder = ( !! folder) ? folder : '';
    let waitFolder = await this.fsService.createFolderPublic(folder + data, this.authorization).toPromise();
    if(waitFolder.status.toLowerCase() == 'success'){
      let waitFile = await this.fsService.dataFilePublic(folder + data, this.authorization).toPromise();
      if(waitFile.status == 200){
        let getFile = this.util.getPublicFile(waitFile.body.multistatus.response, false, '');
        this.data.push(getFile);
        this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
        this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
        this.dataSource = TableComponentLink.dataSourceStatic = new MatTableDataSource<PublicData>();
        this.dataSource.data = this.data;
        
        if(this.noData) this.noData = !this.noData;
        this.hideLoader();
      }
    }
  }

  async createOnlyOffice($event) {
    let pass = sessionStorage.getItem('pass');
    let waitCreate;
    if(pass){
      waitCreate = await this.fsService.createOnlyOfficePassword($event.name, $event.home, this.token, pass).toPromise();
    }else{
      waitCreate = await this.fsService.createOnlyOffice($event.name, $event.home, this.token).toPromise();
    }
    
      //this.ngOnInit();
    if(waitCreate.message.toLowerCase() == 'success'){
      let waitFile = await this.fsService.dataFilePublic($event.home + $event.name, this.authorization).toPromise();
      if(waitFile.status == 200){
        let getFile = this.util.getPublicFile(waitFile.body.multistatus.response, false, '');
        this.data.push(getFile);
        this.data.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? 1 : -1);
        this.data.sort((a, b) => (b.isfile < a.isfile) ? 1 : -1);
        this.dataSource = TableComponentLink.dataSourceStatic = new MatTableDataSource<PublicData>();
        this.dataSource.data = this.data;
        
        if(this.noData) this.noData = !this.noData;
        this.hideLoader();
      }
    }
      //this.openOnlyOffice(result.body.name, result.body.id);
  }

  navigateFolder(element: any){
    this.change.emit(element);
  }

  /** RECEIVE ID DELETE
   * Get element id from sidebar after event delete
   * Hide element with boolean
   * Close list settings on done
   */
  receiveIdDelete($event) {
    this.data.forEach(element => {
      if (element.id == $event) {
        element.hide = true;
      }
    });
  }

  async deleteFiles(data){
    this.showLoader();
    for(var i in data){
      let decodedPath = decodeURIComponent(data[i].completepath);
      let path = ((decodedPath.charAt(0)!='/')? '/':'') + decodedPath;
      let deleteService = await this.fsService.deleteFilesPublic(path, this.authorization).toPromise();
      if(deleteService.status.toLowerCase() != 'success'){
        this.toastMessage(this.langService.dictionary.errorDelete, 'error');
        this.hideLoader();
        break;
      }else{
        data[i].hide = !data[i].hide;
        let index = this.dataValue.findIndex(x => x.id == data[i].id);
        this.dataValue.splice(index, 1);
      }
    }
    if(this.dataValue.length == 0)
      this.noData = !this.noData;

    this.hideLoader();
    this.toastMessage(this.langService.dictionary.deleted_files_success, 'success');
  }

  /** RECEIVE ID RENAME
   * Get element id from sidebar after event rename
   * Toggle rename div
   */
  receiveIdRename(id: number){
    this.data.forEach(element => {
      if(element.id == id){
        element.rename = !element.rename;
        this.newname = (element.rename)? element.name : ''
      }
    });
  }

  /** CHANGE NAME
   * Event : on click send data to save new name
   * @param name
   * @param id
   */
  changeName(id: number) {
    let source = '', destination = '';
    for(let i in this.data){
      if(this.data[i].id == id && this.data[i].name != this.newname){
        source = decodeURIComponent(this.data[i].completepath);
        destination = source.replace(this.data[i].name, this.newname);
        this.fsService.moveFilePublic('/'+source, '/'+destination, this.authorization).subscribe((result: any) => {
          this.data[i].name = this.newname;
          this.data[i].rename = !this.data[i].rename;
          this.data[i].completepath = destination;
          this.data[i].completeName = this.newname + this.data[i].extension;
          this.LinkTableSide.toggle(this.data[i], null);
        });
        break;
      }
    }
  }

  getCopyFile(val, others){
    if(Array.isArray(val)){
      for(var a=0; a<val.length; a++){
        let count = 1;
        for(var b in this.data){
          if((this.data[b].name.includes(val[a].name) && this.data[b].name.includes('(copy')) && this.data[b].extension == val[a].extension){
            count = count + 1;
          }
        }

        let source = '/' + decodeURIComponent(val[a].completepath);
        let name = val[a].name + ' (copy '+ count +')' + val[a].extension;
        let destination = others.destination + name;
        this.fsService.copyFilePublic(source, destination, this.authorization).subscribe((result: any) => {});
      }
      if(!others.destination || others.destination=='/') this.reload.emit('');
    }else{
      let count = 1
      for(var i in this.data){
        if((this.data[i].name.includes(val.name) && this.data[i].name.includes('(copy')) && this.data[i].extension == val.exte){
          count = count + 1;
        }
      }

      let source = '/' + decodeURIComponent(val.completepath);
      let name = val.name + ' (copy '+ count +')' + val.extension;
      let destination = others.destination + name;
      this.fsService.copyFilePublic(source, destination, this.authorization).subscribe((result: any) => {
        if(!others.destination || others.destination=='/') this.reload.emit('');
      });
    }
  }

  ngOnDestroy(){
    if(this.uploadLink){
      this.uploadLink.unsubscribe();
    }
    if(this.subLinkSideTable){
      this.subLinkSideTable.unsubscribe();
    }
  }

}
